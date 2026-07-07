<script lang="ts">
	// SDK ResultSlot — the field-dark result region (design D3). The result is OPAQUE to the
	// SDK: a host-injected view renders it (adapter.slots.result); standalone falls back to
	// "result ready · raw JSON" with a pretty-printed, collapsible payload. While a Job is
	// still running it reads as a waiting placeholder. No host/captu imports.
	import type { Component } from 'svelte';
	import type { Version, WidgetHostAdapter } from './types';

	type SlotProps = { result: unknown; module: string; version: Version };

	let {
		adapter,
		module,
		version,
		result = null,
		waiting = false
	}: {
		adapter: WidgetHostAdapter;
		module: string;
		version: Version;
		/** The opaque result payload (e.g. from a Call) — null until something was read. */
		result?: unknown;
		/** True while the producing Job is still running. */
		waiting?: boolean;
	} = $props();

	const Slot = $derived(adapter.slots?.result as Component<SlotProps> | undefined);

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
