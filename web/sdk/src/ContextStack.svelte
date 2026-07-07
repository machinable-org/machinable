<script lang="ts">
	// SDK ContextStack — the in-window `with`-stack editor (design D2): the ordered context
	// an interface runs inside, as the CLI writes it. The ambient Project renders as a dashed
	// env row (connection-level — never dispatched in the body); layers are numbered,
	// progressively indented cards — **any interface** can be a layer (Execution and Scope are
	// the common kinds), each configured by a collapsed ConfigPicker, LIFO-entered top→down.
	// Emits the dispatch opts + the ordered CLI chain (for the ResolvedBar spans/hover-map).
	// Pure over WidgetHostAdapter; no host/captu imports.
	import type { Ref, SourceRef, Version, WidgetHostAdapter } from './types';
	import { versionCliParts } from './introspection';
	import ConfigPicker from './ConfigPicker.svelte';

	/** One ordered element of the with-chain, id-linked for the CLI hover-map. */
	export type ChainElement = { id: string; module: string; title?: string; version: Version };

	let {
		adapter,
		modules = [],
		project,
		disabled = false,
		highlightId = null,
		onHighlight,
		onChange,
		onViewSource
	}: {
		adapter: WidgetHostAdapter;
		/** The server's discoverable modules — the "any interface" add path. */
		modules?: string[];
		/** The ambient project (connection-level) shown on the env row. */
		project?: string;
		disabled?: boolean;
		/** Layer id to highlight (the CLI span ↔ layer hover-map). */
		highlightId?: string | null;
		onHighlight?: (id: string | null) => void;
		onChange?: (opts: {
			context: Ref[];
			execution?: Ref;
			executionRef?: string;
			chain: ChainElement[];
		}) => void;
		/** Open a layer interface's source in the host's code view. */
		onViewSource?: (ref: SourceRef) => void;
	} = $props();

	type Layer = {
		id: string;
		module: string;
		title: string;
		kind: string;
		version: Version;
		open: boolean;
	};
	let layers = $state<Layer[]>([]);
	let addOpen = $state(false);

	const uid = () => Math.random().toString(36).slice(2, 8);

	async function add(module: string) {
		addOpen = false;
		// introspect for the kind (Execution = the container) + a display title
		let kind = 'Interface';
		let title = module.split('.').at(-1) ?? module;
		try {
			const s = await adapter.introspect(module);
			kind = s.kind ?? kind;
			title = s.title ?? title;
		} catch {
			/* keep fallbacks — an unknown module still works as a layer */
		}
		layers = [...layers, { id: uid(), module, title, kind, version: [], open: true }];
	}
	function remove(id: string) {
		layers = layers.filter((l) => l.id !== id);
	}
	function move(i: number, dir: 1 | -1) {
		const j = i + dir;
		if (j < 0 || j >= layers.length) return;
		const next = [...layers];
		[next[i], next[j]] = [next[j], next[i]];
		layers = next;
	}
	function setVersion(id: string, v: Version) {
		// Idempotent: a picker's seed emission echoes its current version — writing the
		// layers array for an equal value re-renders the #each for nothing (and can cycle).
		const cur = layers.find((l) => l.id === id);
		if (!cur || JSON.stringify(cur.version) === JSON.stringify(v)) return;
		layers = layers.map((l) => (l.id === id ? { ...l, version: v } : l));
	}
	function toggle(id: string) {
		layers = layers.map((l) => (l.id === id ? { ...l, open: !l.open } : l));
	}
	/** Execution reset — a fresh run instance ref (re-runs the same config as a new run). */
	function freshRun(id: string) {
		layers = layers.map((l) => (l.id === id ? { ...l, id: uid() } : l));
	}
	async function viewSource(module: string) {
		try {
			const s = await adapter.introspect(module);
			if (s.sourceRef) onViewSource?.(s.sourceRef);
		} catch {
			/* no source to show */
		}
	}

	function summary(l: Layer): string {
		const parts = versionCliParts(l.version);
		return parts.length ? parts.join(' ') : 'defaults';
	}

	// Project = connection-level (skipped in dispatch); the first Execution = the container
	// (its layer id is the run-instance ref); everything else = the ordered `with`-context.
	const opts = $derived.by(() => {
		const context: Ref[] = [];
		let execution: Ref | undefined;
		let executionRef: string | undefined;
		for (const l of layers) {
			if (l.kind === 'Execution' && !execution) {
				execution = { target: l.module, version: l.version };
				executionRef = l.id;
			} else {
				context.push({ target: l.module, version: l.version });
			}
		}
		const chain: ChainElement[] = layers.map((l) => ({
			id: l.id,
			module: l.module,
			title: l.title,
			version: l.version
		}));
		return { context, execution, executionRef, chain };
	});
	// Emit only when the opts actually changed — the effect also tracks the `onChange`
	// prop, so an unguarded emit can cycle with a parent that re-renders on receipt.
	let lastEmitted = '';
	$effect(() => {
		const o = opts;
		const key = JSON.stringify(o);
		if (key === lastEmitted) return;
		lastEmitted = key;
		onChange?.(o);
	});

	const QUICK = [
		{ module: 'machinable.execution', label: 'Execution', hint: 'the runner / container' },
		{ module: 'machinable.scope', label: 'Scope', hint: 'predicate injection' }
	];
	const otherModules = $derived(modules.filter((m) => !m.startsWith('machinable.')));
</script>

<div class="stack" class:disabled>
	<div class="shead">
		<span class="cap mono">CONTEXT · with-stack</span>
		<span class="hint mono">LIFO — enter top→down</span>
	</div>

	<!-- ambient project (connection-level, never dispatched) -->
	<div class="env mono">
		<span class="envk">env</span>
		<span class="envm">project</span>
		<span class="envv">{project ?? 'default'}</span>
		<span class="amb">ambient</span>
	</div>

	{#each layers as l, i (l.id)}
		<div
			class="layer"
			class:hl={highlightId === l.id}
			style="margin-left: {Math.min(i, 5) * 16 + 9}px"
			role="group"
			onmouseenter={() => onHighlight?.(l.id)}
			onmouseleave={() => onHighlight?.(null)}
		>
			<div class="lhead">
				<button class="ltoggle" onclick={() => toggle(l.id)} title={l.open ? 'collapse' : 'expand'}>
					<span class="lno mono">{i + 1}</span>
					<span class="lname mono">{l.title}</span>
					<span class="lsum mono">{l.kind === 'Execution' ? 'execution · runner' : summary(l)}</span>
				</button>
				<span class="lspacer"></span>
				{#if l.kind === 'Execution' && !disabled}
					<button class="lact mono" title="reset — a fresh run instance" onclick={() => freshRun(l.id)}>↺ new run</button>
				{/if}
				<button class="lsrc mono" title="view source" onclick={() => viewSource(l.module)}>&lt;/&gt;</button>
				{#if !disabled}
					<span class="lmv">
						<button class="mv" onclick={() => move(i, -1)} title="move up">▴</button>
						<button class="mv" onclick={() => move(i, 1)} title="move down">▾</button>
					</span>
					<button class="lrm" title="remove" onclick={() => remove(l.id)}>×</button>
				{/if}
			</div>
			{#if l.open}
				<div class="lbody">
					<ConfigPicker
						{adapter}
						module={l.module}
						version={l.version}
						{disabled}
						onVersion={(v) => setVersion(l.id, v)}
						{onViewSource}
					/>
				</div>
			{/if}
		</div>
	{:else}
		<div class="empty mono" style="margin-left: 9px">
			no context layers<br /><span class="emptysub">→ runs in the ambient project</span>
		</div>
	{/each}

	{#if !disabled}
		<div class="addrow" style="margin-left: {Math.min(layers.length, 5) * 16 + 9}px">
			<button class="addbtn mono" onclick={() => (addOpen = !addOpen)}>+ add context</button>
		</div>
		{#if addOpen}
			<div class="menu">
				{#each QUICK as q (q.module)}
					<button class="mitem" onclick={() => add(q.module)}>
						<span class="mname mono">{q.label}</span>
						<span class="mhint">{q.hint}</span>
					</button>
				{/each}
				{#if otherModules.length}
					<div class="msep mono">any interface</div>
					{#each otherModules as m (m)}
						<button class="mitem" onclick={() => add(m)}>
							<span class="mname mono">{m}</span>
						</button>
					{/each}
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.stack.disabled .layer {
		opacity: 0.7;
	}
	.shead {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.cap {
		font-size: 10px;
		letter-spacing: 0.08em;
		color: var(--c-ink-faint, #a69d8d);
		font-weight: 700;
	}
	.hint {
		font-size: 10.5px;
		color: var(--c-ink-faint, #c9c0af);
	}

	.env {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 6px 10px;
		border: 1px dashed var(--c-hairline-strong, #cfc6b3);
		border-radius: 8px;
		font-size: 11.5px;
	}
	.envk {
		font-size: 10.5px;
		color: var(--c-ink-faint, #a69d8d);
	}
	.envm {
		color: var(--c-ink-soft, #6f6759);
	}
	.envv {
		color: var(--c-ink, #2b2721);
	}
	.amb {
		margin-left: auto;
		font-size: 10.5px;
		color: var(--c-ink-faint, #a69d8d);
	}

	.layer {
		border-left: 2px solid var(--c-hairline, #dcd5c6);
		padding-left: 10px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		border-radius: 2px;
	}
	.layer.hl {
		border-left-color: var(--c-model, #5b6ee0);
		background: color-mix(in srgb, var(--c-model, #5b6ee0) 6%, transparent);
	}
	.lhead {
		display: flex;
		align-items: center;
		gap: 6px;
		background: var(--c-paper-raised, #fff);
		border: 1px solid var(--c-hairline, #dcd5c6);
		border-radius: 8px;
		padding: 7px 10px;
	}
	.layer.hl .lhead {
		border-color: color-mix(in srgb, var(--c-model, #5b6ee0) 45%, transparent);
	}
	.ltoggle {
		display: flex;
		align-items: baseline;
		gap: 9px;
		border: none;
		background: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		min-width: 0;
		text-align: left;
	}
	.lno {
		font-size: 11px;
		color: var(--c-ink-faint, #8f8677);
	}
	.lname {
		font-size: 12.5px;
		font-weight: 500;
		color: var(--c-ink, #2b2721);
	}
	.lsum {
		font-size: 11px;
		color: var(--c-ink-soft, #6f6759);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 220px;
	}
	.lspacer {
		flex: 1;
	}
	.lact {
		border: none;
		background: none;
		font-size: 10.5px;
		color: var(--c-ink-faint, #8f8677);
		cursor: pointer;
		padding: 0 3px;
		white-space: nowrap;
	}
	.lact:hover {
		color: var(--c-ink-soft, #6b6760);
	}
	.lsrc {
		border: none;
		background: none;
		font-size: 10.5px;
		color: var(--c-model, #5b6ee0);
		cursor: pointer;
		padding: 0 3px;
	}
	.lmv {
		display: flex;
		flex-direction: column;
	}
	.mv {
		border: none;
		background: none;
		color: var(--c-ink-faint, #c9c0af);
		font-size: 8px;
		line-height: 1;
		padding: 0 2px;
		cursor: pointer;
	}
	.mv:hover {
		color: var(--c-ink-soft, #6b6760);
	}
	.lrm {
		border: none;
		background: none;
		color: var(--c-ink-faint, #9a958c);
		cursor: pointer;
		font-size: 13px;
		line-height: 1;
		padding: 0 2px;
	}
	.lbody {
		padding: 2px 0 2px 4px;
	}

	.empty {
		border: 1.5px dashed var(--c-hairline-strong, #cfc6b3);
		border-radius: 9px;
		padding: 14px;
		text-align: center;
		font-size: 11.5px;
		color: var(--c-ink-faint, #a69d8d);
		line-height: 1.6;
	}
	.emptysub {
		font-size: 10.5px;
	}

	.addrow {
		display: flex;
	}
	.addbtn {
		font-size: 11px;
		padding: 4px 11px;
		border-radius: 7px;
		border: 1px dashed var(--c-hairline-strong, #d8d3ca);
		background: none;
		color: var(--c-ink-soft, #6b6760);
		cursor: pointer;
	}
	.addbtn:hover {
		color: var(--c-ink, #2c2823);
		border-color: var(--c-ink-soft, #6b6760);
	}
	.menu {
		display: flex;
		flex-direction: column;
		gap: 4px;
		border: 1px solid var(--c-hairline, #dcd5c6);
		border-radius: 9px;
		background: var(--c-paper-raised, #fff);
		padding: 6px;
	}
	.mitem {
		display: flex;
		align-items: baseline;
		gap: 9px;
		border: none;
		background: none;
		font: inherit;
		text-align: left;
		padding: 6px 8px;
		border-radius: 6px;
		cursor: pointer;
	}
	.mitem:hover {
		background: var(--c-paper-sunken, #efece6);
	}
	.mname {
		font-size: 12px;
		color: var(--c-ink, #2b2721);
	}
	.mhint {
		font-size: 11px;
		color: var(--c-ink-faint, #8f8677);
	}
	.msep {
		font-size: 9.5px;
		letter-spacing: 0.06em;
		color: var(--c-ink-faint, #a69d8d);
		padding: 5px 8px 2px;
		text-transform: lowercase;
	}
</style>
