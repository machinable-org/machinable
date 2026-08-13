
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

export function render({ model, el }: { model: any; el: HTMLElement }): () => void {
	const get = (key: string) =>
		typeof model?.get === 'function' ? (model.get(key) ?? undefined) : undefined;
	if (!el.style.height) el.style.height = get('height') ?? '440px';
	const handle = mount(el, {
		url: get('url'),
		token: get('token'),
		view: get('view'),
		target: get('target'),
		version: get('version')
	});
	return () => handle.unmount();
}

export default { render, mount, createAdapter };
