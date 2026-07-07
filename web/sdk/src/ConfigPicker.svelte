<script lang="ts">
	// SDK ConfigPicker — the config surface of one interface (design D1, revised IA):
	// a READ-ONLY overview of the resolved configuration (values from the server's
	// dry-run, changed-from-default dots, resolve issues attached per field) plus the
	// version as chips; all editing happens in the pop-up VersionEditor (`✎ edit`),
	// where override dicts and ~tokens are explicit, ordered elements. Reused by the
	// target's Config tab and every context layer (incl. Execution resources).
	// Pure over WidgetHostAdapter; no host/captu imports.
	import { untrack, type Component } from 'svelte';
	import type {
		WidgetHostAdapter,
		ModuleSchema,
		ResolveIssue,
		SourceRef,
		Version
	} from './types';
	import { elementsToVersion, versionToElements } from './introspection';
	import { defaultFor, jsonEq, typeLabel } from './fields/util';
	import VersionEditor from './VersionEditor.svelte';

	// A host field-slot is a component the host injects for a field (keyed by
	// ConfigField.slot, e.g. captu's recording picker). It owns the value editing —
	// slot fields stay directly editable in the overview (the host owns the widget).
	type SlotProps = { value: string; onChange: (v: string) => void; disabled?: boolean };

	let {
		adapter,
		module,
		version = [],
		onVersion,
		onValues,
		onViewSource,
		issues = [],
		disabled = false
	}: {
		adapter: WidgetHostAdapter;
		module: string;
		/** Initial compact version (override dicts ⊕ ~tokens) — e.g. a reconstructed run. */
		version?: Version;
		/** The composed compact version, on every edit (modal apply / slot edit). */
		onVersion?: (v: Version) => void;
		/** The resolved config values — for hosts that need the whole dict. */
		onValues?: (config: Record<string, unknown>) => void;
		/** Open a source location (a ~token's def, the interface) in the host's code view. */
		onViewSource?: (ref: SourceRef) => void;
		/** Resolve issues from the ResolvedBar — attached to fields by path. */
		issues?: ResolveIssue[];
		disabled?: boolean;
	} = $props();

	let schema = $state<ModuleSchema | null>(null);
	/** The current compact version — owned here between parent seeds and modal applies. */
	let current = $state<Version>([]);
	/** Resolved values (server dry-run) for the read-only overview. */
	let resolved = $state<Record<string, unknown>>({});
	let editing = $state(false);

	// Introspect per module; seed the version. `version` is read untracked — it is
	// the *initial* value; tracking it would loop (parents feed onVersion back).
	$effect(() => {
		module;
		const initial = untrack(() => version);
		let cancelled = false;
		void adapter.introspect(module).then((s) => {
			if (cancelled) return;
			schema = s;
			current = initial;
			onVersion?.(initial);
		});
		return () => (cancelled = true);
	});

	// Resolve for display whenever the version changes (debounced).
	$effect(() => {
		JSON.stringify(current);
		module;
		let cancelled = false;
		const h = setTimeout(() => {
			void adapter.resolve(module, current).then((r) => {
				if (cancelled || !r.ok) return;
				resolved = r.config;
				onValues?.({ ...r.config });
			});
		}, 150);
		return () => {
			cancelled = true;
			clearTimeout(h);
		};
	});

	function apply(v: Version) {
		editing = false;
		current = v;
		onVersion?.(v);
	}

	/** A slot field's edit writes through to the last override dict (or a new one). */
	function slotEdit(key: string, value: unknown) {
		const elements = versionToElements(current);
		const last = [...elements].reverse().find((el) => el.kind === 'dict');
		if (last && last.kind === 'dict') last.value[key] = value;
		else elements.push({ kind: 'dict', value: { [key]: value } });
		apply(elementsToVersion(elements));
	}

	const changed = $derived(
		new Set(
			(schema?.fields ?? [])
				.filter((f) => !jsonEq(resolved[f.key], f.default ?? defaultFor(f.type)))
				.map((f) => f.key)
		)
	);
	const chips = $derived(versionToElements(current));
	/** Resolved keys with no declared field (dict-based / extra-allow configs) —
	 * shown read-only so the config stays inspectable without a schema. */
	const extraKeys = $derived.by(() => {
		const declared = new Set((schema?.fields ?? []).map((f) => f.key));
		return Object.keys(resolved).filter((k) => !declared.has(k) && !k.startsWith('_'));
	});

	function display(v: unknown): string {
		if (v === null || v === undefined) return 'None';
		if (typeof v === 'string') return v === '' ? '""' : v;
		return JSON.stringify(v);
	}
	function issueFor(key: string): ResolveIssue | undefined {
		return issues.find((i) => i.path === key || i.path?.startsWith(key + '.'));
	}
</script>

<div class="cfg">
	{#if !schema}
		<div class="skl">
			<div class="skl-line" style="width: 55%"></div>
			<div class="skl-box"></div>
			<div class="skl-box" style="animation-delay: 0.15s"></div>
		</div>
	{:else}
		<!-- version chips + the single edit affordance -->
		<div class="vrow">
			{#each chips as el, i (i)}
				<span class="chip mono" class:dict={el.kind === 'dict'}>
					{el.kind === 'dict' ? `{ ${Object.keys(el.value).join(', ')} }` : `~${el.name}`}
				</span>
			{:else}
				<span class="defaults mono">defaults</span>
			{/each}
			{#if !disabled}
				<button class="edit mono" onclick={() => (editing = true)}>✎ edit</button>
			{/if}
		</div>

		{#if schema.doc}
			<div class="doc">{schema.doc.split('\n\n')[0]}</div>
		{/if}

		<!-- read-only resolved overview -->
		<div class="fields">
			{#each schema.fields as f (f.key)}
				{@const Slot = (f.slot ? adapter.slots?.fields?.[f.slot] : undefined) as
					| Component<SlotProps>
					| undefined}
				{@const issue = issueFor(f.key)}
				{#if Slot}
					<div class="slotcard" class:bad={!!issue}>
						<div class="slothead">
							<span class="key mono" title={f.doc}>{f.key}</span>
							<span class="slottag mono">HOST SLOT · {f.slot}</span>
							{#if changed.has(f.key)}<span class="mdot" title="changed from default"></span>{/if}
						</div>
						<Slot
							value={String(resolved[f.key] ?? '')}
							onChange={(v: string) => slotEdit(f.key, v)}
							{disabled}
						/>
						{#if issue}<div class="ierr mono">{issue.message}</div>{/if}
					</div>
				{:else}
					<div class="frow" class:bad={!!issue}>
						<span class="key mono" title={f.doc}>{f.key}</span>
						<span class="val mono" class:isdef={!changed.has(f.key)}>
							{display(resolved[f.key] ?? f.default ?? defaultFor(f.type))}
						</span>
						<span class="cap2 mono">{typeLabel(f.type)}</span>
						{#if changed.has(f.key)}<span class="mdot" title="changed from default"></span>{/if}
					</div>
					{#if issue}<div class="ierr mono">{issue.message}</div>{/if}
				{/if}
			{/each}
			{#each extraKeys as key (key)}
				<div class="frow">
					<span class="key mono">{key}</span>
					<span class="val mono">{display(resolved[key])}</span>
				</div>
			{/each}
			{#if !schema.fields.length && !extraKeys.length}
				<div class="empty mono">no configurable fields — runs as-is</div>
			{/if}
		</div>

		{#if editing}
			<VersionEditor
				{schema}
				version={current}
				onApply={apply}
				onCancel={() => (editing = false)}
				{onViewSource}
			/>
		{/if}
	{/if}
</div>

<style>
	.cfg {
		display: flex;
		flex-direction: column;
		gap: 10px;
		font-size: var(--fs-sm, 13px);
	}

	/* introspecting skeleton */
	.skl {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.skl-line,
	.skl-box {
		border-radius: 6px;
		background: var(--c-paper-sunken, #ece6d8);
		animation: skl-pulse 1.3s ease-in-out infinite;
	}
	.skl-line {
		height: 11px;
	}
	.skl-box {
		height: 30px;
	}
	@keyframes skl-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.45;
		}
	}

	/* version chips row */
	.vrow {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
		align-items: center;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		background: var(--c-model, #5b6ee0);
		color: #fff;
		font-size: var(--fs-xs, 12px);
		padding: 3px 10px;
		border-radius: 8px;
		max-width: 260px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.chip.dict {
		background: var(--c-live, #2f9e6f);
	}
	.defaults {
		font-size: 11px;
		color: var(--c-ink-faint, #a69d8d);
	}
	.edit {
		border: 1px dashed color-mix(in srgb, var(--c-model, #5b6ee0) 45%, transparent);
		background: none;
		font-size: var(--fs-xs, 11.5px);
		color: var(--c-model, #5b6ee0);
		padding: 3px 11px;
		border-radius: 8px;
		cursor: pointer;
	}

	.doc {
		font-size: 11.5px;
		line-height: 1.5;
		color: var(--c-ink-soft, #6b6760);
	}

	/* read-only overview */
	.fields {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.frow {
		display: flex;
		align-items: baseline;
		gap: 9px;
		min-width: 0;
	}
	.key {
		font-size: var(--fs-xs, 12px);
		color: var(--c-ink-soft, #6b6760);
		min-width: 84px;
		flex: none;
	}
	.val {
		font-size: var(--fs-xs, 12px);
		color: var(--c-ink, #2c2823);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.val.isdef {
		color: var(--c-ink-soft, #6f6759);
	}
	.cap2 {
		font-size: 10px;
		color: var(--c-ink-faint, #a69d8d);
		white-space: nowrap;
		margin-left: auto;
	}
	.mdot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--c-model, #5b6ee0);
		flex: none;
		align-self: center;
	}
	.frow.bad .val {
		color: var(--c-record, #cf5252);
	}
	.ierr {
		font-size: 10.5px;
		color: var(--c-record, #cf5252);
		background: color-mix(in srgb, var(--c-record, #cf5252) 8%, transparent);
		border-radius: 6px;
		padding: 5px 9px;
	}
	.empty {
		font-size: var(--fs-xs, 11px);
		color: var(--c-ink-faint, #9a958c);
	}

	/* host field-slot seam */
	.slotcard {
		display: flex;
		flex-direction: column;
		gap: 6px;
		background: color-mix(in srgb, var(--c-model, #6b5bd0) 7%, var(--c-paper-raised, #fff));
		border: 1px solid color-mix(in srgb, var(--c-model, #6b5bd0) 30%, transparent);
		border-radius: 9px;
		padding: 8px 10px;
	}
	.slotcard.bad {
		border-color: var(--c-record, #cf5252);
	}
	.slothead {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.slottag {
		font-size: 9.5px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--c-model, #6b5bd0);
		background: color-mix(in srgb, var(--c-model, #6b5bd0) 10%, transparent);
		padding: 2px 7px;
		border-radius: 5px;
	}
</style>
