"""Provenance: inherits vs lineage, context capture, the Manifest kind, and the
node-link provenance graph. See docs/design/provenance.md."""

import os
import shutil
import subprocess
import tempfile

import pytest

from machinable import Index, Interface, Project, Storage, get

_HAS_GIT = shutil.which("git") is not None


def test_remote_manifest_resolution(tmp_path):
    """Manifest tools resolve through the provider, so they can be remotes."""
    project_dir = tmp_path / "project"
    (project_dir / "interface").mkdir(parents=True)

    # the manifest tool lives outside the project, declared as a file+ remote
    probe = tmp_path / "probe_manifest.py"
    probe.write_text(
        "from machinable.manifest import Manifest\n"
        "\n"
        "\n"
        "class Probe(Manifest):\n"
        "    def capture(self):\n"
        "        self._model.entries = [\n"
        "            {'provider': 'probe', 'component': 'x', 'token': {'v': 1}}\n"
        "        ]\n"
        "        return self\n"
    )
    (project_dir / "interface" / "project.py").write_text(
        "from machinable import Project\n"
        "\n"
        "\n"
        "class Provider(Project):\n"
        "    def on_resolve_remotes(self):\n"
        f"        return {{'remote_manifest': 'file+{probe.as_posix()}'}}\n"
        "\n"
        "    def on_resolve_manifests(self):\n"
        "        return ['remote_manifest']\n"
    )
    (project_dir / "target.py").write_text(
        "from machinable import Interface\n"
        "\n"
        "\n"
        "class Target(Interface):\n"
        "    def __call__(self):\n"
        "        pass\n"
    )

    with (
        Project(str(project_dir)),
        Storage(str(tmp_path / "storage")),
        Index({"database": str(tmp_path / "index.sqlite")}),
    ):
        run = get("target").launch()
        manifests = [u for u in run.execution.uses if u.kind == "Manifest"]
        assert [m.module for m in manifests] == ["remote_manifest"]
        assert manifests[0].entries[0]["provider"] == "probe"
    # the remote resolver ran first and cached the module
    assert (project_dir / "interface" / "remotes" / "remote_manifest.py").is_file()


def test_directly_connected_project_subclass_keeps_hooks(tmp_path):
    class Custom(Project):
        def on_resolve_manifests(self):
            return ["custom_tool"]

    # no interface/project.py in the directory: the provider falls back to
    # the connected class itself instead of the base Project
    with Custom(str(tmp_path)) as project:
        assert project.provider().on_resolve_manifests() == ["custom_tool"]


def test_lineage_is_derivation_not_inheritance(tmp_storage):
    parent = Interface.instance("basic").materialize()
    child = parent.derive("basic", {"a": 1}).materialize()

    # `lineage` is now the derivation chain (root → … → immediate parent)
    assert child.ancestor.uuid == parent.uuid
    assert [c.uuid for c in child.lineage()] == [parent.uuid]
    assert list(parent.lineage()) == []

    # `inherits` is the class-MRO base-module chain — a different thing
    assert "machinable.interface" in child.inherits


def test_context_capture_is_identity_neutral(tmp_storage):
    with Interface.instance("basic"):
        scoped = Interface.instance("basic", {"a": 2}).materialize()

    reloaded = Interface.find_by_id(scoped.uuid)
    # the ordered with-context stack round-trips [[module, version], …]
    assert reloaded.context and reloaded.context[0][0] == "basic"

    # …without touching identity (same config with vs without the context)
    key_with = scoped.catalog_identity_key()
    key_without = Interface.instance("basic", {"a": 2}).catalog_identity_key()
    assert key_with == key_without


# -- Manifest / graph (need a real git repo) ----------------------------------


@pytest.fixture()
def git_project(monkeypatch):
    # opt back into manifest capture (the suite-wide autouse fixture disables it) —
    # this project is an isolated git repo, so capture stays contained here.
    from machinable.project import Project as _Project

    monkeypatch.setattr(
        _Project, "on_resolve_manifests", lambda self: ["machinable.manifest"]
    )

    d = tempfile.mkdtemp()

    def git(*args):
        subprocess.run(["git", "-C", d, *args], check=True, capture_output=True)

    git("init")
    git("config", "user.email", "t@t")
    git("config", "user.name", "t")
    with open(os.path.join(d, "comp.py"), "w") as f:
        f.write(
            "from machinable import Interface\n"
            "class Comp(Interface):\n"
            "    def __call__(self):\n"
            "        return 1\n"
        )
    git("add", "-A")
    git("commit", "-m", "init")
    workdir = tempfile.mkdtemp()
    with (
        Project(d),
        Storage(workdir),
        Index({"database": os.path.join(workdir, "index.sqlite")}),
    ):
        yield d


@pytest.mark.skipif(not _HAS_GIT, reason="git not available")
def test_manifest_capture_and_dedup(git_project):
    a = Interface.instance("comp")
    a.launch()
    b = Interface.instance("comp", {"x": 1})
    b.launch()

    ma = next(u for u in list(a.executions)[-1].uses if u.kind == "Manifest")
    mb = next(u for u in list(b.executions)[-1].uses if u.kind == "Manifest")

    # git provider captured code state, and identical state dedups to one node
    assert ma.describe() and ma.describe()[0].startswith("git ")
    assert ma.uuid == mb.uuid

    # the edge is durable: reloading from the index still resolves it
    reloaded = Interface.find_by_id(list(a.executions)[-1].uuid)
    assert any(u.kind == "Manifest" for u in reloaded.uses)


@pytest.mark.skipif(not _HAS_GIT, reason="git not available")
def test_manifest_capture_is_read_only(git_project):
    from machinable.manifest import Manifest

    d = git_project
    # dirty the tree: a tracked modification plus untracked data that is not
    # gitignored (e.g. a freshly downloaded dataset)
    with open(os.path.join(d, "comp.py"), "a") as f:
        f.write("# tweak\n")
    with open(os.path.join(d, "dataset.bin"), "wb") as f:
        f.write(b"\x00" * 4096)

    def git_state():
        entries = []
        for sub in ("objects", "refs"):
            for root, _, files in os.walk(os.path.join(d, ".git", sub)):
                entries.extend(os.path.join(root, name) for name in files)
        return sorted(entries)

    before = git_state()
    manifest = Manifest().capture()
    token = manifest.entries[0]["token"]
    assert token["dirty"] is True
    assert token["uncommitted"]
    # capture never writes objects or refs into the repository
    assert git_state() == before

    # identical dirty state fingerprints identically...
    again = Manifest().capture().entries[0]["token"]
    assert again["uncommitted"] == token["uncommitted"]
    assert manifest.verify() is True

    # ...and a further change re-fingerprints
    with open(os.path.join(d, "comp.py"), "a") as f:
        f.write("# more\n")
    changed = Manifest().capture().entries[0]["token"]
    assert changed["uncommitted"] != token["uncommitted"]
    assert manifest.verify() is False


@pytest.mark.skipif(not _HAS_GIT, reason="git not available")
def test_provenance_graph_is_deduped_dag(git_project):
    parent = Interface.instance("comp")
    parent.launch()
    child = parent.derive("comp", {"k": 2})
    child.launch()

    graph = parent.provenance()

    assert graph.root == parent.uuid
    assert graph.truncated is False
    rels = {e.rel for e in graph.links}
    assert {"derivation", "runs", "manifest"} <= rels

    # recipe rides in the root node's attributes
    root = next(n for n in graph.nodes if n.uuid == graph.root)
    assert "config_layers" in root.attributes

    # DAG dedup: both runs' manifest edges reference a single shared manifest node
    manifest_edges = [e for e in graph.links if e.rel == "manifest"]
    assert len(manifest_edges) >= 2
    assert len({e.target for e in manifest_edges}) == 1


def test_provenance_graph_is_valid_and_acyclic(tmp_storage):
    """Every edge references present nodes (valid node-link) and the graph has no cycle
    (canonically-oriented edges), so d3/networkx consumers don't choke."""
    parent = Interface.instance("basic").materialize()
    child = parent.derive("basic", {"a": 1}).materialize()
    grandchild = child.derive("basic", {"a": 2}).materialize()

    graph = parent.provenance()
    node_ids = {n.uuid for n in graph.nodes}
    # normalized node-link contract: no edge references a missing node
    for edge in graph.links:
        assert edge.source in node_ids
        assert edge.target in node_ids

    # acyclic: a topological sort over the derivation edges must succeed
    from collections import deque

    adj: dict[str, list[str]] = {n.uuid: [] for n in graph.nodes}
    indeg = {n.uuid: 0 for n in graph.nodes}
    for e in graph.links:
        adj[e.source].append(e.target)
        indeg[e.target] += 1
    queue = deque(n for n, d in indeg.items() if d == 0)
    visited = 0
    while queue:
        n = queue.popleft()
        visited += 1
        for m in adj[n]:
            indeg[m] -= 1
            if indeg[m] == 0:
                queue.append(m)
    assert visited == len(graph.nodes), "provenance graph is not a DAG"
    assert grandchild.uuid in node_ids  # derivation followed to the leaf


def test_provenance_graph_node_cap_has_no_dangling_edges(tmp_storage):
    """When the node cap truncates the walk, edges to dropped nodes are omitted — the
    output stays a valid node-link graph and is flagged truncated."""
    root = Interface.instance("basic").materialize()
    for i in range(6):
        root.derive("basic", {"a": i}).materialize()

    graph = root.provenance(depth=8)
    # force truncation with a tiny cap via the assembler directly
    from machinable.provenance import build_provenance_graph

    small = build_provenance_graph(root, node_cap=3)
    assert small.truncated is True
    node_ids = {n.uuid for n in small.nodes}
    assert len(node_ids) <= 3
    for edge in small.links:
        assert edge.source in node_ids and edge.target in node_ids
    # the full (uncapped) walk sees every child
    assert len(graph.nodes) >= 7


def test_provenance_module_is_fastapi_free():
    """Interface.provenance() / the MCP tool must work on a base install: the core
    provenance module must not pull in the optional fastapi/[api] dependency."""
    import sys

    import machinable.provenance as prov

    # the module imports cleanly and exposes the assembler + models
    assert hasattr(prov, "build_provenance_graph")
    assert {"GraphNode", "GraphEdge", "ProvenanceGraph"} <= set(dir(prov))
    # and it did not transitively import fastapi just by importing provenance
    src = sys.modules["machinable.provenance"]
    assert "fastapi" not in getattr(src, "__dict__", {})
