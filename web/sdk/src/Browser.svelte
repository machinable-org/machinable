<script lang="ts">
	// SDK Browser — the run browser (design D4): search + typed facet chips (equality and
	// range operators over config paths) + sort over the adapter's config_search, rows as
	// content-addressed identities (status · renameable label · #identity · compact version
	// summary · code chip · run count · time · creator · provenance peek), and load-more
	// pagination. "Open" hands the record to the host (reconstruct into the composer).
	// Pure over WidgetHostAdapter; no host/captu imports.
	import type {
		CatalogQuery,
		Facet,
		FacetOp,
		RunRecord,
		WidgetHostAdapter
	} from './types';
	import { versionCliParts } from './introspection';
	import Provenance from './Provenance.svelte';

	let {
		adapter,
		onNew,
		onOpen,
		onTotal
	}: {
		adapter: WidgetHostAdapter;
		/** Renders a pinned "New" entry at the top of the list (the ListView → ItemView
		 * flow: configuring a fresh interface is conceptually the first list entry). */
		onNew?: () => void;
		onOpen?: (run: RunRecord) => void;
		/** Total matches — for the host's "N runs" header chip. */
		onTotal?: (total: number) => void;
	} = $props();

	const PAGE = 20;
	let text = $state('');
	let facets = $state<Facet[]>([]);
	let sortBy = $state<'newest' | 'oldest' | 'label'>('newest');
	let items = $state<RunRecord[]>([]);
	let total = $state(0);
	let error = $state('');
	let loadingMore = $state(false);

	function query(offset: number): CatalogQuery {
		return {
			text: text.trim() || undefined,
			facets: facets.length ? facets : undefined,
			sort:
				sortBy === 'label'
					? { by: 'label', direction: 'asc' }
					: { by: 'created_at_ns', direction: sortBy === 'newest' ? 'desc' : 'asc' },
			limit: PAGE,
			offset
		};
	}
	async function refresh() {
		error = '';
		try {
			const page = await adapter.list(query(0));
			items = page.items;
			total = page.total;
			onTotal?.(page.total);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}
	async function loadMore() {
		loadingMore = true;
		try {
			const page = await adapter.list(query(items.length));
			items = [...items, ...page.items];
			total = page.total;
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loadingMore = false;
		}
	}
	// live re-query on search/facet/sort edits (debounced for typing)
	$effect(() => {
		text;
		JSON.stringify(facets);
		sortBy;
		const h = setTimeout(() => void refresh(), 200);
		return () => clearTimeout(h);
	});

	// ── facet editor ────────────────────────────────────────────────────────────
	const OPS: { op: FacetOp; label: string }[] = [
		{ op: 'eq', label: '=' },
		{ op: 'ne', label: '≠' },
		{ op: 'lt', label: '<' },
		{ op: 'lte', label: '≤' },
		{ op: 'gt', label: '>' },
		{ op: 'gte', label: '≥' },
		{ op: 'contains', label: '⊃' }
	];
	let facetOpen = $state(false);
	let fPath = $state('');
	let fOp = $state<FacetOp>('eq');
	let fValue = $state('');
	function addFacet() {
		if (!fPath.trim() || fValue === '') return;
		const num = Number(fValue);
		const value = fValue.trim() !== '' && !Number.isNaN(num) ? num : fValue;
		facets = [...facets, { path: fPath.trim(), op: fOp, value }];
		fPath = '';
		fValue = '';
		fOp = 'eq';
		facetOpen = false;
	}
	function removeFacet(i: number) {
		facets = facets.filter((_, j) => j !== i);
	}
	function facetText(f: Facet): string {
		const op = OPS.find((o) => o.op === f.op)?.label ?? f.op;
		return `${f.path} ${op} ${typeof f.value === 'string' ? f.value : JSON.stringify(f.value)}`;
	}

	// ── rows ────────────────────────────────────────────────────────────────────
	function summaryParts(r: RunRecord): string[] {
		if (r.version?.length) return versionCliParts(r.version);
		return Object.entries(r.config).map(
			([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`
		);
	}
	function ago(ms?: number): string {
		if (!ms) return '';
		const s = Math.max(0, (Date.now() - ms) / 1000);
		if (s < 60) return 'just now';
		if (s < 3600) return `${Math.floor(s / 60)}m ago`;
		if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
		return `${Math.floor(s / 86400)}d ago`;
	}

	let renaming = $state<string | null>(null);
	let renameText = $state('');
	async function commitRename(r: RunRecord) {
		const name = renameText.trim();
		renaming = null;
		if (!name || name === r.label || !adapter.setLabel) return;
		try {
			await adapter.setLabel(r.uuid, name);
			await refresh();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	let peeking = $state<string | null>(null); // uuid with the provenance peek open
</script>

<div class="cat">
	{#if error}<div class="err mono">{error}</div>{/if}

	<!-- search + facets -->
	<div class="controls">
		<div class="search">
			<span class="mag">⌕</span>
			<input placeholder="search config & labels…" bind:value={text} />
		</div>
		<div class="chips">
			{#each facets as f, i (i)}
				<span class="chip mono">{facetText(f)} <button class="x" onclick={() => removeFacet(i)}>×</button></span>
			{/each}
			<button class="addf mono" onclick={() => (facetOpen = !facetOpen)}>+ facet</button>
			<span class="spacer"></span>
			<label class="sort mono">
				sort:
				<select bind:value={sortBy}>
					<option value="newest">newest</option>
					<option value="oldest">oldest</option>
					<option value="label">label</option>
				</select>
			</label>
		</div>
		{#if facetOpen}
			<div class="fform">
				<input class="fp mono" placeholder="config path — e.g. alpha" bind:value={fPath} />
				<select class="fo mono" bind:value={fOp}>
					{#each OPS as o (o.op)}<option value={o.op}>{o.label}</option>{/each}
				</select>
				<input
					class="fv mono"
					placeholder="value"
					bind:value={fValue}
					onkeydown={(e) => e.key === 'Enter' && addFacet()}
				/>
				<button class="fadd" onclick={addFacet}>add</button>
			</div>
		{/if}
	</div>

	<!-- the New entry — conceptually the first list item (ListView → ItemView flow) -->
	{#if onNew}
		<button class="newrow" onclick={onNew}>
			<span class="newplus mono">+</span>
			<span class="newmeta">
				<span class="newname">New run</span>
			</span>
			<span class="chev">›</span>
		</button>
	{/if}

	<!-- rows -->
	{#if items.length === 0}
		<div class="nomatch">
			<div class="nm mono">0 runs match</div>
			{#if facets.length || text}
				<button
					class="clear mono"
					onclick={() => {
						facets = [];
						text = '';
					}}>clear filters ×</button
				>
			{:else}
				<div class="hint mono">no runs yet</div>
			{/if}
		</div>
	{:else}
		<div class="rows">
			{#each items as r (r.uuid)}
				<div
					class="row"
					role="button"
					tabindex="0"
					onclick={() => onOpen?.(r)}
					onkeydown={(e) => e.key === 'Enter' && onOpen?.(r)}
				>
					<div class="r1">
						<span class="dot {r.status}" class:pulse={r.status === 'running'}></span>
						{#if renaming === r.uuid}
							<!-- svelte-ignore a11y_autofocus -->
							<input
								class="rename mono"
								bind:value={renameText}
								autofocus
								onclick={(e) => e.stopPropagation()}
								onkeydown={(e) => {
									e.stopPropagation();
									if (e.key === 'Enter') void commitRename(r);
									if (e.key === 'Escape') renaming = null;
								}}
								onblur={() => void commitRename(r)}
							/>
						{:else}
							<span class="lbl">{r.label ?? r.module}</span>
							{#if adapter.setLabel}
								<button
									class="pen"
									title="rename"
									onclick={(e) => {
										e.stopPropagation();
										renaming = r.uuid;
										renameText = r.label ?? '';
									}}>✎</button
								>
							{/if}
						{/if}
						<span class="spacer"></span>
						{#if r.identity}<span class="ident mono">#{r.identity}</span>{/if}
						<span class="chev">›</span>
					</div>
					<div class="r2 mono">
						{#each summaryParts(r).slice(0, 4) as p, i (i)}<span class="sp">{p}</span>{/each}
						{#if summaryParts(r).length > 4}<span class="more">+{summaryParts(r).length - 4} more</span>{/if}
						{#if summaryParts(r).length === 0}<span class="more">defaults</span>{/if}
					</div>
					<div class="r3">
						<span class="st {r.status}">{r.status}</span>
						{#if r.manifest}
							<span class="git mono">git {r.manifest.commit}{r.manifest.dirty ? '*' : ''}</span>
						{/if}
						{#if r.runCount && r.runCount > 1}<span class="meta">{r.runCount} runs</span>{/if}
						<span class="meta">{ago(r.createdAt)}{r.creator ? ` · ${r.creator}` : ''}</span>
						<span class="spacer"></span>
						<button
							class="peek mono"
							onclick={(e) => {
								e.stopPropagation();
								peeking = peeking === r.uuid ? null : r.uuid;
							}}
						>⌥ provenance</button>
					</div>
					{#if peeking === r.uuid}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div class="peekbody" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
							<Provenance {adapter} module={r.module} version={r.version ?? [r.config]} />
						</div>
					{/if}
				</div>
			{/each}
		</div>
		<div class="foot mono">
			<span>1–{items.length} of {total}</span>
			<span class="spacer"></span>
			{#if items.length < total}
				<button class="morebtn mono" onclick={loadMore} disabled={loadingMore}>
					{loadingMore ? 'loading…' : 'load more ▾'}
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.cat {
		display: flex;
		flex-direction: column;
		gap: 10px;
		font-size: var(--fs-sm, 13px);
	}
	.spacer {
		flex: 1;
	}
	.err {
		padding: var(--sp-2, 8px);
		background: color-mix(in srgb, var(--c-record, #cf5252) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--c-record, #cf5252) 55%, transparent);
		border-radius: var(--radius-sm, 6px);
		font-size: var(--fs-xs, 11px);
		color: var(--c-record, #cf5252);
		white-space: pre-wrap;
	}

	/* controls */
	.controls {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.search {
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--c-paper-raised, #fff);
		border: 1px solid var(--c-hairline-strong, #cfc6b3);
		border-radius: 9px;
		padding: 0 11px;
		height: 34px;
	}
	.mag {
		color: var(--c-ink-faint, #a69d8d);
	}
	.search input {
		flex: 1;
		border: none;
		outline: none;
		font: inherit;
		font-size: 12.5px;
		background: none;
		color: var(--c-ink, #2c2823);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		align-items: center;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 11px;
		background: var(--c-paper-sunken, #ece6d8);
		color: var(--c-ink, #2b2721);
		padding: 3px 8px;
		border-radius: 7px;
	}
	.chip .x {
		border: none;
		background: none;
		color: var(--c-ink-faint, #a69d8d);
		cursor: pointer;
		padding: 0;
		font-size: 12px;
		line-height: 1;
	}
	.addf {
		border: 1px dashed color-mix(in srgb, var(--c-model, #5b6ee0) 45%, transparent);
		background: none;
		font-size: 11px;
		color: var(--c-model, #5b6ee0);
		padding: 3px 9px;
		border-radius: 7px;
		cursor: pointer;
	}
	.sort {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 11px;
		color: var(--c-ink-faint, #8f8677);
	}
	.sort select {
		font: inherit;
		font-size: 11px;
		border: none;
		background: none;
		color: var(--c-ink-soft, #6f6759);
		cursor: pointer;
	}
	.fform {
		display: flex;
		gap: 6px;
		align-items: center;
	}
	.fp,
	.fv {
		flex: 1;
		min-width: 0;
		font: inherit;
		font-size: 11px;
		padding: 5px 8px;
		border-radius: 7px;
		border: 1px solid var(--c-hairline-strong, #cfc6b3);
		background: var(--c-paper-raised, #fff);
		color: var(--c-ink, #2c2823);
	}
	.fo {
		font: inherit;
		font-size: 12px;
		border: 1px solid var(--c-hairline-strong, #cfc6b3);
		border-radius: 7px;
		background: var(--c-paper-raised, #fff);
		padding: 4px;
	}
	.fadd {
		border: 1px solid var(--c-hairline-strong, #cfc6b3);
		background: var(--c-paper-raised, #fff);
		font: inherit;
		font-size: 11.5px;
		padding: 4px 12px;
		border-radius: 7px;
		cursor: pointer;
	}

	/* the New entry */
	.newrow {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		border: 1px dashed color-mix(in srgb, var(--c-model, #5b6ee0) 45%, transparent);
		background: color-mix(in srgb, var(--c-model, #5b6ee0) 4%, transparent);
		border-radius: 9px;
		padding: 9px 12px;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
	.newrow:hover {
		background: color-mix(in srgb, var(--c-model, #5b6ee0) 9%, transparent);
	}
	.newplus {
		width: 22px;
		height: 22px;
		border-radius: 6px;
		background: color-mix(in srgb, var(--c-model, #5b6ee0) 14%, transparent);
		color: var(--c-model, #5b6ee0);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		font-weight: 600;
		flex: none;
	}
	.newmeta {
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
	}
	.newname {
		font-size: 13px;
		font-weight: 600;
		color: var(--c-ink, #2b2721);
	}
	.newdesc {
		font-size: 11px;
		color: var(--c-ink-faint, #8f8677);
	}
	.chev {
		margin-left: auto;
		font-size: 14px;
		color: var(--c-ink-faint, #c9c0af);
		flex: none;
	}
	.row .chev {
		margin-left: 0;
	}

	/* rows */
	.rows {
		display: flex;
		flex-direction: column;
	}
	.row {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 11px 6px;
		border-bottom: 1px solid var(--c-paper-sunken, #ece6d8);
		border-radius: 8px;
		cursor: pointer;
	}
	.row:hover {
		background: color-mix(in srgb, var(--c-ink, #2c2823) 3%, transparent);
	}
	.row:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--c-model, #5b6ee0) 55%, transparent);
		outline-offset: -2px;
	}
	.r1,
	.r3 {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex: none;
	}
	.dot.cached {
		background: var(--c-live, #2f9e6f);
	}
	.dot.running {
		background: var(--c-model, #5b6ee0);
	}
	.dot.failed,
	.dot.interrupted {
		background: var(--c-record, #cf5252);
	}
	.dot.draft {
		background: var(--c-ink-faint, #a69d8d);
	}
	.dot.pulse {
		animation: br-pulse 1.4s ease-in-out infinite;
	}
	@keyframes br-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.35;
		}
	}
	.lbl {
		font-size: 13px;
		font-weight: 600;
		color: var(--c-ink, #2b2721);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.pen {
		border: none;
		background: none;
		font-size: 10.5px;
		color: var(--c-ink-faint, #8f8677);
		cursor: pointer;
		padding: 0 2px;
	}
	.rename {
		flex: 1;
		font: inherit;
		font-size: 12px;
		padding: 3px 7px;
		border-radius: 6px;
		border: 1px solid var(--c-model, #5b6ee0);
		background: var(--c-paper-raised, #fff);
		color: var(--c-ink, #2c2823);
	}
	.ident {
		font-size: 10.5px;
		color: var(--c-ink-faint, #a69d8d);
	}
	.r2 {
		display: flex;
		flex-wrap: wrap;
		gap: 3px 10px;
		font-size: 11px;
		color: var(--c-ink-soft, #6f6759);
	}
	.sp {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 200px;
	}
	.more {
		color: var(--c-ink-faint, #c9c0af);
	}
	.r3 {
		font-size: 11px;
		color: var(--c-ink-faint, #8f8677);
	}
	.st {
		font-weight: 600;
	}
	.st.cached {
		color: var(--c-live, #2f9e6f);
	}
	.st.running {
		color: var(--c-model, #5b6ee0);
	}
	.st.failed,
	.st.interrupted {
		color: var(--c-record, #cf5252);
	}
	.st.draft {
		color: var(--c-ink-soft, #6f6759);
	}
	.git {
		font-size: 10.5px;
		background: var(--c-paper-sunken, #ece6d8);
		color: var(--c-ink-soft, #6f6759);
		padding: 1px 6px;
		border-radius: 5px;
	}
	.meta {
		white-space: nowrap;
	}
	.peek {
		border: none;
		background: none;
		font-size: 10.5px;
		color: var(--c-model, #5b6ee0);
		cursor: pointer;
		padding: 0;
	}
	.open {
		font-size: var(--fs-xs, 11px);
		padding: 3px 10px;
		border-radius: var(--radius-sm, 6px);
		border: 1px solid var(--c-hairline-strong, #d8d3ca);
		background: var(--c-paper-raised, #fff);
		color: var(--c-ink, #2c2823);
		cursor: pointer;
	}
	.peekbody {
		padding: 4px 0 2px 16px;
	}

	/* empty / footer */
	.nomatch {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 18px 0;
	}
	.nm {
		font-size: 12px;
		color: var(--c-ink-faint, #a69d8d);
	}
	.hint {
		font-size: 10.5px;
		color: var(--c-ink-faint, #c9c0af);
	}
	.clear {
		border: none;
		background: none;
		font-size: 11px;
		color: var(--c-model, #5b6ee0);
		cursor: pointer;
	}
	.foot {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 11px;
		color: var(--c-ink-faint, #8f8677);
		padding-top: 2px;
	}
	.morebtn {
		border: none;
		background: none;
		font-size: 11px;
		color: var(--c-model, #5b6ee0);
		cursor: pointer;
	}
</style>
