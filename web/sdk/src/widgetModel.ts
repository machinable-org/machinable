import type { BoundWidgetModel, Version, WidgetHostAdapter } from './types';

export function createCallModel(
	adapter: WidgetHostAdapter,
	module: string,
	version: Version,
	onError?: (message: string) => void
): BoundWidgetModel {
	const state = new Map<string, unknown>();
	const listeners = new Map<string, Set<(...args: unknown[]) => void>>();
	const dirty = new Set<string>();
	let closed = false;

	function emit(event: string, ...args: unknown[]) {
		for (const cb of listeners.get(event) ?? []) cb(...args);
	}

	function fail(where: string, e: unknown) {
		onError?.(`${where}: ${e instanceof Error ? e.message : String(e)}`);
	}

	function hydrate(next: unknown) {
		if (closed || !next || typeof next !== 'object') return;
		for (const [k, v] of Object.entries(next as Record<string, unknown>)) {
			state.set(k, v);
			emit(`change:${k}`, v);
			emit('change', k, v);
		}
	}

	const call = (method: string, args: Record<string, unknown>) =>
		adapter.call(module, method, args, version);

	void call('widget_state', {})
		.then(hydrate)
		.catch((e) => fail('widget_state', e));

	return {
		close() {
			closed = true;
			listeners.clear();
		},
		get(key) {
			return state.get(key);
		},
		set(key, value) {
			state.set(key, value);
			dirty.add(key);
			emit(`change:${key}`, value);
			emit('change', key, value);
		},
		save_changes() {
			if (dirty.size === 0) return;
			const changes: Record<string, unknown> = {};
			for (const k of dirty) changes[k] = state.get(k);
			dirty.clear();
			void call('widget_update', { changes })
				.then(hydrate)
				.catch((e) => fail('widget_update', e));
		},
		on(event, cb) {
			let set = listeners.get(event);
			if (!set) listeners.set(event, (set = new Set()));
			set.add(cb);
		},
		off(event, cb) {
			if (!cb) listeners.delete(event);
			else listeners.get(event)?.delete(cb);
		},
		send(content) {
			void call('widget_message', { content })
				.then((reply) => {
					if (reply !== null && reply !== undefined) emit('msg:custom', reply);
				})
				.catch((e) => fail('widget_message', e));
		}
	};
}
