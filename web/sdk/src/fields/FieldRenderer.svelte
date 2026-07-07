<script lang="ts">
	// SDK FieldRenderer — the recursive dispatcher over the pydantic type space (design D1).
	// Primitives render inline (string input · number stepper · bool toggle · enum segmented ·
	// optional None/set-value · unknown raw-JSON fallback); object/list recurse via their own
	// components. Pure presentational; no host/captu imports.
	import type { FieldType } from '../types';
	import { defaultFor, typeLabel } from './util';
	import ObjectField from './ObjectField.svelte';
	import ListField from './ListField.svelte';
	import FieldRenderer from './FieldRenderer.svelte'; // self-import for the optional-inner recursion

	let {
		type,
		value,
		onChange,
		disabled = false,
		depth = 0
	}: {
		type: FieldType;
		value: unknown;
		onChange: (v: unknown) => void;
		disabled?: boolean;
		depth?: number;
	} = $props();

	// number stepper — int steps 1; float picks a step from the value's magnitude
	function stepOf(): number {
		if (type.kind === 'int') return 1;
		const v = Math.abs(Number(value) || 0);
		if (v === 0) return 0.1;
		const mag = Math.pow(10, Math.floor(Math.log10(v)));
		return mag / 10 >= 0.001 ? mag / 10 : 0.001;
	}
	function nudge(dir: 1 | -1) {
		const step = stepOf();
		const next = (Number(value) || 0) + dir * step;
		// avoid float dust (0.30000000000000004)
		onChange(type.kind === 'int' ? Math.round(next) : Number(next.toPrecision(12)));
	}
	function num(e: Event) {
		const raw = (e.currentTarget as HTMLInputElement).value;
		if (raw === '') return;
		onChange(type.kind === 'int' ? Math.round(Number(raw)) : Number(raw));
	}

	// unknown/raw fallback: JSON in a mono input, kept as text until it parses
	let rawText = $state('');
	let rawDirty = $state(false);
	$effect(() => {
		if (!rawDirty) rawText = value === undefined ? 'null' : JSON.stringify(value);
	});
	function editRaw(s: string) {
		rawText = s;
		rawDirty = true;
		try {
			onChange(JSON.parse(s));
			rawDirty = false;
		} catch {
			/* keep typing — emit once it parses */
		}
	}
</script>

{#if type.kind === 'str'}
	<input
		class="fr-input mono"
		type="text"
		value={String(value ?? '')}
		{disabled}
		oninput={(e) => onChange(e.currentTarget.value)}
	/>
{:else if type.kind === 'int' || type.kind === 'float'}
	<span class="fr-stepper" class:disabled>
		<button class="fr-step" {disabled} onclick={() => nudge(-1)} tabindex="-1">−</button>
		<input class="fr-num mono" type="number" value={value ?? ''} {disabled} oninput={num} />
		<button class="fr-step" {disabled} onclick={() => nudge(1)} tabindex="-1">+</button>
	</span>
{:else if type.kind === 'bool'}
	<button
		class="fr-toggle"
		class:on={!!value}
		{disabled}
		onclick={() => onChange(!value)}
		role="switch"
		aria-checked={!!value}
		aria-label="Toggle value"
	>
		<span class="fr-knob"></span>
	</button>
	<span class="fr-boolval">{value ? 'true' : 'false'}</span>
{:else if type.kind === 'enum'}
	<span class="fr-seg" class:disabled>
		{#each type.options as o (o)}
			<button
				class="fr-opt"
				class:on={value === o}
				{disabled}
				onclick={() => onChange(o)}>{o}</button
			>
		{/each}
	</span>
{:else if type.kind === 'optional'}
	{#if value === null || value === undefined}
		<span class="fr-none mono">None</span>
		<button class="fr-set mono" {disabled} onclick={() => onChange(defaultFor(type.inner))}>
			set value
		</button>
	{:else}
		<FieldRenderer type={type.inner} {value} {onChange} {disabled} {depth} />
		<button class="fr-clear mono" {disabled} title="reset to None" onclick={() => onChange(null)}>
			×
		</button>
	{/if}
{:else if type.kind === 'object'}
	<ObjectField {type} value={value as Record<string, unknown>} {onChange} {disabled} {depth} />
{:else if type.kind === 'list'}
	<ListField {type} value={value as unknown[]} {onChange} {disabled} {depth} />
{:else}
	<input
		class="fr-input fr-raw mono"
		type="text"
		value={rawText}
		{disabled}
		title={type.kind === 'unknown' ? (type.annotation ?? 'no schema') : typeLabel(type)}
		oninput={(e) => editRaw(e.currentTarget.value)}
	/>
{/if}

<style>
	.fr-input {
		width: 150px;
		font: inherit;
		font-size: var(--fs-xs, 11.5px);
		padding: 4px 8px;
		border-radius: var(--radius-sm, 6px);
		border: 1px solid var(--c-hairline-strong, #cfc6b3);
		background: var(--c-paper-raised, #fff);
		color: var(--c-ink, #2c2823);
	}
	.fr-raw {
		background: color-mix(in srgb, var(--c-lagging, #e6c9a8) 10%, var(--c-paper-raised, #fff));
		border-color: color-mix(in srgb, var(--c-lagging, #e6c9a8) 60%, transparent);
	}
	.fr-input:disabled {
		opacity: 0.55;
	}

	/* number stepper */
	.fr-stepper {
		display: inline-flex;
		align-items: stretch;
		border: 1px solid var(--c-hairline-strong, #cfc6b3);
		border-radius: var(--radius-sm, 7px);
		background: var(--c-paper-raised, #fff);
		overflow: hidden;
	}
	.fr-stepper.disabled {
		opacity: 0.55;
	}
	.fr-step {
		width: 24px;
		border: none;
		background: none;
		color: var(--c-ink-faint, #a69d8d);
		font-size: 13px;
		cursor: pointer;
		padding: 0;
	}
	.fr-step:first-child {
		border-right: 1px solid var(--c-paper-sunken, #ece6d8);
	}
	.fr-step:last-child {
		border-left: 1px solid var(--c-paper-sunken, #ece6d8);
	}
	.fr-num {
		width: 62px;
		border: none;
		outline: none;
		text-align: center;
		font: inherit;
		font-size: var(--fs-xs, 12px);
		color: var(--c-ink, #2c2823);
		background: none;
		padding: 4px 2px;
		-moz-appearance: textfield;
		appearance: textfield;
	}
	.fr-num::-webkit-outer-spin-button,
	.fr-num::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* bool toggle */
	.fr-toggle {
		width: 34px;
		height: 20px;
		border-radius: 20px;
		border: none;
		background: var(--c-hairline-strong, #d8cfbd);
		position: relative;
		cursor: pointer;
		padding: 0;
		flex: none;
		transition: background 0.15s;
	}
	.fr-toggle.on {
		background: var(--c-live, #2f9e6f);
	}
	.fr-toggle:disabled {
		opacity: 0.55;
	}
	.fr-knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		transition: transform 0.15s;
	}
	.fr-toggle.on .fr-knob {
		transform: translateX(14px);
	}
	.fr-boolval {
		font-size: var(--fs-xs, 11.5px);
		color: var(--c-ink-soft, #6b6760);
	}

	/* enum segmented */
	.fr-seg {
		display: inline-flex;
		gap: 3px;
		background: var(--c-paper-sunken, #ece6d8);
		border-radius: 8px;
		padding: 3px;
	}
	.fr-seg.disabled {
		opacity: 0.55;
	}
	.fr-opt {
		border: none;
		background: none;
		font: inherit;
		font-size: var(--fs-xs, 11.5px);
		color: var(--c-ink-faint, #8f8677);
		padding: 3px 9px;
		border-radius: 6px;
		cursor: pointer;
	}
	.fr-opt.on {
		background: var(--c-ink, #2c2823);
		color: var(--c-paper, #f6f2e9);
		font-weight: 500;
	}

	/* optional */
	.fr-none {
		font-size: var(--fs-xs, 12px);
		color: var(--c-ink-faint, #a69d8d);
		font-style: italic;
	}
	.fr-set {
		border: 1px dashed color-mix(in srgb, var(--c-model, #5b6ee0) 45%, transparent);
		background: none;
		font-size: var(--fs-xs, 11px);
		color: var(--c-model, #5b6ee0);
		padding: 3px 9px;
		border-radius: 6px;
		cursor: pointer;
	}
	.fr-clear {
		border: none;
		background: none;
		color: var(--c-ink-faint, #a69d8d);
		font-size: 13px;
		cursor: pointer;
		padding: 0 2px;
	}
</style>
