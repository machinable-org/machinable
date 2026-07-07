// The default HTTP adapter's request mapping, against a mocked fetch.
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createAdapter } from './adapter';

type Call = { url: string; init?: RequestInit };
const calls: Call[] = [];

function mockFetch(routes: Record<string, unknown | ((init?: RequestInit) => unknown)>) {
	calls.length = 0;
	vi.stubGlobal(
		'fetch',
		vi.fn(async (url: string, init?: RequestInit) => {
			calls.push({ url, init });
			const path = new URL(url).pathname;
			for (const [route, payload] of Object.entries(routes)) {
				if (path === route) {
					const body = typeof payload === 'function' ? payload(init) : payload;
					if (body instanceof Response) return body;
					return new Response(JSON.stringify(body), {
						status: 200,
						headers: { 'Content-Type': 'application/json' }
					});
				}
			}
			return new Response(JSON.stringify({ detail: `no route ${path}` }), { status: 404 });
		})
	);
}

afterEach(() => vi.unstubAllGlobals());

describe('createAdapter', () => {
	it('connects via health + project and lists modules', async () => {
		mockFetch({
			'/v1/health': { status: 'ok' },
			'/v1/project': { project: '/p', modules: [{ module: 'estimator' }, { module: 'basic' }] }
		});
		const adapter = createAdapter();
		const r = await adapter.connect('http://server:8000', 'sekrit');
		expect(r).toMatchObject({ connected: true, modules: ['estimator', 'basic'], project: '/p' });
		// bearer travels on every request after connect
		const headers = calls[0].init?.headers as Record<string, string>;
		expect(headers['Authorization']).toBe('Bearer sekrit');
	});

	it('reports a connect failure with the reason', async () => {
		mockFetch({}); // health 404s
		const adapter = createAdapter();
		const r = await adapter.connect('http://server:8000');
		expect(r.connected).toBe(false);
		expect(r.message).toContain('no route');
	});

	it('maps resolve success to ok + identity and 400 to issues', async () => {
		mockFetch({
			'/v1/interfaces/resolve': (init?: RequestInit) => {
				const body = JSON.parse(String(init?.body));
				if (body.version?.length)
					return new Response(
						JSON.stringify({
							detail: { message: 'bad', issues: [{ path: 'alpha', message: 'unknown key' }] }
						}),
						{ status: 400 }
					);
				return { config: { alpha: 0.1 }, cli: 'estimator', predicate: { alpha: 0.1 } };
			}
		});
		const adapter = createAdapter('http://server:8000');
		const ok = await adapter.resolve('estimator', []);
		expect(ok).toMatchObject({ ok: true, cli: 'estimator', config: { alpha: 0.1 } });
		if (ok.ok) expect(ok.identity).toMatch(/^[0-9a-f]{8}$/);

		const bad = await adapter.resolve('estimator', [{ alpha: 1 }]);
		expect(bad).toEqual({ ok: false, issues: [{ path: 'alpha', message: 'unknown key' }] });
	});

	it('maps find/dispatch/interrupt/call to the lifecycle endpoints', async () => {
		mockFetch({
			'/v1/interfaces/lifecycle': { status: 'cached', uuid: 'u1', execution_uuid: 'e1' },
			'/v1/executions': { uuid: 'e2', parent_uuid: 'u2' },
			'/v1/executions/e2/cancel': new Response(null, { status: 204 }),
			'/v1/interfaces/call': { payload: 42 }
		});
		const adapter = createAdapter('http://server:8000');

		const found = await adapter.find('estimator', ['~fast']);
		expect(found).toEqual({ status: 'cached', uuid: 'u1', executionRef: 'e1' });

		const run = await adapter.dispatch('estimator', ['~fast'], {
			context: [{ target: 'scope', version: [{ trial: 1 }] }]
		});
		expect(run).toEqual({ executionRef: 'e2' });
		const dispatched = JSON.parse(String(calls.find((c) => c.url.endsWith('/v1/executions'))?.init?.body));
		expect(dispatched.interfaces[0].context).toEqual([
			{ target: 'scope', version: [{ trial: 1 }] }
		]);

		await adapter.interrupt('e2');
		expect(await adapter.call('estimator', 'predict', { x: 1 }, [])).toBe(42);
		const called = JSON.parse(String(calls.find((c) => c.url.endsWith('/v1/interfaces/call'))?.init?.body));
		expect(called).toMatchObject({ method: 'predict', kwargs: { x: 1 }, args: [] });
	});

	it('inspects a run instance (detail + chunked output)', async () => {
		mockFetch({
			'/v1/executions/e1': {
				uuid: 'e1',
				nickname: 'chocolate_lab',
				seed: 7,
				started_at: '2026-07-05T10:00:00',
				finished_at: '2026-07-05T10:00:03',
				is_finished: true
			},
			'/v1/executions/e1/output': { output: 'world!\n', offset: 6, size: 13 }
		});
		const adapter = createAdapter('http://server:8000');
		const detail = await adapter.runDetail!('e1');
		expect(detail).toMatchObject({
			uuid: 'e1',
			nickname: 'chocolate_lab',
			seed: 7,
			startedAt: '2026-07-05T10:00:00',
			finishedAt: '2026-07-05T10:00:03',
			finished: true
		});

		const chunk = await adapter.runOutput!('e1', { offset: 6, limit: 1024 });
		expect(chunk).toEqual({ output: 'world!\n', offset: 6, size: 13 });
		const url = calls.find((c) => c.url.includes('/output'))!.url;
		expect(url).toContain('offset=6');
		expect(url).toContain('limit=1024');
	});

	it('maps search items to RunRecords with facets in the body', async () => {
		mockFetch({
			'/v1/interfaces/search': {
				items: [
					{
						id: 'u1',
						module: 'estimator',
						config: { alpha: 0.1 },
						label: 'baseline',
						created_at_ns: 1_700_000_000_000_000_000,
						created_by: 'me',
						status: 'cached',
						run_count: 2
					}
				],
				total: 1
			}
		});
		const adapter = createAdapter('http://server:8000');
		const page = await adapter.list({
			module: 'estimator',
			facets: [{ path: 'alpha', op: 'gt', value: 0 }]
		});
		expect(page.total).toBe(1);
		expect(page.items[0]).toMatchObject({
			uuid: 'u1',
			module: 'estimator',
			status: 'cached',
			label: 'baseline',
			creator: 'me',
			runCount: 2
		});
		const body = JSON.parse(String(calls[0].init?.body));
		expect(body.config.filters).toEqual([{ path: 'alpha', op: 'gt', value: 0 }]);
	});

	it('provenance resolves the uuid first and returns null for drafts', async () => {
		mockFetch({
			'/v1/interfaces/lifecycle': { status: 'draft', uuid: null }
		});
		const adapter = createAdapter('http://server:8000');
		expect(await adapter.provenance('estimator', [])).toBeNull();

		mockFetch({
			'/v1/interfaces/lifecycle': { status: 'cached', uuid: 'u1' },
			'/v1/interfaces/u1/provenance': { root: 'u1', nodes: [], links: [], truncated: false }
		});
		const graph = await adapter.provenance('estimator', []);
		expect(graph?.root).toBe('u1');
	});
});
