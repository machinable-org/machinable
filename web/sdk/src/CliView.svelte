<script lang="ts">
	// SDK CliView — the canonical CLI as its own tab (moved out of the pinned bar):
	// the paste-verbatim `machinable get …` on field-dark with semantic token coloring,
	// context spans hover-mapped to their layers, and a copy affordance.
	import type { Version } from './types';
	import { versionCliParts } from './introspection';
	import type { ChainElement } from './ContextStack.svelte';

	let {
		cli,
		module,
		chain = [],
		highlightId = null,
		onHighlight
	}: {
		/** The target's resolve CLI (server-issued, `machinable get <target …>`). */
		cli: string;
		module: string;
		chain?: ChainElement[];
		highlightId?: string | null;
		onHighlight?: (id: string | null) => void;
	} = $props();

	// ── CLI tokenization (space-split at quote/bracket depth 0) + semantic classes ──
	function splitCli(s: string): string[] {
		const out: string[] = [];
		let depth = 0;
		let quote: string | null = null;
		let cur = '';
		for (const c of s) {
			if (quote) {
				cur += c;
				if (c === quote) quote = null;
				continue;
			}
			if (c === "'" || c === '"') {
				quote = c;
				cur += c;
				continue;
			}
			if (c === '[' || c === '{' || c === '(') depth++;
			if (c === ']' || c === '}' || c === ')') depth--;
			if (c === ' ' && depth === 0) {
				if (cur) out.push(cur);
				cur = '';
				continue;
			}
			cur += c;
		}
		if (cur) out.push(cur);
		return out;
	}
	const targetRest = $derived(cli.replace(/^machinable get /, ''));
	const targetTokens = $derived.by(() => {
		if (!targetRest) return [];
		return splitCli(targetRest).map((w) => {
			let cls = 'plain';
			if (w === module || w.endsWith(module)) cls = 'mod';
			else if (w.startsWith('~')) cls = 'tok';
			else if (w.includes('=')) cls = 'kv';
			return { w, cls };
		});
	});

	/** One context element as CLI text: `module k=v ~token …` (paste-verbatim). */
	function ctxText(el: ChainElement): string {
		return [el.module, ...versionCliParts(el.version)].join(' ');
	}
	const fullCli = $derived(
		['machinable get', ...chain.map(ctxText), targetRest, '--launch'].filter(Boolean).join(' ')
	);

	let copied = $state(false);
	async function copy() {
		try {
			await navigator.clipboard.writeText(fullCli);
			copied = true;
			setTimeout(() => (copied = false), 1200);
		} catch {
			/* clipboard unavailable — ignore */
		}
	}
</script>

<div class="cliview">
	{#if cli}
		<div class="cli mono">
			<span class="cmd">machinable get</span>{' '}{#each chain as el (el.id)}<span
					class="ctxspan"
					class:hl={highlightId === el.id}
					role="note"
					onmouseenter={() => onHighlight?.(el.id)}
					onmouseleave={() => onHighlight?.(null)}>{ctxText(el)}</span
				>{' '}{/each}<span class="tgtspan"
				>{#each targetTokens as t, i (i)}<span class={t.cls}>{t.w}</span>{i < targetTokens.length - 1
						? ' '
						: ''}{/each}</span
			>{' '}<span class="launchflag">--launch</span>
		</div>
		<button class="copy mono" onclick={copy}>{copied ? 'copied ✓' : 'copy ⧉'}</button>
	{:else}
		<div class="cli mono dim">resolving…</div>
	{/if}
</div>

<style>
	.cliview {
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: flex-start;
	}
	.cli {
		align-self: stretch;
		background: var(--c-field, #211e18);
		border-radius: 9px;
		padding: 10px 12px;
		font-size: 11.5px;
		line-height: 1.6;
		color: var(--c-field-ink, #e8e2d4);
		word-break: break-all;
	}
	.cli.dim {
		color: var(--c-ink-faint, #8f8677);
	}
	.cli .cmd {
		color: #8f8677;
	}
	.cli .mod {
		color: #8ba0f0;
	}
	.cli .kv {
		color: #7fc9a6;
	}
	.cli .tok {
		color: #8ba0f0;
	}
	.cli .launchflag {
		color: #e0a06a;
	}
	.cli .ctxspan {
		background: color-mix(in srgb, #5b6ee0 20%, transparent);
		border-radius: 4px;
		padding: 1px 4px;
		cursor: default;
	}
	.cli .ctxspan.hl {
		background: color-mix(in srgb, #5b6ee0 45%, transparent);
	}
	.cli .tgtspan {
		background: color-mix(in srgb, #2f9e6f 14%, transparent);
		border-radius: 4px;
		padding: 1px 4px;
	}
	.copy {
		border: none;
		background: none;
		font-size: 11px;
		color: var(--c-ink-faint, #a69d8d);
		cursor: pointer;
		padding: 0;
	}
	.copy:hover {
		color: var(--c-ink-soft, #6b6760);
	}
</style>
