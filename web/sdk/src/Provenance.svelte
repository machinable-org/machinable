<script lang="ts">
	// SDK Provenance — "exactly how was this produced, and with which code?" (design D5).
	// The node-link DAG rendered as a nested list (reads better than a diagram at tile
	// scale): RECIPE (the frozen with-nesting + the target's compact version) ⊕ HISTORY
	// (executions newest-first, each `uses` a Manifest pinning code state — commit,
	// clean/dirty, deps) ⊕ a truncation note. Loads on mount — the host's disclosure
	// (the ⌥ chip / the browser peek) already gates it. Pure over
	// WidgetHostAdapter.provenance; no host/captu imports.
	import type {
		ProvenanceNode,
		ProvenanceRecord,
		SourceRef,
		Version,
		WidgetHostAdapter
	} from './types';
	import { versionCliParts } from './introspection';

	let {
		adapter,
		module,
		version,
		onViewSource
	}: {
		adapter: WidgetHostAdapter;
		module: string;
		version: Version;
		/** Jump to the interface source (best effort — at the current code state). */
		onViewSource?: (ref: SourceRef) => void;
	} = $props();

	let prov = $state<ProvenanceRecord | null>(null);
	let loaded = $state(false);

	$effect(() => {
		module;
		JSON.stringify(version);
		loaded = false;
		prov = null;
		let cancelled = false;
		void adapter
			.provenance(module, version)
			.then((p) => {
				if (!cancelled) {
					prov = p;
					loaded = true;
				}
			})
			.catch(() => {
				if (!cancelled) loaded = true;
			});
		return () => (cancelled = true);
	});

	function nodeById(g: ProvenanceRecord, uuid: string): ProvenanceNode | undefined {
		return g.nodes.find((n) => n.uuid === uuid);
	}
	/** Nodes reachable from `from` by edge rel (runs, uses, context, …). */
	function related(g: ProvenanceRecord, from: string, rel: string): ProvenanceNode[] {
		return g.links
			.filter((l) => l.source === from && l.rel === rel)
			.map((l) => nodeById(g, l.target))
			.filter((n): n is ProvenanceNode => !!n);
	}
	function asRecord(v: unknown): Record<string, unknown> {
		return v && typeof v === 'object' ? (v as Record<string, unknown>) : {};
	}

	const root = $derived(prov ? nodeById(prov, prov.root) : undefined);
	const rootAttrs = $derived(asRecord(root?.attributes));
	/** Ordered with-context refs recorded on the root ({target, version}). */
	const context = $derived.by(() => {
		const raw = rootAttrs.context;
		if (!Array.isArray(raw)) return [] as { target: string; version: Version }[];
		return raw.map((c) => {
			const r = asRecord(c);
			return {
				target: String(r.target ?? c),
				version: (Array.isArray(r.version) ? r.version : []) as Version
			};
		});
	});
	const rootVersion = $derived.by((): Version => {
		const layers = asRecord(rootAttrs.config_layers);
		return (Array.isArray(layers.version) ? layers.version : (root?.version ?? [])) as Version;
	});
	/** Executions newest-first, each with the Manifest it uses. */
	const executions = $derived.by(() => {
		if (!prov) return [];
		return related(prov, prov.root, 'runs')
			.map((ex) => {
				const attrs = asRecord(ex.attributes);
				const mf = related(prov!, ex.uuid, 'uses').find((n) => n.kind === 'Manifest');
				const mfa = asRecord(mf?.attributes);
				return {
					uuid: ex.uuid,
					ts: typeof attrs.timestamp === 'number' ? attrs.timestamp * 1000 : undefined,
					status: typeof attrs.status === 'string' ? attrs.status : undefined,
					commit: typeof mfa.commit === 'string' ? mfa.commit : undefined,
					dirty: !!mfa.dirty,
					deps: Array.isArray(mfa.dependencies) ? mfa.dependencies.map(String) : []
				};
			})
			.sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0));
	});

	function ago(ms?: number): string {
		if (!ms) return '';
		const s = Math.max(0, (Date.now() - ms) / 1000);
		if (s < 60) return 'just now';
		if (s < 3600) return `${Math.floor(s / 60)}m ago`;
		if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
		return `${Math.floor(s / 86400)}d ago`;
	}
	async function jumpToSource() {
		try {
			const s = await adapter.introspect(module);
			if (s.sourceRef) onViewSource?.(s.sourceRef);
		} catch {
			/* no source */
		}
	}
</script>

<div class="prov">
	{#if !loaded}
		<div class="empty mono">loading provenance…</div>
	{:else if !prov || !root}
		<div class="empty mono">no provenance recorded — not yet executed</div>
	{:else}
		<!-- RECIPE — the frozen with-nesting -->
		<div class="sect">
			<div class="cap mono">RECIPE · config ⊕ context <span class="capsub">— frozen</span></div>
			<div class="recipe mono">
				{#each context as c, i (i)}
					<div class="rline" style="padding-left: {i * 16}px">
						<span class="kw">with</span>
						<span class="mod">{c.target}</span>
						{#if versionCliParts(c.version).length}
							<span class="cargs">{versionCliParts(c.version).join(' ')}</span>
						{/if}
					</div>
				{/each}
				<div class="rline" style="padding-left: {context.length * 16}px">
					<span class="tgt">{root.module ?? module}</span>
				</div>
				{#if versionCliParts(rootVersion).length}
					<div class="rline" style="padding-left: {context.length * 16 + 12}px">
						<span class="vparts">{versionCliParts(rootVersion).join(' · ')}</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- HISTORY — executions newest-first, each with its Manifest -->
		<div class="sect">
			<div class="cap mono">HISTORY · executions · newest first</div>
			{#each executions as ex (ex.uuid)}
				<div class="exec">
					<div class="erow">
						<span class="edot" class:bad={ex.status === 'failed'}></span>
						<span class="est">{ex.status ?? 'run'}</span>
						<span class="espacer"></span>
						<span class="ets mono">{ago(ex.ts)}</span>
					</div>
					{#if ex.commit}
						<div class="erow mf">
							<span class="mfk mono">uses manifest</span>
							<span class="commit mono">{ex.commit}</span>
							{#if ex.dirty}
								<span class="dirty mono">dirty ●</span>
							{:else}
								<span class="clean mono">clean</span>
							{/if}
							<span class="espacer"></span>
							{#if onViewSource}
								<button class="src mono" onclick={jumpToSource}>view source ▸</button>
							{/if}
						</div>
						{#if ex.deps.length}
							<div class="deps mono">deps · {ex.deps.join(' · ')}</div>
						{/if}
					{/if}
				</div>
			{:else}
				<div class="empty mono">(not yet executed)</div>
			{/each}
		</div>

		{#if prov.truncated}
			<div class="trunc mono">graph truncated · more layers hidden ▾</div>
		{/if}
	{/if}
</div>

<style>
	.prov {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.empty {
		font-size: 10.5px;
		color: var(--c-ink-faint, #9a958c);
	}
	.sect {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.cap {
		font-size: 10px;
		letter-spacing: 0.08em;
		color: var(--c-ink-faint, #a69d8d);
		font-weight: 700;
	}
	.capsub {
		font-weight: 400;
		letter-spacing: 0;
		color: var(--c-ink-faint, #c9c0af);
	}

	/* recipe */
	.recipe {
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 11.5px;
	}
	.rline {
		display: flex;
		gap: 7px;
		align-items: baseline;
	}
	.kw {
		color: var(--c-ink-faint, #8f8677);
	}
	.mod {
		color: var(--c-ink, #2b2721);
	}
	.cargs {
		color: var(--c-lagging, #a1785c);
	}
	.tgt {
		color: var(--c-ink, #2b2721);
		font-weight: 600;
	}
	.vparts {
		color: var(--c-ink-soft, #6f6759);
	}

	/* history */
	.exec {
		display: flex;
		flex-direction: column;
		gap: 6px;
		border: 1px solid var(--c-hairline, #dcd5c6);
		border-radius: 9px;
		background: var(--c-paper-raised, #fff);
		padding: 8px 10px;
	}
	.erow {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.erow.mf {
		border-top: 1px dashed var(--c-paper-sunken, #ece6d8);
		padding-top: 7px;
	}
	.edot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--c-live, #2f9e6f);
		flex: none;
	}
	.edot.bad {
		background: var(--c-record, #cf5252);
	}
	.est {
		font-size: 12px;
		font-weight: 600;
		color: var(--c-ink, #2b2721);
	}
	.espacer {
		flex: 1;
	}
	.ets {
		font-size: 10.5px;
		color: var(--c-ink-faint, #a69d8d);
	}
	.mfk {
		font-size: 10.5px;
		color: var(--c-ink-faint, #8f8677);
	}
	.commit {
		font-size: 11px;
		background: var(--c-paper-sunken, #ece6d8);
		color: var(--c-ink, #2b2721);
		padding: 1px 7px;
		border-radius: 5px;
	}
	.clean {
		font-size: 10px;
		font-weight: 600;
		color: var(--c-live, #2f9e6f);
	}
	.dirty {
		font-size: 10px;
		font-weight: 600;
		color: var(--c-lagging, #e0a06a);
	}
	.src {
		border: none;
		background: none;
		font-size: 10.5px;
		color: var(--c-model, #5b6ee0);
		cursor: pointer;
		padding: 0;
	}
	.deps {
		font-size: 10px;
		color: var(--c-ink-faint, #a69d8d);
	}

	.trunc {
		font-size: 10.5px;
		color: var(--c-ink-faint, #8f8677);
	}
</style>
