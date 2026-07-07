// Bundle entry — what `GET /widget-sdk.js` serves. Exports the full SDK surface
// (components + helpers + types), the default HTTP adapter, and the two mount
// forms: `mount(el, props)` for any web host and the anywidget `render` contract
// for Jupyter cells.

import { mount as svelteMount, unmount as svelteUnmount } from 'svelte';
import Machinable from './Machinable.svelte';
import { createAdapter } from './adapter';
import type { Version, WidgetHostAdapter } from './types';

export * from './index';
export { createAdapter } from './adapter';

export interface MountProps {
	/** Server to offer in the connect panel (default http://127.0.0.1:8000). */
	url?: string;
	token?: string;
	/** Auto-connect and land here: `item` (one interface) or `list` (the run
	 * browser). Omit for the full shell with its connect panel. */
	view?: 'item' | 'list';
	/** The interface to open when `view` is `item`. */
	target?: string;
	version?: Version;
	/** Bring your own adapter (hosts); defaults to the HTTP adapter. */
	adapter?: WidgetHostAdapter;
}

/** Mount the Machinable shell into an element; returns an unmount handle. */
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

/** anywidget contract: `render({ model, el })`; the model carries the mount
 * props (url/token/view/target/version — see Interface.widget()). */
export function render({ model, el }: { model: any; el: HTMLElement }): () => void {
	const get = (key: string) =>
		typeof model?.get === 'function' ? (model.get(key) ?? undefined) : undefined;
	// a notebook output cell has no intrinsic height — give the shell one
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
