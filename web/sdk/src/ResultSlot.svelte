<script lang="ts">
	import { untrack, type Component } from 'svelte';
	import type {
		BoundWidgetModel,
		InterfaceStatus,
		Version,
		WidgetAssets,
		WidgetHostAdapter
	} from './types';
	import { createCallModel } from './widgetModel';

	type SlotProps = { result: unknown; module: string; version: Version };

	let {
		adapter,
		module,
		version,
		status = null,
		result = null,
		waiting = status === 'running'
	}: {
		adapter: WidgetHostAdapter;
		module: string;
		version: Version;
		status?: InterfaceStatus | null;
		result?: unknown;
		waiting?: boolean;
	} = $props();

	const Slot = $derived(adapter.slots?.result as Component<SlotProps> | undefined);

	let assets = $state<WidgetAssets | null>(null);
	let mountError = $state<string | null>(null);
	let mountEl = $state<HTMLElement>();

	$effect(() => {
		const fetchAssets = Slot ? undefined : adapter.widgetAssets;
		const target = module;
		assets = null;
		mountError = null;
		if (!fetchAssets) return;
		let cancelled = false;
		void fetchAssets
			.call(adapter, target)
			.then((a) => {
				if (!cancelled) assets = a?.esm ? a : null;
			})
			.catch(() => {
				if (!cancelled) assets = null;
			});
		return () => {
			cancelled = true;
		};
	});

	const versionKey = $derived(JSON.stringify(version ?? []));

	$effect(() => {
		const host = mountEl;
		const a = assets;
		const target = module;
		versionKey;
		status;
		if (!host || !a) return;
		const ver = untrack(() => version) ?? [];

		let cancelled = false;
		let instance: { destroy?(): void } | (() => void) | void;
		const model: BoundWidgetModel =
			adapter.widgetModel?.(target, ver) ??
			createCallModel(adapter, target, ver, (m) => (mountError = m));

		const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
		shadow.innerHTML = '';
		const el = document.createElement('div');
		el.style.cssText = 'width:100%;height:100%;min-height:0';
		shadow.append(el);

		void (async () => {
			try {
				const url = URL.createObjectURL(new Blob([a.esm], { type: 'text/javascript' }));
				const mod = await import(/* @vite-ignore */ url);
				URL.revokeObjectURL(url);
				if (cancelled) return;
				const render = mod.default?.render ?? mod.render;
				if (typeof render !== 'function') throw new Error('widget module exports no render()');
				const css = a.css ?? mod.default?.css ?? mod.css;
				if (css) {
					const style = document.createElement('style');
					style.textContent = css;
					shadow.prepend(style);
				}
				instance = render({ el, model });
			} catch (e) {
				if (!cancelled) mountError = e instanceof Error ? e.message : String(e);
			}
		})();

		return () => {
			cancelled = true;
			model.close?.();
			if (typeof instance === 'function') instance();
			else instance?.destroy?.();
			shadow.innerHTML = '';
		};
	});

	let open = $state(true);
	const pretty = $derived.by(() => {
		try {
			return JSON.stringify(result, null, 2);
		} catch {
			return String(result);
		}
	});
</script>

<div class="slot">
	{#if Slot && result !== null}
		<Slot {result} {module} {version} />
	{:else if assets}
		{#if mountError}
			<div class="mounterr mono">{mountError}</div>
		{/if}
		<div class="embed" bind:this={mountEl}></div>
	{:else if result !== null}
		<div class="raw">
			<button class="rawhead mono" onclick={() => (open = !open)}>
				{open ? '▾' : '▸'} result
			</button>
			{#if open}
				<pre class="mono">{pretty}</pre>
			{/if}
		</div>
	{:else}
		<div class="empty">
			<div class="ephead mono">{waiting ? 'waiting for the run…' : 'no result read yet'}</div>
		</div>
	{/if}
</div>

<style>
	.slot {
		display: flex;
		flex-direction: column;
		gap: 10px;
		background: var(--c-field, #211e18);
		border: 1px solid var(--c-field-grid, #3a3529);
		border-radius: 11px;
		padding: 12px 13px;
	}
	.empty {
		flex: 1;
		border: 1.5px dashed var(--c-field-grid, #3a3529);
		border-radius: 10px;
		padding: 14px 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	.ephead {
		font-size: 11.5px;
		color: #8f8677;
	}

	.embed {
		flex: 1 1 auto;
		min-height: 160px;
	}
	.mounterr {
		flex: none;
		font-size: 11px;
		color: #d98b7f;
		white-space: pre-wrap;
	}

	.raw {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.rawhead {
		align-self: flex-start;
		border: 1px solid color-mix(in srgb, #2f9e6f 40%, transparent);
		background: none;
		font-size: 11px;
		color: #7fc9a6;
		padding: 3px 10px;
		border-radius: 6px;
		cursor: pointer;
	}
	.raw pre {
		margin: 0;
		flex: 1;
		min-height: 0;
		font-size: 11px;
		line-height: 1.55;
		color: var(--c-field-ink, #e8e2d4);
		overflow: auto;
		white-space: pre-wrap;
		word-break: break-word;
	}
</style>
