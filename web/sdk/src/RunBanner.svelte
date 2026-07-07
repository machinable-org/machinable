<script lang="ts">
	// SDK RunBanner — the Job running state (design D3): spinner, "dispatched to <Execution>",
	// self-ticking elapsed, an indeterminate progress bar, Interrupt, and the identity note
	// ("new variant — not a cache hit"). Purely presentational over props; the state machine
	// stays in Lifecycle. No host/captu imports.
	let {
		executionLabel = 'default execution',
		identity,
		startedAt,
		onInterrupt
	}: {
		/** Where the Job was dispatched (the Execution layer's title). */
		executionLabel?: string;
		/** Short content-identity hash (the #chip). */
		identity?: string;
		/** Dispatch time (ms) — drives the elapsed clock. */
		startedAt: number;
		onInterrupt?: () => void;
	} = $props();

	let now = $state(Date.now());
	$effect(() => {
		const t = setInterval(() => (now = Date.now()), 500);
		return () => clearInterval(t);
	});
	const elapsed = $derived.by(() => {
		const s = Math.max(0, Math.floor((now - startedAt) / 1000));
		const mm = String(Math.floor(s / 60)).padStart(2, '0');
		const ss = String(s % 60).padStart(2, '0');
		return `${mm}:${ss}`;
	});
</script>

<div class="banner">
	<div class="row">
		<span class="spinner"></span>
		<div class="what">
			<span class="title">Job · dispatched to <span class="exec mono">{executionLabel}</span></span>
			<span class="sub mono">polling · elapsed {elapsed}</span>
		</div>
		{#if onInterrupt}
			<button class="stop" onclick={onInterrupt}>Interrupt</button>
		{/if}
	</div>
	<div class="track"><span class="fill"></span></div>
	{#if identity}
		<div class="note mono">
			identity <span class="hash">#{identity}</span> · new variant — not a cache hit
		</div>
	{/if}
</div>

<style>
	.banner {
		display: flex;
		flex-direction: column;
		gap: 11px;
		padding: 12px 13px;
		border: 1px solid var(--c-hairline, #dcd5c6);
		border-radius: 10px;
		background: var(--c-paper-raised, #fbf8f1);
	}
	.row {
		display: flex;
		align-items: center;
		gap: 11px;
	}
	.spinner {
		width: 18px;
		height: 18px;
		border: 2.5px solid color-mix(in srgb, var(--c-model, #5b6ee0) 30%, transparent);
		border-top-color: var(--c-model, #5b6ee0);
		border-radius: 50%;
		animation: rb-spin 0.8s linear infinite;
		flex: none;
	}
	@keyframes rb-spin {
		to {
			transform: rotate(360deg);
		}
	}
	.what {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.title {
		font-size: 13px;
		font-weight: 600;
		color: var(--c-ink, #2b2721);
	}
	.exec {
		font-size: 12px;
		font-weight: 500;
	}
	.sub {
		font-size: 11px;
		color: var(--c-ink-faint, #8f8677);
	}
	.stop {
		margin-left: auto;
		border: 1px solid var(--c-record, #cf5252);
		color: var(--c-record, #cf5252);
		background: transparent;
		font: inherit;
		font-size: 12px;
		font-weight: 600;
		padding: 6px 12px;
		border-radius: 8px;
		cursor: pointer;
	}
	.track {
		height: 6px;
		border-radius: 6px;
		background: var(--c-paper-sunken, #ece6d8);
		overflow: hidden;
		position: relative;
	}
	.fill {
		position: absolute;
		top: 0;
		height: 100%;
		width: 40%;
		background: var(--c-model, #5b6ee0);
		border-radius: 6px;
		animation: rb-bar 1.5s ease-in-out infinite;
	}
	@keyframes rb-bar {
		0% {
			left: -40%;
		}
		100% {
			left: 100%;
		}
	}
	.note {
		font-size: 11px;
		color: var(--c-ink-faint, #a69d8d);
	}
	.note .hash {
		color: var(--c-ink-soft, #6f6759);
	}
</style>
