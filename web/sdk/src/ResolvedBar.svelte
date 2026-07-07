<script lang="ts">
	// SDK ResolvedBar — the pinned ACTION BAR above the tabs: the one status badge
	// (no separate header indicator), the identity chip, resolve issues, and the
	// launch controls (children — the Lifecycle owns the state machine). Runs the
	// live debounced resolve and reports the outcome up (`onResolved`) for field
	// attachment, Launch gating, and the CLI tab. Pure over WidgetHostAdapter.
	import type { Snippet } from 'svelte';
	import type { BadgeVariant } from './StatusBadge.svelte';
	import StatusBadge from './StatusBadge.svelte';
	import type { ResolveIssue, ResolveResult, Version, WidgetHostAdapter } from './types';

	let {
		adapter,
		module,
		version,
		badge = null,
		onResolved,
		children
	}: {
		adapter: WidgetHostAdapter;
		module: string;
		version: Version;
		/** The single status badge (draft/running/cached-reuse/…), host-derived. */
		badge?: BadgeVariant | null;
		/** Every resolve outcome (ok or issues) — the host attaches issues to fields and
		 * gates Launch. */
		onResolved?: (r: ResolveResult) => void;
		children?: Snippet;
	} = $props();

	let identity = $state('');
	let issues = $state<ResolveIssue[]>([]);

	$effect(() => {
		JSON.stringify(version);
		module;
		let cancelled = false;
		const h = setTimeout(() => {
			void adapter.resolve(module, version).then((r) => {
				if (cancelled) return;
				if (r.ok) {
					identity = r.identity ?? '';
					issues = [];
				} else {
					identity = '';
					issues = r.issues;
				}
				onResolved?.(r);
			});
		}, 150);
		return () => {
			cancelled = true;
			clearTimeout(h);
		};
	});
</script>

<div class="bar">
	<div class="brow">
		{#if badge}<StatusBadge variant={badge} />{/if}
		{#if identity}
			<span class="ident mono">#{identity}</span>
		{/if}
		{#if issues.length}
			<span class="state mono bad">✕ fix to launch</span>
		{/if}
		<span class="spacer"></span>
		{@render children?.()}
	</div>

	{#if issues.length}
		<div class="issues">
			{#each issues as it, i (i)}
				<div class="issue mono">{it.path ? `${it.path} · ` : ''}{it.message}</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.bar {
		flex: none;
		border-bottom: 1px solid var(--c-hairline, #dcd5c6);
		background: var(--c-paper-sunken, #f1ecdf);
		padding: 8px 14px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.brow {
		display: flex;
		align-items: center;
		flex-wrap: wrap; /* a long identity row wraps — Launch must never clip */
		gap: 6px 12px;
		min-height: 18px;
		min-width: 0;
	}
	.spacer {
		flex: 1;
	}

	.issues {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.issue {
		font-size: 11px;
		color: var(--c-record, #cf5252);
		background: color-mix(in srgb, var(--c-record, #cf5252) 8%, transparent);
		border-radius: 6px;
		padding: 6px 9px;
	}

	.ident {
		font-size: 11px;
		color: var(--c-ink, #2b2721);
		white-space: nowrap;
	}
	.state {
		font-size: 11px;
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}
	.state.bad {
		color: var(--c-record, #cf5252);
	}
</style>
