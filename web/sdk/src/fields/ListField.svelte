<script lang="ts">
	// SDK ListField — list[T] as reorderable rows: index · item renderer · remove, plus a
	// dashed add button (design D1). Object items render their fields inline on the row;
	// other item types render a single control. Recursive via FieldRenderer.
	import type { FieldType } from '../types';
	import { defaultFor, typeLabel } from './util';
	import FieldRenderer from './FieldRenderer.svelte';

	let {
		type,
		value,
		onChange,
		disabled = false,
		depth = 0
	}: {
		type: Extract<FieldType, { kind: 'list' }>;
		value: unknown[] | null | undefined;
		onChange: (v: unknown) => void;
		disabled?: boolean;
		depth?: number;
	} = $props();

	const items = $derived(Array.isArray(value) ? value : []);
	const itemFields = $derived(type.item.kind === 'object' ? (type.item.fields ?? []) : null);

	function setItem(i: number, v: unknown) {
		onChange(items.map((x, j) => (j === i ? v : x)));
	}
	function setItemKey(i: number, key: string, v: unknown) {
		const cur = (items[i] ?? {}) as Record<string, unknown>;
		setItem(i, { ...cur, [key]: v });
	}
	function remove(i: number) {
		onChange(items.filter((_, j) => j !== i));
	}
	function add() {
		onChange([...items, defaultFor(type.item)]);
	}
	function move(i: number, dir: 1 | -1) {
		const j = i + dir;
		if (j < 0 || j >= items.length) return;
		const next = [...items];
		[next[i], next[j]] = [next[j], next[i]];
		onChange(next);
	}
</script>

<div class="list">
	{#each items as item, i (i)}
		<div class="row">
			<span class="grip" title="reorder">
				<button class="mv" {disabled} onclick={() => move(i, -1)} tabindex="-1">▴</button>
				<button class="mv" {disabled} onclick={() => move(i, 1)} tabindex="-1">▾</button>
			</span>
			<span class="idx mono">{i}</span>
			{#if itemFields?.length}
				{#each itemFields as f (f.key)}
					<FieldRenderer
						type={f.type}
						value={(item as Record<string, unknown>)?.[f.key] ?? f.default ?? defaultFor(f.type)}
						onChange={(v) => setItemKey(i, f.key, v)}
						{disabled}
						depth={depth + 1}
					/>
				{/each}
			{:else}
				<FieldRenderer
					type={type.item}
					value={item}
					onChange={(v) => setItem(i, v)}
					{disabled}
					depth={depth + 1}
				/>
			{/if}
			{#if !disabled}
				<button class="rm" title="remove" onclick={() => remove(i)}>×</button>
			{/if}
		</div>
	{/each}
	{#if !disabled}
		<button class="add mono" onclick={add}>+ add {typeLabel(type.item)}</button>
	{/if}
</div>

<style>
	.list {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--c-paper-raised, #fff);
		border: 1px solid var(--c-hairline, #dcd5c6);
		border-radius: 8px;
		padding: 6px 9px;
		min-width: 0;
	}
	.grip {
		display: flex;
		flex-direction: column;
		flex: none;
	}
	.mv {
		border: none;
		background: none;
		color: var(--c-ink-faint, #c9c0af);
		font-size: 8px;
		line-height: 1;
		padding: 1px 2px;
		cursor: pointer;
	}
	.mv:hover:not(:disabled) {
		color: var(--c-ink-soft, #6b6760);
	}
	.idx {
		font-size: 10.5px;
		color: var(--c-ink-faint, #a69d8d);
		flex: none;
	}
	.rm {
		margin-left: auto;
		border: none;
		background: none;
		color: var(--c-ink-faint, #a69d8d);
		font-size: 14px;
		line-height: 1;
		cursor: pointer;
		padding: 0 2px;
	}
	.add {
		align-self: flex-start;
		border: 1px dashed color-mix(in srgb, var(--c-model, #5b6ee0) 45%, transparent);
		background: none;
		font-size: var(--fs-xs, 11.5px);
		color: var(--c-model, #5b6ee0);
		padding: 5px 11px;
		border-radius: 7px;
		cursor: pointer;
	}
</style>
