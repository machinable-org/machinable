<script lang="ts">
	// SDK ObjectField — a nested dict/sub-config as a collapsible indented card (design D1,
	// variation 1a: inline indent). Known fields render typed; an `open` dict without schema
	// falls back to raw JSON. Recursive via FieldRenderer.
	import type { FieldType } from '../types';
	import { preview, typeLabel, defaultFor } from './util';
	import FieldRenderer from './FieldRenderer.svelte';

	let {
		type,
		value,
		onChange,
		disabled = false,
		depth = 0
	}: {
		type: Extract<FieldType, { kind: 'object' }>;
		value: Record<string, unknown> | null | undefined;
		onChange: (v: unknown) => void;
		disabled?: boolean;
		depth?: number;
	} = $props();

	// collapsed by default at the top level (the design's `▸ params · dict · { 2 }` row)
	let open = $state(depth > 0); // toggleable; `depth` only seeds the initial collapsed state

	const obj = $derived((value ?? {}) as Record<string, unknown>);

	function setKey(key: string, v: unknown) {
		onChange({ ...obj, [key]: v });
	}

	// open-dict raw JSON editing (no known fields)
	let rawText = $state('');
	let rawDirty = $state(false);
	$effect(() => {
		if (!rawDirty) rawText = JSON.stringify(obj, null, 1).replace(/\n\s*/g, ' ');
	});
	function editRaw(s: string) {
		rawText = s;
		rawDirty = true;
		try {
			const parsed = JSON.parse(s);
			if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
				onChange(parsed);
				rawDirty = false;
			}
		} catch {
			/* keep typing */
		}
	}
</script>

<div class="obj" class:nested={depth > 0}>
	<button class="head" onclick={() => (open = !open)}>
		<span class="disc">{open ? '▾' : '▸'}</span>
		<span class="meta mono">dict · {preview(obj)}</span>
	</button>
	{#if open}
		<div class="body">
			{#if type.fields?.length}
				{#each type.fields as f (f.key)}
					<div class="row">
						<span class="key mono" title={f.doc}>{f.key}</span>
						<FieldRenderer
							type={f.type}
							value={obj[f.key] ?? f.default ?? defaultFor(f.type)}
							onChange={(v) => setKey(f.key, v)}
							{disabled}
							depth={depth + 1}
						/>
						<span class="cap mono">{typeLabel(f.type)}</span>
					</div>
				{/each}
			{:else}
				<input
					class="raw mono"
					type="text"
					value={rawText}
					{disabled}
					oninput={(e) => editRaw(e.currentTarget.value)}
				/>
			{/if}
		</div>
	{/if}
</div>

<style>
	.obj {
		flex: 1;
		min-width: 0;
		background: var(--c-paper-raised, #fff);
		border: 1px solid var(--c-hairline, #dcd5c6);
		border-radius: 9px;
		padding: 7px 10px;
	}
	.obj.nested {
		background: var(--c-paper, #f6f2e9);
	}
	.head {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		border: none;
		background: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		text-align: left;
	}
	.disc {
		color: var(--c-ink-faint, #a69d8d);
		font-size: 10px;
	}
	.meta {
		font-size: var(--fs-xs, 11px);
		color: var(--c-ink-faint, #a69d8d);
	}
	.body {
		margin-top: 8px;
		border-left: 2px solid var(--c-paper-sunken, #ece6d8);
		padding-left: 11px;
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 9px;
		min-width: 0;
	}
	.key {
		font-size: var(--fs-xs, 11.5px);
		color: var(--c-ink-soft, #6b6760);
		min-width: 64px;
	}
	.cap {
		font-size: 10px;
		color: var(--c-ink-faint, #a69d8d);
		white-space: nowrap;
	}
	.raw {
		width: 100%;
		font: inherit;
		font-size: var(--fs-xs, 11px);
		padding: 4px 8px;
		border-radius: var(--radius-sm, 6px);
		border: 1px solid var(--c-hairline-strong, #cfc6b3);
		background: var(--c-paper, #f6f2e9);
		color: var(--c-ink, #2c2823);
	}
</style>
