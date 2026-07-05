"""The provenance graph: a normalized node-link DAG of how a result came to be.

Core (no HTTP/FastAPI dependency) so ``Interface.provenance()`` and the MCP tool work
on a base install. ``related`` is the depth-1 slice; the full walk assembles recipe
(config/context/derivation) ⊕ history (executions, each with the Manifest it used). One
assembler shared by the REST route, the MCP tool, and ``Interface.provenance()``.
"""

from __future__ import annotations

import json
from typing import TYPE_CHECKING, Any

from pydantic import BaseModel, Field

from machinable.utils import serialize

if TYPE_CHECKING:
    from machinable.interface import Interface


# the recipe/history axis: cheap to follow to their extremes (trees / single hops).
_PROVENANCE_DEEP_RELS = frozenset({"derivation", "runs", "manifest"})


class GraphNode(BaseModel):
    """One node in a provenance graph.

    ``attributes`` is the per-kind open facet (==
    ``Interface.on_provenance_attributes()``): an Execution carries seed/timing, a
    Manifest its entries, a recipe interface its config layers + context.
    """

    uuid: str
    kind: str
    module: str | None = None
    version: list[str | dict] = Field(default_factory=list)
    label: str | None = None
    attributes: dict[str, Any] = Field(default_factory=dict)


class GraphEdge(BaseModel):
    """A typed, directed edge referencing nodes by uuid."""

    source: str
    target: str
    rel: str = Field(description="derivation | context | uses | runs | manifest | …")


class ProvenanceGraph(BaseModel):
    """Normalized node-link DAG: how a result came to be.

    Nodes appear once; shared nodes (a Manifest used by many runs) are referenced by
    many edges, never duplicated. Every edge's ``source``/``target`` is guaranteed
    present in ``nodes``.
    """

    root: str
    nodes: list[GraphNode] = Field(default_factory=list)
    links: list[GraphEdge] = Field(default_factory=list)
    truncated: bool = Field(
        default=False, description="True when a node cap bounded the walk."
    )


def _json_attributes(attrs: dict) -> dict:
    """Normalize per-kind attributes to JSON-native values (datetime/UUID/BaseModel/.

    OmegaConf → native) without the API's fastapi-bound ``json_payload``.
    """
    return json.loads(json.dumps(attrs, default=serialize))


def _graph_node(interface: Interface) -> GraphNode:
    """One provenance node; ``attributes`` comes from the kind's polymorphic.

    ``on_provenance_attributes()`` hook (recipe vs history split lives on the class).
    """
    return GraphNode(
        uuid=interface.uuid or "",
        kind=interface.kind or "Interface",
        module=interface.module,
        version=interface.version(),
        label=interface.label,
        attributes=_json_attributes(interface.on_provenance_attributes()),
    )


def build_provenance_graph(
    interface: Interface,
    *,
    depth: int = 8,
    rels: set[str] | None = None,
    node_cap: int = 200,
) -> ProvenanceGraph:
    """Assemble the normalized node-link provenance DAG rooted at ``interface``.

    Default policy (``rels=None``): follow ``derivation``/``runs``/``manifest`` deeply
    and ``uses`` one hop: complete at a glance without paying for the transitive
    closure. A node cap bounds the walk and sets ``truncated``. Shared nodes (a
    manifest used by many runs) appear once, referenced by many edges. An edge is
    emitted only when *both* endpoints fit under the cap, so the output is always a
    valid node-link graph (no edge references a missing node).
    """
    nodes: dict[str, GraphNode] = {}
    links: list[GraphEdge] = []
    seen_edges: set = set()
    state = {"truncated": False}

    def add_node(iface: Interface) -> bool:
        if iface.uuid in nodes:
            return True
        if len(nodes) >= node_cap:
            state["truncated"] = True
            return False
        nodes[iface.uuid or ""] = _graph_node(iface)
        return True

    def add_edge(src: Interface, rel: str, tgt: Interface) -> None:
        # both endpoints must be present, else the node-link graph is invalid.
        if not add_node(src) or not add_node(tgt):
            return
        key = (src.uuid, tgt.uuid, rel)
        if key in seen_edges:
            return
        seen_edges.add(key)
        links.append(GraphEdge(source=src.uuid or "", target=tgt.uuid or "", rel=rel))

    add_node(interface)
    if rels is None:
        passes = [(set(_PROVENANCE_DEEP_RELS), depth), ({"uses"}, 1)]
    else:
        passes = [(set(rels), depth)]
    for rset, dep in passes:
        for src, rel, tgt in interface.walk(rels=rset, depth=dep):
            add_edge(src, rel, tgt)

    return ProvenanceGraph(
        root=interface.uuid or "",
        nodes=list(nodes.values()),
        links=links,
        truncated=state["truncated"],
    )
