// The default Host Adapter — a plain-fetch implementation of `WidgetHostAdapter`
// against the machinable HTTP API. This is what makes the SDK a standalone web
// client: a bare machinable server (or a Jupyter anywidget cell pointing at one)
// needs zero host code. Hosts with their own substrate (captu: Tauri) implement
// the adapter themselves and ignore this file.

import { moduleSchemaFromServer, shortIdentity } from './introspection';
import type {
	CatalogPage,
	CatalogQuery,
	FindResult,
	ModuleSchema,
	OutputChunk,
	ProvenanceRecord,
	Ref,
	ResolveIssue,
	ResolveResult,
	RunRecord,
	SourceContent,
	SourceFile,
	Version,
	WidgetHostAdapter
} from './types';

interface RequestOptions {
	method?: string;
	body?: unknown;
}

class HttpError extends Error {
	status: number;
	detail: unknown;
	constructor(status: number, detail: unknown) {
		super(typeof detail === 'string' ? detail : JSON.stringify(detail));
		this.status = status;
		this.detail = detail;
	}
}

function refBody(ref: Ref): { target: string; version: Version } {
	return { target: ref.target, version: ref.version ?? [] };
}

/** Language hint for the code viewer, from the file extension. */
function languageOf(path: string): string | undefined {
	if (path.endsWith('.py')) return 'python';
	if (path.endsWith('.js') || path.endsWith('.mjs')) return 'javascript';
	if (path.endsWith('.ts')) return 'typescript';
	if (path.endsWith('.json')) return 'json';
	if (path.endsWith('.yaml') || path.endsWith('.yml')) return 'yaml';
	if (path.endsWith('.md')) return 'markdown';
	return undefined;
}

/**
 * Create the default adapter for a machinable server.
 *
 * `connect(url, token)` rebinds the base URL/token at connect time (the shell's
 * connect panel), so the constructor arguments are only the initial defaults.
 */
export function createAdapter(url?: string, token?: string): WidgetHostAdapter {
	let baseUrl = (url ?? 'http://127.0.0.1:8000').replace(/\/+$/, '');
	let bearer = token;

	async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
		const headers: Record<string, string> = {};
		if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
		if (bearer) headers['Authorization'] = `Bearer ${bearer}`;
		const response = await fetch(baseUrl + path, {
			method: opts.method ?? (opts.body !== undefined ? 'POST' : 'GET'),
			headers,
			body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined
		});
		if (!response.ok) {
			let detail: unknown = response.statusText;
			try {
				detail = (await response.json())?.detail ?? detail;
			} catch {
				/* non-JSON error body */
			}
			throw new HttpError(response.status, detail);
		}
		if (response.status === 204) return undefined as T;
		return (await response.json()) as T;
	}

	/** Map a 400 detail (string, or Phase-C `{message, issues}`) to ResolveIssues. */
	function toIssues(detail: unknown): ResolveIssue[] {
		if (detail && typeof detail === 'object' && Array.isArray((detail as any).issues)) {
			return (detail as any).issues.map((issue: any) => ({
				path: issue.path ?? undefined,
				message: String(issue.message ?? issue)
			}));
		}
		return [{ message: typeof detail === 'string' ? detail : JSON.stringify(detail) }];
	}

	return {
		connect: async (url, token) => {
			baseUrl = url.replace(/\/+$/, '');
			bearer = token;
			try {
				await request<{ status: string }>('/v1/health');
				const project = await request<{ project?: string; modules?: { module: string }[] }>(
					'/v1/project'
				);
				return {
					connected: true,
					modules: (project.modules ?? []).map((m) => m.module),
					project: project.project
				};
			} catch (e) {
				const message = e instanceof Error ? e.message : String(e);
				return { connected: false, message };
			}
		},
		// the default adapter trusts what you point it at; hosts with a security
		// gate (captu) implement their own trust store
		trust: async () => {},

		listModules: async () => {
			const payload = await request<{ modules?: { module: string; kind?: string; doc?: string | null }[] }>(
				'/v1/project'
			);
			return (payload.modules ?? []).map((m) => ({
				module: m.module,
				kind: m.kind,
				doc: m.doc ?? undefined
			}));
		},

		introspect: async (module): Promise<ModuleSchema> => {
			const raw = await request<Record<string, unknown>>(
				`/v1/project/${encodeURIComponent(module)}`
			);
			return moduleSchemaFromServer(module, raw);
		},

		resolve: async (module, version): Promise<ResolveResult> => {
			try {
				const r = await request<{
					config: Record<string, unknown>;
					cli: string;
					predicate?: Record<string, unknown>;
				}>('/v1/interfaces/resolve', { body: { target: module, version } });
				return {
					ok: true,
					config: r.config,
					cli: r.cli,
					predicate: r.predicate,
					identity: shortIdentity(r.predicate ?? r.config)
				};
			} catch (e) {
				if (e instanceof HttpError && e.status === 400) return { ok: false, issues: toIssues(e.detail) };
				throw e;
			}
		},

		dispatch: async (target, version, opts) => {
			const body: Record<string, unknown> = {
				interfaces: [
					{ target, version, context: (opts?.context ?? []).map(refBody) }
				]
			};
			if (opts?.execution) body.execution = refBody(opts.execution);
			if (opts?.executionRef) body.execution_ref = opts.executionRef;
			const r = await request<{ uuid: string }>('/v1/executions', { body });
			return { executionRef: r.uuid };
		},

		find: async (module, version, opts): Promise<FindResult> => {
			const r = await request<{
				status: FindResult['status'];
				uuid?: string | null;
				execution_uuid?: string | null;
			}>('/v1/interfaces/lifecycle', {
				body: { target: module, version, context: (opts?.context ?? []).map(refBody) }
			});
			return {
				status: r.status,
				uuid: r.uuid ?? undefined,
				executionRef: r.execution_uuid ?? undefined
			};
		},

		interrupt: async (executionRef) => {
			await request<void>(`/v1/executions/${encodeURIComponent(executionRef)}/cancel`, {
				method: 'POST'
			});
		},

		runDetail: async (executionRef) => {
			const r = await request<Record<string, any>>(
				`/v1/executions/${encodeURIComponent(executionRef)}`
			);
			return {
				uuid: r.uuid,
				nickname: r.nickname ?? undefined,
				seed: r.seed ?? undefined,
				startedAt: r.started_at ?? null,
				finishedAt: r.finished_at ?? null,
				heartbeatAt: r.heartbeat_at ?? null,
				active: r.is_active ?? undefined,
				finished: r.is_finished ?? undefined
			};
		},
		runOutput: async (executionRef, opts) => {
			const params = new URLSearchParams();
			if (opts?.offset !== undefined) params.set('offset', String(opts.offset));
			if (opts?.tail !== undefined) params.set('tail', String(opts.tail));
			if (opts?.limit !== undefined) params.set('limit', String(opts.limit));
			const qs = params.size ? `?${params}` : '';
			return request<OutputChunk>(
				`/v1/executions/${encodeURIComponent(executionRef)}/output${qs}`
			);
		},

		call: async (module, method, args, version) => {
			const r = await request<{ payload: unknown }>('/v1/interfaces/call', {
				body: { target: module, version, method, args: [], kwargs: args }
			});
			return r.payload;
		},

		list: async (query?: CatalogQuery): Promise<CatalogPage> => {
			const body: Record<string, unknown> = {
				limit: query?.limit ?? 50,
				offset: query?.offset ?? 0,
				// per-hit compute status + run count (server derives from the latest run)
				include_status: true
			};
			if (query?.module) body.module = query.module;
			if (query?.facets?.length)
				body.config = {
					filters: query.facets.map((f) => ({ path: f.path, op: f.op, value: f.value }))
				};
			body.sort = query?.sort
				? [
						{
							by: query.sort.by,
							direction: query.sort.direction ?? 'desc',
							...(query.sort.configPath ? { config_layer: 'resolved' } : {})
						}
					]
				: [{ by: 'created_at_ns', direction: 'desc' }];
			const r = await request<{ items: Record<string, any>[]; total: number }>(
				'/v1/interfaces/search',
				{ body }
			);
			let items: RunRecord[] = r.items.map((item) => ({
				uuid: item.id,
				module: item.module ?? '',
				config: item.config ?? {},
				version: item.version ?? undefined,
				identity: shortIdentity(item.config ?? {}),
				status: item.status ?? 'draft',
				executionRef: item.execution_uuid ?? undefined,
				label: item.label ?? undefined,
				createdAt: item.created_at_ns ? Math.floor(item.created_at_ns / 1e6) : undefined,
				creator: item.created_by ?? undefined,
				runCount: item.run_count ?? undefined
			}));
			// free-text is a client-side page filter (the index has no substring column)
			const text = query?.text?.trim().toLowerCase();
			if (text)
				items = items.filter((i) =>
					`${i.label ?? ''} ${i.module} ${i.uuid}`.toLowerCase().includes(text)
				);
			return { items, total: r.total };
		},

		setLabel: async (uuid, label) => {
			await request<void>(`/v1/interfaces/${encodeURIComponent(uuid)}/label`, {
				method: 'PATCH',
				body: { label }
			});
		},

		provenance: async (module, version): Promise<ProvenanceRecord | null> => {
			const found = await request<{ uuid?: string | null }>('/v1/interfaces/lifecycle', {
				body: { target: module, version }
			});
			if (!found.uuid) return null;
			return request<ProvenanceRecord>(
				`/v1/interfaces/${encodeURIComponent(found.uuid)}/provenance`
			);
		},

		listSource: async (): Promise<SourceFile[]> => {
			const r = await request<{ files: SourceFile[] }>('/v1/source');
			return r.files ?? [];
		},
		readSource: async (path): Promise<SourceContent> => {
			const r = await request<{ path: string; content: string; etag?: string }>(
				`/v1/source/${path}`
			);
			return { path: r.path, content: r.content, etag: r.etag, language: languageOf(r.path) };
		}
	};
}
