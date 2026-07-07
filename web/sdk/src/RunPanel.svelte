<script lang="ts">
	// SDK RunPanel — inspect one run instance: nickname/seed, started/finished
	// timestamps, runtime (ticking while live), and the captured output log.
	// The log follows the CHUNK protocol: an initial tail window, then polls
	// fetch only appended bytes (`offset=size`), and the in-memory buffer is
	// capped with a front-trim — a multi-GB log can never reach the browser.
	// Hidden when the host adapter has no run inspection.
	import type { InterfaceStatus, RunDetail, WidgetHostAdapter } from './types';

	/** Initial window and client-side buffer cap (bytes). */
	const TAIL = 65536;
	const BUFFER_CAP = 262144;

	let {
		adapter,
		executionRef,
		status
	}: {
		adapter: WidgetHostAdapter;
		executionRef: string;
		/** The leaf lifecycle status — drives live polling while `running`. */
		status: InterfaceStatus;
	} = $props();

	let detail = $state<RunDetail | null>(null);
	let output = $state<string | null>(null);
	/** Bytes of log preceding the buffer (server tail offset or client trim). */
	let trimmed = $state(0);
	let seenSize = 0; // the next poll's offset
	let showOutput = $state(true);
	let now = $state(Date.now());
	let logEl = $state<HTMLElement | null>(null);

	async function load(fresh: boolean) {
		try {
			detail = (await adapter.runDetail?.(executionRef)) ?? null;
			if (!adapter.runOutput) return;
			const chunk = fresh
				? await adapter.runOutput(executionRef, { tail: TAIL })
				: await adapter.runOutput(executionRef, { offset: seenSize });
			if (chunk.output === null && fresh) {
				output = null;
				trimmed = 0;
				seenSize = 0;
				return;
			}
			if (fresh || chunk.size < seenSize) {
				// initial window, or the log was rewritten — start over from the tail
				output = chunk.output ?? '';
				trimmed = chunk.offset;
			} else if (chunk.output) {
				let next = (output ?? '') + chunk.output;
				if (next.length > BUFFER_CAP) {
					trimmed += next.length - BUFFER_CAP;
					next = next.slice(-BUFFER_CAP);
				}
				output = next;
			}
			seenSize = chunk.size;
			if (logEl) logEl.scrollTop = logEl.scrollHeight;
		} catch {
			/* record not readable yet (just dispatched) — the next poll retries */
		}
	}

	// Fresh load per run; incremental polling while the run is live (plus one
	// final incremental fetch when the status flips to a terminal state).
	let loadedRef: string | null = null;
	$effect(() => {
		executionRef;
		status;
		const fresh = loadedRef !== executionRef;
		loadedRef = executionRef;
		void load(fresh);
		if (status !== 'running') return;
		const poll = setInterval(() => void load(false), 1500);
		const tick = setInterval(() => (now = Date.now()), 500);
		return () => {
			clearInterval(poll);
			clearInterval(tick);
		};
	});

	function fmt(iso: string | null | undefined): string {
		if (!iso) return '—';
		const d = new Date(iso);
		return isNaN(d.getTime()) ? String(iso) : d.toLocaleTimeString();
	}
	const runtime = $derived.by(() => {
		const start = detail?.startedAt ? new Date(detail.startedAt).getTime() : NaN;
		if (isNaN(start)) return null;
		const end = detail?.finishedAt ? new Date(detail.finishedAt).getTime() : now;
		const seconds = Math.max(0, (end - start) / 1000);
		if (seconds < 60) return `${seconds.toFixed(1)}s`;
		const m = Math.floor(seconds / 60);
		return `${m}m ${Math.round(seconds - m * 60)}s`;
	});
</script>

{#if adapter.runDetail}
	<div class="run">
		<div class="meta mono">
			{#if detail?.nickname}<span class="nick">{detail.nickname}</span>{/if}
			{#if detail?.seed !== undefined}<span>seed {detail.seed}</span>{/if}
			<span>started {fmt(detail?.startedAt)}</span>
			{#if detail?.finishedAt}<span>finished {fmt(detail.finishedAt)}</span>{/if}
			{#if runtime}<span class="rt" class:live={status === 'running'}>{runtime}</span>{/if}
			<span class="spacer"></span>
			<button class="otoggle" onclick={() => (showOutput = !showOutput)}>
				{showOutput ? '▾' : '▸'} output
			</button>
		</div>
		{#if showOutput}
			{#if trimmed > 0}
				<div class="trim mono">… earlier output trimmed ({trimmed} bytes)</div>
			{/if}
			<pre class="log mono" bind:this={logEl}>{output?.trimEnd() || '(no output)'}</pre>
		{/if}
	</div>
{/if}

<style>
	.run {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 5px 14px;
		font-size: 10.5px;
		color: var(--c-ink-soft, #6b6760);
	}
	.nick {
		font-weight: 600;
		color: var(--c-ink, #2c2823);
	}
	.rt {
		color: var(--c-ink, #2c2823);
	}
	.rt.live {
		color: var(--c-model, #5b6ee0);
	}
	.spacer {
		flex: 1;
	}
	.otoggle {
		border: none;
		background: none;
		font: inherit;
		font-size: 10.5px;
		color: var(--c-ink-faint, #a69d8d);
		cursor: pointer;
		padding: 0;
	}
	.otoggle:hover {
		color: var(--c-ink-soft, #6b6760);
	}
	.trim {
		font-size: 10px;
		color: var(--c-ink-faint, #a69d8d);
	}
	.log {
		margin: 0;
		background: var(--c-field, #211e18);
		color: var(--c-field-ink, #e8e2d4);
		border-radius: 9px;
		padding: 9px 12px;
		font-size: 11px;
		line-height: 1.55;
		max-height: 220px;
		overflow: auto;
		white-space: pre-wrap;
		word-break: break-word;
	}
</style>
