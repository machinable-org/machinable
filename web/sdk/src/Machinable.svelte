<script lang="ts">
	// SDK Machinable — the interface-widget shell (design D7, IA revised): after connect the
	// widget lands on the **ListView** (the run browser, with "New" as the first entry);
	// opening an entry (or New) pushes the **ItemView** for one interface — a back arrow
	// returns to the list, and the panels (Config · Context · Result · Provenance · Code)
	// are the ItemView's tabs, so no single scroll gets overcrowded. The ResolvedBar (CLI +
	// identity + Launch) and the RunBanner stay pinned across tabs. First-run shows the
	// connect panel with the two-tier trust gate (Trust & connect vs Read-only — reading
	// never runs server widget code; loading its widgets does). Pure over WidgetHostAdapter.
	// The host reacts to `onCached(module, version)` to offer downstream consumers.
	import type {
		WidgetHostAdapter,
		InterfaceStatus,
		Ref,
		ResolveIssue,
		RunRecord,
		SourceRef,
		Version,
		ModuleSchema
	} from './types';
	import type { BadgeVariant } from './StatusBadge.svelte';
	import type { ChainElement } from './ContextStack.svelte';
	import ConfigPicker from './ConfigPicker.svelte';
	import ContextStack from './ContextStack.svelte';
	import Lifecycle from './Lifecycle.svelte';
	import Provenance from './Provenance.svelte';
	import Browser from './Browser.svelte';
	import ResolvedBar from './ResolvedBar.svelte';
	import CliView from './CliView.svelte';
	import RunBanner from './RunBanner.svelte';
	import RunPanel from './RunPanel.svelte';
	import CallLoop from './CallLoop.svelte';
	import ResultSlot from './ResultSlot.svelte';
	import CodeView from './CodeView.svelte';

	let {
		adapter,
		defaultUrl = 'http://127.0.0.1:8000',
		autoConnect = false,
		initialView = null,
		initialTarget = '',
		initialVersion = [],
		onCached,
		onStatus,
		onConnect,
		onError
	}: {
		adapter: WidgetHostAdapter;
		defaultUrl?: string;
		/** Connect immediately (no connect panel) — the notebook/embedded mode. */
		autoConnect?: boolean;
		/** Where to land after an auto-connect: the run browser or one interface. */
		initialView?: 'list' | 'item' | null;
		/** The interface to open when `initialView` is `item`. */
		initialTarget?: string;
		initialVersion?: Version;
		onCached?: (module: string, version: Record<string, unknown>) => void;
		onStatus?: (status: InterfaceStatus) => void;
		/** Fired after a successful connect — the host can discover server-shipped widgets,
		 * etc. `readOnly` connections must NOT load/run server widget code. */
		onConnect?: (url: string, modules: string[], readOnly?: boolean) => void;
		/** Connect outcome for the host to surface (message on failure, `null` clears). */
		onError?: (message: string | null) => void;
	} = $props();

	// ── connection ──────────────────────────────────────────────────────────────
	let url = $state(defaultUrl); // editable field; `defaultUrl` is only the initial value
	let token = $state('');
	let connected = $state(false);
	let readOnly = $state(false);
	let needsTrust = $state(false);
	let modules = $state<string[]>([]);
	/** Module display metadata (kind, docstring) for the picker, when available. */
	let moduleInfos = $state<{ module: string; kind?: string; doc?: string }[]>([]);
	let moduleFilter = $state('');
	/** Whether the server actually serves source (enable_source_api) — probed on
	 * connect; the Code tab only shows when it does. */
	let sourceAvailable = $state(false);
	let busy = $state(false);
	let lastError = $state(''); // inline diagnostic on the connect panel

	async function connect(opts?: { readOnly?: boolean }) {
		busy = true;
		lastError = '';
		onError?.(null); // clear any prior message
		try {
			const r = await adapter.connect(url, token || undefined, opts);
			needsTrust = !!r.needsTrust;
			if (r.needsTrust) return; // the trust card takes over
			connected = r.connected;
			readOnly = !!r.readOnly;
			modules = r.modules ?? [];
			if (connected) {
				console.info('[machinable] connected', url, `${modules.length} module(s)`, readOnly ? '(read-only)' : '');
				moduleInfos = modules.map((m) => ({ module: m }));
				void adapter.listModules?.().then((infos) => {
					if (infos?.length) moduleInfos = infos;
				});
				sourceAvailable = false;
				void adapter
					.listSource?.()
					.then(() => (sourceAvailable = true))
					.catch(() => {}); // disabled server-side — the Code tab stays hidden
				onConnect?.(url, modules, readOnly);
			} else {
				// Surface the real reason from the probe (health error / HTTP status / refused).
				lastError = r.message ?? 'could not connect (no detail)';
				console.warn('[machinable] connect failed —', url, lastError);
				onError?.(`${url}: ${lastError}`);
			}
		} catch (e) {
			lastError = e instanceof Error ? e.message : String(e);
			console.error('[machinable] connect threw —', url, e);
			onError?.(`${url}: ${lastError}`);
		} finally {
			busy = false;
		}
	}
	async function trustAndConnect() {
		await adapter.trust(url);
		needsTrust = false;
		await connect();
	}

	// Embedded/notebook mode: connect straight away and land on the requested
	// view — `.widget()` on an Interface opens its ItemView, on a collection
	// the ListView — no connect panel in between. One attempt only: a failed
	// connect falls back to the panel (with the reason) instead of retry-looping.
	let autoTried = false;
	$effect(() => {
		if (!autoConnect || autoTried) return;
		autoTried = true;
		void connect().then(() => {
			if (!connected) return;
			if (initialView === 'item' && initialTarget) {
				pick(initialTarget, initialVersion);
				view = 'item';
			} else {
				view = 'list';
			}
		});
	});

	const serverLabel = $derived(url.replace(/^https?:\/\//, ''));

	// ── navigation: ListView (browser + New) ⇄ ItemView (one interface, tabbed) ────
	type Tab = 'config' | 'context' | 'result' | 'execution' | 'cli' | 'provenance' | 'code';
	let view = $state<'list' | 'item'>('list');
	let tab = $state<Tab>('config');

	function openNew() {
		pick('');
		view = 'item';
	}
	function openRun(run: RunRecord) {
		pick(run.module, run.version ?? [run.config]);
		view = 'item';
	}
	function back() {
		view = 'list';
	}
	function openTab(t: Tab) {
		tab = t;
		if (t === 'code' && !codePath) void resolveDefaultCodePath();
	}

	// ── configure / dispatch ──────────────────────────────────────────────────────
	let target = $state('');
	/** The composed compact version — the run's identity (override dict ⊕ ~tokens). */
	let version = $state<Version>([]);
	/** Initial version handed to ConfigPicker on (re)pick — e.g. a reconstructed run. */
	let seedVersion = $state<Version>([]);
	/** The resolved config of the current version (from the ResolvedBar's dry-run). */
	let resolvedConfig = $state<Record<string, unknown>>({});
	/** The canonical reproduction CLI of the current version (the CLI tab). */
	let resolvedCli = $state('');
	/** Short content-identity hash of the current version (the RunBanner's #chip). */
	let resolvedIdentity = $state('');
	let resolveOk = $state(true);
	let issues = $state<ResolveIssue[]>([]);
	let ctxOpts = $state<{
		context: Ref[];
		execution?: Ref;
		executionRef?: string;
		chain: ChainElement[];
	}>({ context: [], chain: [] });
	/** The hovered with-layer (CLI span ↔ layer hover-map). */
	let hoverLayerId = $state<string | null>(null);
	let leafStatus = $state<InterfaceStatus>('draft');
	/** The latest backing run instance (from find/dispatch) — the run panel's ref. */
	let leafRunRef = $state<string | null>(null);
	/** Whether this session actually dispatched — distinguishes CACHED-REUSE from CACHED. */
	let ranHere = $state(false);
	/** A cached target freezes its recipe (editing would change identity — design D2);
	 * "Fork as new draft" lifts the lock for deliberate iteration. */
	let forked = $state(false);
	/** The in-flight run (from Lifecycle's dispatch) — drives the RunBanner. */
	let runInfo = $state<{ executionRef: string; startedAt: number } | null>(null);
	/** The last read result (opaque JSON, from the Call strip) — shown in the ResultSlot. */
	let callResult = $state<unknown>(null);
	/** A Call loop is live — the RUNNING-LOOPED badge. */
	let looping = $state(false);
	/** Total runs (from the Browser) — the "N runs" header chip on the list. */
	let runTotal = $state<number | null>(null);
	let prev: InterfaceStatus | null = null;

	function pick(module: string, initial: Version = []) {
		target = module;
		seedVersion = initial;
		version = initial;
		leafStatus = 'draft';
		leafRunRef = null;
		ranHere = false;
		forked = false;
		runInfo = null;
		callResult = null;
		looping = false;
		prev = null;
		tab = 'config';
		codePath = null;
		codeLine = undefined;
		codeMissing = false;
	}
	function onLifecycle(s: InterfaceStatus, runRef?: string) {
		leafStatus = s;
		if (runRef) leafRunRef = runRef;
		if (s === 'running') ranHere = true;
		else runInfo = null; // the run ended (or never was) — drop the banner
		onStatus?.(s);
		if (prev === 'running' && s === 'cached') {
			onCached?.(target, resolvedConfig);
			tab = 'result'; // the run this session just completed — land on its payoff
		}
		if (s === 'cached' && prev === null) onCached?.(target, resolvedConfig); // reopened cached
		prev = s;
	}

	const reused = $derived(leafStatus === 'cached' && !ranHere);
	/** Cached ⇒ the recipe is frozen read-only until forked (design D2 locked state). */
	const locked = $derived(leafStatus === 'cached' && !forked);
	const editDisabled = $derived(leafStatus === 'running' || locked);
	const badge = $derived.by((): BadgeVariant | null => {
		if (!connected || !target || view !== 'item') return null;
		if (looping) return 'running-looped';
		if (reused) return 'cached-reuse';
		return leafStatus === 'interrupted' ? 'interrupted' : leafStatus;
	});
	/** Where the Job runs — the Execution layer's title, or the default. */
	const executionLabel = $derived(
		ctxOpts.chain.find((el) => el.id === ctxOpts.executionRef)?.title ?? 'default execution'
	);

	// ── the Code tab's target file ──────────────────────────────────────────────
	/** Defaults to the target's declared source; a `</> def` jump (onViewSource)
	 * retargets it to the symbol's file + line. */
	let codePath = $state<string | null>(null);
	let codeLine = $state<number | undefined>(undefined);
	let codeMissing = $state(false);

	async function resolveDefaultCodePath() {
		codeMissing = false;
		try {
			const schema: ModuleSchema = await adapter.introspect(target);
			codePath = schema.sourceRef?.path ?? null;
			codeMissing = !codePath;
		} catch {
			codeMissing = true;
		}
	}
	function viewSource(ref: SourceRef) {
		codePath = ref.path;
		codeLine = ref.line;
		codeMissing = false;
		tab = 'code';
	}

	// Stable handlers (not inline template arrows) — child $effects that read callback
	// props must not see a fresh identity on every parent re-render.
	function onCtxChange(o: typeof ctxOpts) {
		ctxOpts = o;
	}
	function onHover(id: string | null) {
		hoverLayerId = id;
	}
	function onResolvedResult(r: import('./types').ResolveResult) {
		resolveOk = r.ok;
		issues = r.ok ? [] : r.issues;
		if (r.ok) {
			resolvedConfig = r.config;
			resolvedIdentity = r.identity ?? '';
			resolvedCli = r.cli;
		} else {
			resolvedCli = '';
		}
	}
	function onPickerVersion(v: Version) {
		version = v;
	}
	function onRunStart(run: { executionRef: string; startedAt: number }) {
		runInfo = run;
	}
	function onCallResult(r: unknown) {
		callResult = r;
	}
	function onLoopState(active: boolean) {
		looping = active;
	}
	function onListTotal(n: number) {
		runTotal = n;
	}
	function interruptRun() {
		if (runInfo) void adapter.interrupt(runInfo.executionRef);
	}

	const TABS: { id: Tab; label: string }[] = [
		{ id: 'config', label: 'Config' },
		{ id: 'context', label: 'Context' },
		{ id: 'result', label: 'Result' },
		{ id: 'execution', label: 'Execution' },
		{ id: 'cli', label: 'CLI' },
		{ id: 'provenance', label: 'Provenance' },
		{ id: 'code', label: '</> Code' }
	];
	const visibleTabs = $derived(
		TABS.filter((t) => t.id !== 'code' || (!!adapter.readSource && sourceAvailable))
	);
</script>

<div class="mach">
	<!-- ── pinned header ─────────────────────────────────────────────────────── -->
	<div class="head">
		<div class="hrow">
			{#if connected && view === 'item'}
				<button class="back" title="back to runs" onclick={back}>‹</button>
			{/if}
			<span
				class="dot"
				class:on={connected}
				class:run={connected && (leafStatus === 'running')}
			></span>
			{#if connected}
				<span class="server mono" title={url}>{serverLabel}</span>
				{#if view === 'item' && target}<span class="target mono">{target}</span>{/if}
			{:else}
				<span class="server mono">not connected</span>
			{/if}
			<span class="spacer"></span>
			{#if readOnly && connected}
				<span class="ro mono" title="Read-only — server widgets are not loaded">read-only</span>
			{/if}
			{#if needsTrust && !connected}
				<span class="needs mono">NEEDS TRUST</span>
			{:else if connected && view === 'list' && runTotal !== null}
				<span class="ro mono">{runTotal} run{runTotal === 1 ? '' : 's'}</span>
			{/if}
		</div>
		{#if connected && view === 'item' && target}
			<!-- the action bar: the one status badge + identity + Launch, above the tabs -->
			<ResolvedBar {adapter} module={target} {version} {badge} onResolved={onResolvedResult}>
				<Lifecycle
					{adapter}
					module={target}
					{version}
					context={ctxOpts.context}
					execution={ctxOpts.execution}
					executionRef={ctxOpts.executionRef}
					compact
					disabled={!resolveOk}
					launchLabel="Launch"
					onStatus={onLifecycle}
					onRun={onRunStart}
				/>
			</ResolvedBar>
			<div class="hrow tabs">
				{#each visibleTabs as t (t.id)}
					<button class="tab mono-if-code" class:on={tab === t.id} onclick={() => openTab(t.id)}>
						{t.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- ── scroll body ───────────────────────────────────────────────────────── -->
	<div class="body">
		{#if !connected}
			<div class="connect">
				<input
					class="cinput mono"
					bind:value={url}
					placeholder="server url, e.g. http://127.0.0.1:8000"
					disabled={busy}
					aria-label="server url"
				/>
				<input
					class="cinput mono"
					type="password"
					bind:value={token}
					placeholder="token · optional"
					disabled={busy}
					aria-label="token"
				/>

				{#if needsTrust}
					<div class="trust">
						<div class="trow">
							<span class="bang">!</span>
							<span class="tq">Trust this server?</span>
						</div>
						<p class="tp">
							Its widgets run <strong>as code in your session</strong>. Only trust servers you
							control. Read-only inspection stays available either way.
						</p>
						<div class="tbtns">
							<button class="go fill" onclick={trustAndConnect} disabled={busy}>
								Trust &amp; connect
							</button>
							<button class="go" onclick={() => connect({ readOnly: true })} disabled={busy}>
								Read-only
							</button>
						</div>
					</div>
				{:else}
					<button class="go fill" onclick={() => connect()} disabled={busy}>
						{busy ? 'connecting…' : 'Connect'}
					</button>
				{/if}

				{#if lastError}
					<div class="err mono">{lastError}</div>
					<button class="retry mono" onclick={() => connect()}>retry · check URL ▸</button>
				{/if}
			</div>
		{:else if view === 'list'}
			<!-- ── ListView: the run browser, with New as the first entry ── -->
			<Browser {adapter} onNew={openNew} onOpen={openRun} onTotal={onListTotal} />
		{:else}
			<!-- ── ItemView: one interface, tabbed panels ── -->
			{#if !target}
				<!-- searchable module picker (kind + docstring per row) -->
				<!-- svelte-ignore a11y_autofocus -->
				<input
					class="mfilter mono"
					bind:value={moduleFilter}
					placeholder="find an interface…"
					aria-label="find an interface"
					autofocus
				/>
				<div class="mlist">
					{#each moduleInfos.filter((m) => !moduleFilter || m.module
									.toLowerCase()
									.includes(moduleFilter.toLowerCase())) as m (m.module)}
						<button class="mpick" onclick={() => pick(m.module)}>
							<span class="mpname mono">{m.module}</span>
							{#if m.kind && m.kind !== 'Interface'}<span class="mpkind mono">{m.kind}</span>{/if}
							{#if m.doc}<span class="mpdoc">{m.doc.split('\n')[0]}</span>{/if}
						</button>
					{:else}
						<div class="mpempty mono">no modules match</div>
					{/each}
				</div>
			{:else}
				{#if leafStatus === 'running' && runInfo}
					<RunBanner
						{executionLabel}
						identity={resolvedIdentity}
						startedAt={runInfo.startedAt}
						onInterrupt={interruptRun}
					/>
				{/if}

				<!-- Config + Context + Result stay MOUNTED when their tab is inactive
				     (hidden via CSS): they hold live state — field edits, the with-stack
				     layers, a running Call loop. Provenance/Code load on demand. -->
				<div class="pane" class:off={tab !== 'config'}>
					{#if locked}
						<div class="lockbar">
							<span class="lockmsg mono">🔒 cached · read-only</span>
							<button class="fork mono" onclick={() => (forked = true)}>Fork as new draft ▸</button>
						</div>
					{/if}
					<ConfigPicker
						{adapter}
						module={target}
						version={seedVersion}
						{issues}
						disabled={editDisabled}
						onVersion={onPickerVersion}
						onViewSource={viewSource}
					/>
				</div>

				<div class="pane" class:off={tab !== 'context'}>
					{#if locked}
						<div class="lockbar">
							<span class="lockmsg mono">🔒 cached · read-only</span>
							<button class="fork mono" onclick={() => (forked = true)}>Fork as new draft ▸</button>
						</div>
					{/if}
					<ContextStack
						{adapter}
						{modules}
						project={serverLabel}
						disabled={editDisabled}
						highlightId={hoverLayerId}
						onHighlight={onHover}
						onChange={onCtxChange}
						onViewSource={viewSource}
					/>
				</div>

				<div class="pane fill" class:off={tab !== 'result'}>
					<!-- the slot only mounts when there is something to show: a host
					     result view, or a payload read through Call -->
					{#if adapter.slots?.result || callResult !== null}
						<ResultSlot
							{adapter}
							module={target}
							{version}
							result={callResult}
							waiting={leafStatus === 'running'}
						/>
					{/if}
					{#if leafStatus === 'cached'}
						<CallLoop
							{adapter}
							module={target}
							{version}
							onResult={onCallResult}
							onLoop={onLoopState}
						/>
					{:else}
						<div class="resulthint mono">
							{leafStatus === 'running' ? 'running…' : 'no result yet — launch first'}
						</div>
					{/if}
				</div>

				<!-- Execution stays MOUNTED (hidden via CSS) so the run panel keeps
				     following output while another tab is active -->
				<div class="pane" class:off={tab !== 'execution'}>
					{#if leafRunRef}
						<RunPanel {adapter} executionRef={leafRunRef} status={leafStatus} />
					{:else}
						<div class="resulthint mono">no run yet</div>
					{/if}
				</div>

				<div class="pane" class:off={tab !== 'cli'}>
					<CliView
						cli={resolvedCli}
						module={target}
						chain={ctxOpts.chain}
						highlightId={hoverLayerId}
						onHighlight={onHover}
					/>
				</div>

				{#if tab === 'provenance'}
					<Provenance {adapter} module={target} {version} onViewSource={viewSource} />
				{/if}

				{#if tab === 'code'}
					{#if codePath}
						<CodeView {adapter} path={codePath} line={codeLine} />
					{:else if codeMissing}
						<div class="panel"><span class="nomod mono">no source declared for this module</span></div>
					{:else}
						<div class="panel"><span class="nomod mono">resolving source…</span></div>
					{/if}
				{/if}
			{/if}
		{/if}
	</div>

</div>

<style>
	.mach {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
		font-size: var(--fs-sm, 13px);
	}

	/* ── pinned header ── */
	.head {
		flex: none;
		border-bottom: 1px solid var(--c-hairline, #e4e1db);
		background: var(--c-paper-raised, #fbf8f1);
	}
	.hrow {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 10px 14px;
	}
	.hrow.tabs {
		padding: 0 10px;
		gap: 2px;
	}
	.back {
		border: none;
		background: none;
		font-size: 17px;
		line-height: 1;
		color: var(--c-ink-soft, #6b6760);
		cursor: pointer;
		padding: 0 4px 2px 0;
		margin-left: -4px;
	}
	.back:hover {
		color: var(--c-ink, #2c2823);
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--c-ink-faint, #a69d8d);
		flex: none;
	}
	.dot.on {
		background: var(--c-live, #2f9e6f);
	}
	.dot.run {
		background: var(--c-model, #5b6ee0);
		animation: dot-pulse 1.4s ease-in-out infinite;
	}
	@keyframes dot-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}
	.server {
		font-size: 12px;
		color: var(--c-ink-soft, #6b6760);
	}
	.target {
		font-size: 13px;
		font-weight: 500;
		color: var(--c-ink, #2c2823);
	}
	.spacer {
		flex: 1;
	}
	.ro {
		font-size: 10px;
		color: var(--c-ink-soft, #6b6760);
		background: var(--c-paper-sunken, #ece6d8);
		padding: 2px 8px;
		border-radius: 20px;
	}
	.needs {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.05em;
		color: var(--c-record, #cf5252);
		background: color-mix(in srgb, var(--c-record, #cf5252) 10%, transparent);
		padding: 3px 9px;
		border-radius: 20px;
	}
	.tab {
		border: none;
		background: none;
		font: inherit;
		font-size: 12.5px;
		color: var(--c-ink-faint, #8f8677);
		padding: 8px 10px;
		margin-bottom: -1px;
		border-bottom: 2px solid transparent;
		cursor: pointer;
		white-space: nowrap;
	}
	.tab.on {
		font-weight: 600;
		color: var(--c-ink, #2c2823);
		border-bottom-color: var(--c-ink, #2c2823);
	}

	/* ── body ── */
	.body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: var(--sp-2, 8px);
		padding: var(--sp-3, 12px) 14px;
	}
	.pane {
		display: flex;
		flex-direction: column;
		gap: var(--sp-2, 8px);
	}
	/* the Result pane stretches — its slot fills the remaining tile height */
	.pane.fill {
		flex: 1;
		min-height: 0;
	}
	.pane.fill :global(.slot) {
		flex: 1;
		min-height: 0;
	}
	.pane.off {
		display: none;
	}
	.resulthint {
		font-size: 10.5px;
		color: var(--c-ink-faint, #a69d8d);
		text-align: center;
		padding: 4px 0;
	}

	/* ── connect panel ── */
	.connect {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding-top: 8px;
	}
	.cinput {
		font: inherit;
		font-size: 13px;
		height: 38px;
		padding: 0 12px;
		border: 1px solid var(--c-hairline-strong, #cfc6b3);
		border-radius: 9px;
		background: var(--c-paper-raised, #fff);
		color: var(--c-ink, #2c2823);
	}
	.cinput:disabled {
		opacity: 0.55;
	}

	.trust {
		background: color-mix(in srgb, var(--c-lagging, #e6a45c) 9%, var(--c-paper-raised, #fff));
		border: 1px solid color-mix(in srgb, var(--c-lagging, #e6a45c) 45%, transparent);
		border-radius: 12px;
		padding: 14px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.trow {
		display: flex;
		align-items: center;
		gap: 9px;
	}
	.bang {
		width: 22px;
		height: 22px;
		border-radius: 6px;
		background: color-mix(in srgb, var(--c-stim, #c2569b) 12%, transparent);
		color: var(--c-stim, #c2569b);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 13px;
	}
	.tq {
		font-weight: 600;
		font-size: 14px;
		color: var(--c-ink, #2c2823);
	}
	.tp {
		margin: 0;
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--c-ink-soft, #6b6760);
	}
	.tp strong {
		color: var(--c-ink, #2c2823);
	}
	.tbtns {
		display: flex;
		gap: 9px;
	}

	.go {
		font: inherit;
		font-size: 13.5px;
		font-weight: 600;
		padding: 10px 14px;
		border-radius: 9px;
		border: 1px solid var(--c-hairline-strong, #cfc6b3);
		background: transparent;
		color: var(--c-ink-soft, #6b6760);
		cursor: pointer;
	}
	.go.fill {
		flex: 1;
		background: var(--c-ink, #2c2823);
		border-color: var(--c-ink, #2c2823);
		color: var(--c-paper, #f6f2e9);
	}
	.go:disabled {
		opacity: 0.55;
	}

	.err {
		padding: var(--sp-2, 8px);
		background: color-mix(in srgb, var(--c-record, #cf5252) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--c-record, #cf5252) 55%, transparent);
		border-radius: var(--radius-sm, 6px);
		font-size: var(--fs-xs, 11px);
		color: var(--c-record, #cf5252);
		white-space: pre-wrap;
		word-break: break-word;
	}
	.retry {
		align-self: flex-start;
		border: none;
		background: none;
		padding: 0;
		font-size: 11.5px;
		color: var(--c-model, #5b6ee0);
		cursor: pointer;
	}

	/* ── module picker ── */
	.mfilter {
		font: inherit;
		font-size: 12.5px;
		height: 34px;
		padding: 0 11px;
		border: 1px solid var(--c-hairline-strong, #cfc6b3);
		border-radius: 9px;
		background: var(--c-paper-raised, #fff);
		color: var(--c-ink, #2c2823);
	}
	.mlist {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.mpick {
		display: flex;
		align-items: baseline;
		gap: 8px;
		padding: 8px 11px;
		background: var(--c-paper-raised, #fff);
		border: 1px solid var(--c-hairline, #dcd5c6);
		border-radius: 8px;
		font: inherit;
		cursor: pointer;
		text-align: left;
		min-width: 0;
	}
	.mpick:hover {
		border-color: color-mix(in srgb, var(--c-model, #5b6ee0) 45%, transparent);
	}
	.mpname {
		font-size: 12.5px;
		color: var(--c-ink, #2c2823);
		flex: none;
	}
	.mpkind {
		font-size: 9.5px;
		color: var(--c-ink-soft, #6b6760);
		background: var(--c-paper-sunken, #ece6d8);
		padding: 1px 7px;
		border-radius: 10px;
		flex: none;
	}
	.mpdoc {
		font-size: 11px;
		color: var(--c-ink-faint, #8f8677);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.mpempty {
		font-size: 11px;
		color: var(--c-ink-faint, #a69d8d);
		padding: 6px 2px;
	}

	/* ── locked recipe (design D2/states: cached freezes the recipe until forked) ── */
	.lockbar {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 7px 10px;
		border: 1px solid var(--c-hairline, #dcd5c6);
		border-radius: 8px;
		background: var(--c-paper-sunken, #ece6d8);
	}
	.lockmsg {
		font-size: 10.5px;
		color: var(--c-ink-soft, #6b6760);
	}
	.fork {
		margin-left: auto;
		border: none;
		background: none;
		font-size: 11px;
		color: var(--c-model, #5b6ee0);
		cursor: pointer;
		padding: 0;
		white-space: nowrap;
	}

	.panel {
		border: 1px solid var(--c-hairline, #e4e1db);
		border-radius: var(--radius-sm, 6px);
		padding: var(--sp-2, 8px);
		background: color-mix(in srgb, var(--c-ink, #2c2823) 2%, transparent);
	}
	.nomod {
		font-size: 10.5px;
		color: var(--c-ink-faint, #9a958c);
	}
</style>
