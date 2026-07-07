<script lang="ts">
	// SDK StatusBadge — the status vocabulary pill (design D3/D7 + the inventory panel):
	// DRAFT · RUNNING · RUNNING-LOOPED · CACHED · CACHED-REUSE ↺ · FAILED · INTERRUPTED ·
	// 🔒 LOCKED. Pure presentational; no host/captu imports.
	export type BadgeVariant =
		| 'draft'
		| 'running'
		| 'running-looped'
		| 'cached'
		| 'cached-reuse'
		| 'failed'
		| 'interrupted'
		| 'locked';

	let { variant }: { variant: BadgeVariant } = $props();

	const LABELS: Record<BadgeVariant, string> = {
		draft: 'DRAFT',
		running: 'RUNNING',
		'running-looped': 'RUNNING · LOOPED',
		cached: 'CACHED',
		'cached-reuse': 'CACHED · REUSE ↺',
		failed: 'FAILED',
		interrupted: 'INTERRUPTED',
		locked: '🔒 LOCKED'
	};
</script>

<span class="badge {variant}">
	{#if variant === 'running' || variant === 'running-looped'}<span class="pulse"></span>{/if}
	{LABELS[variant]}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.04em;
		padding: 3px 10px;
		border-radius: 20px;
		white-space: nowrap;
	}
	.pulse {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: currentColor;
		animation: badge-pulse 1.4s ease-in-out infinite;
	}
	@keyframes badge-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.35;
		}
	}
	.draft {
		color: var(--c-ink-soft, #6b6760);
		background: color-mix(in srgb, var(--c-ink, #2c2823) 10%, transparent);
	}
	.running,
	.running-looped {
		color: var(--c-model, #5b6ee0);
		background: color-mix(in srgb, var(--c-model, #5b6ee0) 12%, transparent);
	}
	.cached,
	.cached-reuse {
		color: var(--c-live, #2f9e6f);
		background: color-mix(in srgb, var(--c-live, #2f9e6f) 12%, transparent);
	}
	.failed {
		color: var(--c-record, #cf5252);
		background: color-mix(in srgb, var(--c-record, #cf5252) 12%, transparent);
	}
	.interrupted {
		color: var(--c-lagging, #a1785c);
		background: color-mix(in srgb, var(--c-lagging, #a1785c) 14%, transparent);
	}
	.locked {
		color: var(--c-ink-soft, #6b6760);
		background: var(--c-paper-sunken, #ece6d8);
	}
</style>
