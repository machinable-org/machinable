<script lang="ts">
	// SDK Lifecycle — the content-addressed run state machine for one interface config:
	// draft → running → cached / failed. Pure over WidgetHostAdapter (find/launch). It owns
	// the lookup + poll loop + Launch/Resume controls + status badge; the host reacts to
	// transitions via onStatus (e.g. radiate read-only up a stack, offer a result viewer,
	// notify on completion). No host/captu imports. See docs/machinable-widget-sdk.md.
	import { untrack } from 'svelte';
	import type { WidgetHostAdapter, InterfaceStatus, Ref, Version } from './types';

	let {
		adapter,
		module,
		version,
		context,
		execution,
		executionRef,
		disabled = false,
		compact = false,
		launchLabel = 'Launch',
		onStatus,
		onRun
	}: {
		adapter: WidgetHostAdapter;
		module: string;
		/** The compact version (override dicts ⊕ ~tokens) — the run's identity. */
		version: Version;
		/** Ordered `with`-context stack (any interface; Scope is one). */
		context?: Ref[];
		/** The Execution container. */
		execution?: Ref;
		executionRef?: string;
		disabled?: boolean;
		/** Controls-only rendering (no badge/status text) — for hosts that already show
		 * status elsewhere (e.g. inside the ResolvedBar). */
		compact?: boolean;
		launchLabel?: string;
		/** Status transitions; `runRef` is the backing run instance when known
		 * (dispatch/find) — what a host's run panel inspects. */
		onStatus?: (status: InterfaceStatus, runRef?: string) => void;
		/** Fired when a dispatch starts — feeds the host's RunBanner (elapsed clock,
		 * interruptable ref). The host clears it when status leaves `running`. */
		onRun?: (run: { executionRef: string; startedAt: number }) => void;
	} = $props();

	let status = $state<InterfaceStatus>('draft');
	let busy = $state(false);
	let error = $state('');

	// The running run's instance uuid (from dispatch / find) — what interrupt cancels.
	let runRef = $state<string | undefined>();

	function set(s: InterfaceStatus, ref?: string) {
		status = s;
		if (ref) runRef = ref;
		onStatus?.(s, runRef);
	}

	// Content-addressed lookup whenever identity (the version) or the execution it runs
	// under changes — editing config is "is THIS variant computed?", usually back to draft.
	// Never clobber an in-flight run. Identity changes also invalidate the poll loop.
	// `status` is read untracked: making it a dependency wedges the machine
	// (running → guard-out → nothing ever re-checks).
	$effect(() => {
		JSON.stringify(version);
		executionRef;
		pollToken++; // a stale dispatch's poll must not report on the new identity
		if (untrack(() => status) === 'running') return;
		let cancelled = false;
		void adapter.find(module, version, { context, executionRef }).then((r) => {
			if (!cancelled) set(r.status, r.executionRef);
		});
		return () => (cancelled = true);
	});

	// Launch (draft) OR Resume (failed) — the same call; the backend dedups / resumes by
	// content id.
	async function run() {
		busy = true;
		error = '';
		try {
			const d = await adapter.dispatch(module, version, { context, execution, executionRef });
			set('running', d.executionRef);
			onRun?.({ executionRef: d.executionRef, startedAt: Date.now() });
			void poll();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			busy = false;
		}
	}

	// One resilient loop per dispatch: keeps polling through transient request
	// failures AND through the just-dispatched window where the backend still
	// reports `draft` (record exists, run not started), until a terminal state.
	let pollToken = 0;
	async function poll() {
		const token = ++pollToken;
		for (;;) {
			await new Promise((r) => setTimeout(r, 600));
			if (token !== pollToken) return;
			try {
				const r = await adapter.find(module, version, { context, executionRef });
				if (token !== pollToken) return;
				if (r.status !== 'draft') set(r.status, r.executionRef);
				if (r.status === 'cached' || r.status === 'failed') return;
			} catch {
				/* transient (server busy during dispatch) — keep polling */
			}
		}
	}

	// Best-effort cancel of the in-flight run (writes a cancel marker server-side); the poll
	// then reflects it as failed (resumable).
	async function interrupt() {
		if (runRef) await adapter.interrupt(runRef);
	}
</script>

<div class="lifecycle" class:compact>
	{#if error}<div class="err mono">{error}</div>{/if}
	<div class="row">
		{#if !compact}<span class="badge {status}">{status}</span>{/if}
		{#if status === 'draft'}
			<button class="go launch" onclick={run} disabled={busy || disabled}>
				{launchLabel} <span class="arr">▸</span>
			</button>
		{:else if status === 'running'}
			{#if !compact}<span class="stat mono"><span class="spin">◴</span> running…</span>{/if}
			{#if runRef}<button class="go stop" onclick={interrupt}>Interrupt</button>{/if}
		{:else if status === 'cached'}
			{#if !compact}<span class="stat ready mono">✓ result cached</span>{/if}
		{:else if status === 'failed' || status === 'interrupted'}
			<button class="go resume" onclick={run} disabled={busy}>Resume</button>
		{/if}
	</div>
</div>

<style>
	.lifecycle {
		display: flex;
		flex-direction: column;
		gap: var(--sp-2, 8px);
	}
	.row {
		display: flex;
		align-items: center;
		gap: var(--sp-2, 8px);
	}
	.badge {
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 2px 7px;
		border-radius: 999px;
	}
	.badge.draft {
		background: color-mix(in srgb, var(--c-ink, #2c2823) 12%, transparent);
		color: var(--c-ink-soft, #6b6760);
	}
	.badge.running {
		background: color-mix(in srgb, var(--c-model, #5b6ee0) 20%, transparent);
		color: var(--c-model, #5b6ee0);
	}
	.badge.cached {
		background: color-mix(in srgb, var(--c-live, #2f9e6f) 20%, transparent);
		color: var(--c-live, #2f9e6f);
	}
	.badge.failed {
		background: color-mix(in srgb, var(--c-record, #cf5252) 18%, transparent);
		color: var(--c-record, #cf5252);
	}
	.go {
		font-size: var(--fs-sm, 13px);
		padding: 6px 12px;
		border-radius: var(--radius-sm, 5px);
		border: 1px solid var(--c-hairline-strong, #d8d3ca);
		background: var(--c-paper-raised, #fff);
		color: var(--c-ink, #2c2823);
		cursor: pointer;
	}
	/* the primary Launch action (design D1: filled model-blue, in the ResolvedBar) */
	.go.launch {
		background: var(--c-model, #5b6ee0);
		border-color: var(--c-model, #5b6ee0);
		color: #fff;
		font-weight: 600;
		padding: 7px 18px;
		border-radius: 9px;
	}
	.go.launch .arr {
		font-size: 10px;
	}
	.go:disabled {
		opacity: 0.55;
	}
	.go.resume,
	.go.stop {
		border-color: var(--c-record, #cf5252);
		color: var(--c-record, #cf5252);
	}
	.go.stop {
		padding: 3px 10px;
		font-size: var(--fs-xs, 11px);
	}
	.stat {
		font-size: var(--fs-xs, 11px);
		color: var(--c-ink-faint, #9a958c);
	}
	.stat.ready {
		color: var(--c-live, #2f9e6f);
		font-weight: 600;
	}
	.spin {
		display: inline-block;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.err {
		padding: var(--sp-2, 8px);
		background: color-mix(in srgb, var(--c-record, #cf5252) 12%, transparent);
		border: 1px solid var(--c-record, #cf5252);
		border-radius: var(--radius-sm, 5px);
		font-size: var(--fs-xs, 11px);
		white-space: pre-wrap;
	}
</style>
