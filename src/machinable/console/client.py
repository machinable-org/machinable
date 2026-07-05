"""Async HTTP client for the machinable API, used by the console.

A thin, dependency-light wrapper over ``httpx`` that returns parsed JSON and
normalizes transport/HTTP failures into :class:`ConsoleError`, so screens can
render an error line instead of crashing the terminal. Depends only on httpx
(not textual), and accepts a custom transport so tests can drive it against
the FastAPI app in-process via ``httpx.ASGITransport``.
"""

from __future__ import annotations

from typing import Any

import httpx


class ConsoleError(RuntimeError):
    """A request failed; the message is safe to render in the UI."""


class ConsoleClient:
    """Client for the subset of the API the console uses."""

    def __init__(
        self,
        url: str,
        token: str | None = None,
        *,
        timeout: float = 10.0,
        transport: httpx.AsyncBaseTransport | None = None,
    ) -> None:
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        self.url = url.rstrip("/")
        self._client = httpx.AsyncClient(
            base_url=self.url,
            headers=headers,
            timeout=timeout,
            transport=transport,
        )

    async def aclose(self) -> None:
        """Close the underlying connection pool."""
        await self._client.aclose()

    async def _request(self, method: str, path: str, **kwargs: Any) -> Any:
        try:
            response = await self._client.request(method, path, **kwargs)
        except httpx.HTTPError as ex:
            raise ConsoleError(f"{self.url}: {ex}") from ex
        if response.status_code >= 400:
            detail = ""
            try:
                detail = response.json().get("detail", "")
            except Exception:  # noqa: BLE001 - non-JSON error body
                detail = response.text[:200]
            raise ConsoleError(f"{method} {path} -> {response.status_code} {detail}")
        if response.status_code == 204 or not response.content:
            return None
        return response.json()

    async def health(self) -> dict:
        """Server health; also the connectivity/auth probe on startup."""
        return await self._request("GET", "/v1/health")

    async def modules(self) -> list[dict]:
        """Discoverable interface modules of the connected project."""
        payload = await self._request("GET", "/v1/project")
        return list(payload.get("modules", []))

    async def module_schema(self, module: str) -> dict:
        """Config fields and ~version vocabulary for one module."""
        return await self._request("GET", f"/v1/project/{module}")

    async def resolve(self, target: str, version: list | None = None) -> dict:
        """Dry-run a compact version to its resolved config and CLI."""
        return await self._request(
            "POST",
            "/v1/interfaces/resolve",
            json={"target": target, "version": version or []},
        )

    async def lifecycle(self, target: str, version: list | None = None) -> dict:
        """Content-addressed compute lifecycle: draft/running/cached/failed."""
        return await self._request(
            "POST",
            "/v1/interfaces/lifecycle",
            json={"target": target, "version": version or []},
        )

    async def dispatch(self, target: str, version: list | None = None) -> dict:
        """Dispatch one interface into a new Execution; returns its run-record."""
        return await self._request(
            "POST",
            "/v1/executions",
            json={"interfaces": [{"target": target, "version": version or []}]},
        )

    async def search(
        self,
        *,
        module: str | None = None,
        kind: str | None = None,
        limit: int = 500,
        offset: int = 0,
    ) -> dict:
        """Search interface records; returns ``{items, total}``."""
        body: dict[str, Any] = {
            "limit": limit,
            "offset": offset,
            "sort": [{"by": "created_at_ns", "direction": "desc"}],
        }
        if module:
            body["module"] = module
        if kind:
            body["kind"] = kind
        return await self._request("POST", "/v1/interfaces/search", json=body)

    async def interface(self, uuid: str) -> dict:
        """Full info for one interface record."""
        return await self._request("GET", f"/v1/interfaces/{uuid}")

    async def interface_executions(self, uuid: str) -> list[dict]:
        """Run history for an interface, newest first."""
        return await self._request("GET", f"/v1/interfaces/{uuid}/executions")

    async def provenance(self, uuid: str, depth: int = 8) -> dict:
        """The record's provenance as a node-link DAG."""
        return await self._request(
            "GET", f"/v1/interfaces/{uuid}/provenance", params={"depth": depth}
        )

    async def call(
        self,
        target: str,
        method: str,
        args: list | None = None,
        kwargs: dict | None = None,
    ) -> Any:
        """Invoke a method on an interface; returns the JSON payload."""
        payload = await self._request(
            "POST",
            "/v1/interfaces/call",
            json={
                "target": target,
                "method": method,
                "args": args or [],
                "kwargs": kwargs or {},
            },
        )
        return payload.get("payload")

    async def files(self, uuid: str) -> list[str]:
        """Relative paths of the record's stored files."""
        payload = await self._request("GET", f"/v1/interfaces/{uuid}/files")
        return list(payload.get("files", []))

    async def read_file(self, uuid: str, path: str) -> Any:
        """A stored file's content (parsed for ``.json``, text otherwise)."""
        return await self._request("GET", f"/v1/interfaces/{uuid}/files/{path}")

    async def executions(
        self, *, active: bool | None = None, limit: int = 100
    ) -> list[dict]:
        """Execution run-records, optionally only the active ones."""
        params: dict[str, Any] = {"limit": limit}
        if active is not None:
            params["active"] = active
        return await self._request("GET", "/v1/executions", params=params)

    async def execution(self, uuid: str) -> dict:
        """One execution run-record with lifecycle status."""
        return await self._request("GET", f"/v1/executions/{uuid}")

    async def output(self, uuid: str) -> str | None:
        """The run's captured output, or None before it started."""
        payload = await self._request("GET", f"/v1/executions/{uuid}/output")
        return payload.get("output")

    async def cancel(self, uuid: str) -> None:
        """Best-effort cancel (writes the ``cancelled`` marker)."""
        await self._request("POST", f"/v1/executions/{uuid}/cancel")

    async def remotes(self) -> dict:
        """Declared remote modules: module path → source URL (or list)."""
        payload = await self._request("GET", "/v1/project/remotes")
        return dict(payload.get("remotes", {}))
