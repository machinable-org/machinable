
import { mount as svelteMount, unmount as svelteUnmount } from 'svelte';
import Machinable from './Machinable.svelte';
import { createAdapter } from './adapter';
import type { Version, WidgetHostAdapter } from './types';

export * from './index';
export { createAdapter } from './adapter';

export interface MountProps {
	url?: string;
	token?: string;
	view?: 'item' | 'list';
	target?: string;
	version?: Version;
	adapter?: WidgetHostAdapter;
}

export function mount(el: HTMLElement, props: MountProps = {}): { unmount: () => void } {
	const adapter = props.adapter ?? createAdapter(props.url, props.token);
	const instance = svelteMount(Machinable, {
		target: el,
		props: {
			adapter,
			defaultUrl: props.url ?? 'http://127.0.0.1:8000',
			autoConnect: !!props.view,
			initialView: props.view ?? null,
			initialTarget: props.target ?? '',
			initialVersion: props.version ?? []
		}
	});
	return { unmount: () => void svelteUnmount(instance) };
}

type TokenReply = { type: 'machinable.token'; token?: string | null; expires_in?: number; error?: string };

/** Ask the kernel for a short-lived session token over the widget's custom
 * messages (never the synced state, which may be saved into the notebook),
 * and again before it expires. Resolves with the first token. */
function kernelToken(model: any, onToken: (token: string | undefined) => void): {
	first: Promise<string | undefined>;
	stop: () => void;
} {
	let timer: ReturnType<typeof setTimeout> | undefined;
	let resolveFirst: ((token: string | undefined) => void) | undefined;
	const first = new Promise<string | undefined>((resolve) => (resolveFirst = resolve));
	const request = () => model.send({ type: 'machinable.token' });
	const onMessage = (msg: TokenReply) => {
		if (msg?.type !== 'machinable.token') return;
		if (msg.error) console.warn('[machinable] session token:', msg.error);
		const token = msg.token ?? undefined;
		onToken(token);
		resolveFirst?.(token);
		resolveFirst = undefined;
		clearTimeout(timer);
		// refresh at 80% of the lifetime; retry in a minute after a failure
		const delay = token && msg.expires_in ? msg.expires_in * 800 : 60_000;
		timer = setTimeout(request, delay);
	};
	model.on('msg:custom', onMessage);
	request();
	// a kernel that never answers (e.g. a saved notebook without one)
	setTimeout(() => {
		resolveFirst?.(undefined);
		resolveFirst = undefined;
	}, 10_000);
	return {
		first,
		stop: () => {
			clearTimeout(timer);
			model.off?.('msg:custom', onMessage);
		}
	};
}

export async function render({ model, el }: { model: any; el: HTMLElement }): Promise<() => void> {
	const get = (key: string) =>
		typeof model?.get === 'function' ? (model.get(key) ?? undefined) : undefined;
	if (!el.style.height) el.style.height = get('height') ?? '440px';
	const adapter = createAdapter(get('url'));
	let stopToken = () => {};
	if (get('auth') === 'kernel' && typeof model?.send === 'function') {
		const channel = kernelToken(model, (token) => adapter.setToken?.(token));
		stopToken = channel.stop;
		await channel.first;
	}
	const handle = mount(el, {
		url: get('url'),
		adapter,
		view: get('view'),
		target: get('target'),
		version: get('version')
	});
	return () => {
		stopToken();
		handle.unmount();
	};
}

export default { render, mount, createAdapter };
