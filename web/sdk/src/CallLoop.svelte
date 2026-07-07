<script lang="ts">
	// SDK CallLoop — the Call invocation strip (design D3): a synchronous method call on a
	// (possibly cached) interface, invoked once or **looped** on a live cadence (cycle
	// counter, Pause/Stop). The generic read path for result accessors — the result is
	// opaque JSON handed to onResult (rendered by the host's result slot or the raw
	// fallback). Pure over WidgetHostAdapter; no host/captu imports.
	import type { Version, WidgetHostAdapter } from './types';

	let {
		adapter,
		module,
		version,
		method = '',
		args = {},
		cadenceMs = 2000,
		disabled = false,
		onResult,
		onLoop
	}: {
		adapter: WidgetHostAdapter;
		module: string;
		version: Version;
		/** Method (result accessor) to invoke — the interface's vocabulary. */
		method?: string;
		args?: Record<string, unknown>;
		cadenceMs?: number;
		disabled?: boolean;
		/** Every call result (raw JSON) — feeds the result view. */
		onResult?: (result: unknown, meta: { cycle: number; method: string }) => void;
		/** Loop liveness — lets the host show RUNNING-LOOPED while active. */
		onLoop?: (active: boolean) => void;
	} = $props();

	let m = $state(method); // local editable copy; `method` is only the initial value
	let looping = $state(false);
	let paused = $state(false);
	let cycle = $state(0);
	let busy = $state(false);
	let error = $state('');
	let menuOpen = $state(false);
	/** Viewport-fixed menu anchor (from the caret) — a fixed menu never extends
	 * the scrollable pane, so opening it cannot pop a scrollbar in. */
	let menuPos = $state({ top: 0, right: 0 });
	/** The active loop cadence (ms) — set by the split-button menu. */
	let cadence = $state(cadenceMs);

	function toggleMenu(e: MouseEvent) {
		if (!menuOpen) {
			const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
			menuPos = { top: rect.bottom + 4, right: window.innerWidth - rect.right };
		}
		menuOpen = !menuOpen;
	}

	async function invoke() {
		if (!m.trim() || busy) return;
		busy = true;
		error = '';
		try {
			const r = await adapter.call(module, m.trim(), args, version);
			cycle += 1;
			onResult?.(r, { cycle, method: m.trim() });
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
			stop(); // a failing loop should not keep firing
		} finally {
			busy = false;
		}
	}

	let timer: ReturnType<typeof setInterval> | null = null;
	function startLoop(ms: number) {
		if (!m.trim()) return;
		cadence = ms;
		looping = true;
		paused = false;
		cycle = 0;
		onLoop?.(true);
		void invoke();
		timer = setInterval(() => {
			if (!paused) void invoke();
		}, ms);
	}
	function stop() {
		if (timer) clearInterval(timer);
		timer = null;
		looping = false;
		paused = false;
		onLoop?.(false);
	}
	$effect(() => () => {
		if (timer) clearInterval(timer);
		if (looping) onLoop?.(false);
	});
</script>

<div class="call">
	<div class="chead">
		<span class="cap mono">CALL{looping ? ' · looped' : ''}</span>
		<span class="hint">{looping ? 're-invokes live during a session' : 'invoke a result accessor'}</span>
	</div>
	<div class="crow">
		{#if looping}
			<span class="cyc mono"><span class="dot" class:paused></span>cycle {cycle}</span>
			<span class="cad mono">every {(cadence / 1000).toFixed(0)}s</span>
			<span class="spacer"></span>
			<button class="btn" onclick={() => (paused = !paused)}>{paused ? 'Resume' : 'Pause'}</button>
			<button class="btn" onclick={stop}>Stop</button>
		{:else}
			<input
				class="minput mono"
				placeholder="method — e.g. units"
				bind:value={m}
				{disabled}
				onkeydown={(e) => e.key === 'Enter' && invoke()}
			/>
			<span class="split">
				<button
					class="btn main"
					title="invoke once"
					onclick={invoke}
					disabled={disabled || busy || !m.trim()}
				>
					{busy ? '…' : 'Call'}
				</button>
				<button
					class="btn caret"
					title="call options"
					aria-label="call options"
					onclick={toggleMenu}
					disabled={disabled || !m.trim()}>▾</button
				>
				{#if menuOpen}
					<div class="menu" style="top: {menuPos.top}px; right: {menuPos.right}px">
						<button
							class="mopt mono"
							onclick={() => {
								menuOpen = false;
								void invoke();
							}}>Call</button
						>
						<button
							class="mopt mono"
							onclick={() => {
								menuOpen = false;
								startLoop(2000);
							}}>Call every 2s</button
						>
						<button
							class="mopt mono"
							onclick={() => {
								menuOpen = false;
								startLoop(5000);
							}}>Call every 5s</button
						>
					</div>
				{/if}
			</span>
		{/if}
	</div>
	{#if error}<div class="cerr mono">{error}</div>{/if}
</div>

<style>
	.call {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 10px 12px;
		border-radius: 9px;
		background: var(--c-paper-sunken, #f1ecdf);
		border: 1px solid var(--c-hairline, #dcd5c6);
	}
	.chead {
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
		font-size: 11px;
		color: var(--c-ink-soft, #6f6759);
	}
	.crow {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.cyc {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: var(--c-ink, #2b2721);
	}
	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--c-live, #2f9e6f);
		animation: cl-pulse 1s ease-in-out infinite;
	}
	.dot.paused {
		background: var(--c-ink-faint, #a69d8d);
		animation: none;
	}
	@keyframes cl-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.35;
		}
	}
	.cad {
		font-size: 12px;
		color: var(--c-ink-faint, #8f8677);
	}
	.spacer {
		flex: 1;
	}
	.minput {
		flex: 1;
		min-width: 0;
		font: inherit;
		font-size: 11.5px;
		padding: 5px 9px;
		border-radius: 7px;
		border: 1px solid var(--c-hairline-strong, #cfc6b3);
		background: var(--c-paper-raised, #fff);
		color: var(--c-ink, #2c2823);
	}
	.btn {
		border: 1px solid var(--c-hairline-strong, #cfc6b3);
		background: var(--c-paper-raised, #fff);
		font: inherit;
		font-size: 12px;
		color: var(--c-ink-soft, #6f6759);
		padding: 5px 12px;
		border-radius: 7px;
		cursor: pointer;
		white-space: nowrap;
	}
	.btn:disabled {
		opacity: 0.5;
	}

	/* split button: [Call][▾] with the cadence menu */
	.split {
		position: relative;
		display: inline-flex;
	}
	.btn.main {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		border-right: none;
	}
	.btn.caret {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		padding: 5px 7px;
		font-size: 10px;
	}
	.menu {
		position: fixed;
		z-index: 20;
		display: flex;
		flex-direction: column;
		min-width: 130px;
		background: var(--c-paper-raised, #fff);
		border: 1px solid var(--c-hairline-strong, #cfc6b3);
		border-radius: 8px;
		box-shadow: 0 6px 18px color-mix(in srgb, var(--c-ink, #2c2823) 14%, transparent);
		padding: 4px;
	}
	.mopt {
		border: none;
		background: none;
		font: inherit;
		font-size: 11.5px;
		color: var(--c-ink, #2c2823);
		text-align: left;
		padding: 6px 9px;
		border-radius: 6px;
		cursor: pointer;
		white-space: nowrap;
	}
	.mopt:hover {
		background: var(--c-paper-sunken, #ece6d8);
	}
	.cerr {
		font-size: 10.5px;
		color: var(--c-record, #cf5252);
	}
</style>
