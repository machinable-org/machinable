<script lang="ts">
	// SDK CodeView — the read-only code inspection surface (design D6a): a CodeMirror 6
	// viewer on field-dark with line numbers + syntax highlighting, and a symbol map
	// (Config · __call__ · ~tokens · accessors · """doc) scanned from the source for
	// jump-to-symbol. Read is the default tier; the edit/hot-reload tier (D6b) is a later,
	// token-gated addition. CodeMirror is loaded lazily on first mount so SDK consumers
	// that never open code don't pay for it. Pure over WidgetHostAdapter; no captu imports.
	import type { SourceContent, WidgetHostAdapter } from './types';

	let {
		adapter,
		path,
		line
	}: {
		adapter: WidgetHostAdapter;
		/** Project-relative source path to display. */
		path: string;
		/** 1-based line to reveal on open (e.g. a ~token's def). */
		line?: number;
	} = $props();

	let content = $state<SourceContent | null>(null);
	let error = $state('');
	let editorEl = $state<HTMLDivElement | null>(null);
	// The CM EditorView, created lazily — typed loosely to keep the import dynamic.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let view: any = null;

	// ── symbol map — scanned from the source text (works for any interface) ──────
	type Sym = { label: string; line: number };
	function scanSymbols(src: string): Sym[] {
		const out: Sym[] = [];
		const lines = src.split('\n');
		if (/^\s*(?:'''|""")/.test(lines[0] ?? '')) out.push({ label: '"""doc', line: 1 });
		lines.forEach((l, i) => {
			const cls = l.match(/^\s*class\s+(\w+)/);
			if (cls) {
				out.push({ label: cls[1], line: i + 1 });
				return;
			}
			const def = l.match(/^\s*def\s+(\w+)/);
			if (!def) return;
			const name = def[1];
			if (name === '__call__') out.push({ label: '__call__', line: i + 1 });
			else if (name.startsWith('version_'))
				out.push({ label: `~${name.slice('version_'.length)}`, line: i + 1 });
			else if (!name.startsWith('__')) out.push({ label: `${name}()`, line: i + 1 });
		});
		return out;
	}
	const symbols = $derived(content ? scanSymbols(content.content) : []);
	let activeLine = $state<number | null>(null);

	// ── load source on path change ────────────────────────────────────────────────
	$effect(() => {
		path;
		content = null;
		error = '';
		if (!adapter.readSource) {
			error = 'this host has no source API';
			return;
		}
		let cancelled = false;
		void adapter
			.readSource(path)
			.then((c) => {
				if (!cancelled) content = c;
			})
			.catch((e) => {
				if (!cancelled) error = e instanceof Error ? e.message : String(e);
			});
		return () => (cancelled = true);
	});

	// ── mount CodeMirror when content + element are ready ────────────────────────
	$effect(() => {
		const el = editorEl;
		const c = content;
		if (!el || !c) return;
		let cancelled = false;
		void (async () => {
			const [viewMod, stateMod, langMod, lezer] = await Promise.all([
				import('@codemirror/view'),
				import('@codemirror/state'),
				import('@codemirror/language'),
				import('@lezer/highlight')
			]);
			if (cancelled) return;
			const { EditorView, lineNumbers, highlightActiveLine } = viewMod;
			const { EditorState } = stateMod;
			const { syntaxHighlighting, HighlightStyle } = langMod;
			const { tags: t } = lezer;
			const language =
				c.language === 'javascript'
					? (await import('@codemirror/lang-javascript')).javascript()
					: (await import('@codemirror/lang-python')).python();
			if (cancelled) return;

			// field-dark theme, matching the design canvas's code colors. `height: 100%` +
			// a scrolling .cm-scroller make the editor fill whatever height the tab gives it.
			const theme = EditorView.theme(
				{
					'&': { backgroundColor: 'transparent', fontSize: '11.5px', height: '100%' },
					'.cm-scroller': { overflow: 'auto' },
					'.cm-content': {
						fontFamily: 'var(--font-mono, ui-monospace, monospace)',
						lineHeight: '1.7',
						caretColor: 'transparent'
					},
					'.cm-gutters': {
						backgroundColor: 'transparent',
						color: '#4f4a3f',
						border: 'none'
					},
					'.cm-activeLine': { backgroundColor: 'rgba(139, 160, 240, 0.07)' },
					'.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#8f8677' },
					'&.cm-focused': { outline: 'none' }
				},
				{ dark: true }
			);
			const highlight = HighlightStyle.define([
				{ tag: [t.keyword, t.controlKeyword, t.definitionKeyword], color: '#c2569b' },
				{ tag: [t.string, t.special(t.string)], color: '#7fc9a6' },
				{ tag: [t.number, t.bool, t.null], color: '#e0a06a' },
				{ tag: [t.function(t.variableName), t.function(t.definition(t.variableName))], color: '#8ba0f0' },
				{ tag: [t.definition(t.variableName), t.className], color: '#8ba0f0' },
				{ tag: [t.comment, t.docString], color: '#8f8677', fontStyle: 'italic' },
				{ tag: [t.propertyName, t.attributeName], color: '#c9c0af' },
				{ tag: t.self, color: '#c2a3d6' }
			]);

			view?.destroy();
			view = new EditorView({
				state: EditorState.create({
					doc: c.content,
					extensions: [
						lineNumbers(),
						highlightActiveLine(),
						language,
						theme,
						syntaxHighlighting(highlight),
						EditorState.readOnly.of(true),
						EditorView.editable.of(false),
						EditorView.lineWrapping
					]
				}),
				parent: el
			});
			if (line) jump(line);
		})();
		return () => {
			cancelled = true;
			view?.destroy();
			view = null;
		};
	});

	function jump(lineNo: number) {
		if (!view) return;
		const doc = view.state.doc;
		const ln = Math.max(1, Math.min(lineNo, doc.lines));
		const pos = doc.line(ln).from;
		view.dispatch({
			selection: { anchor: pos },
			effects: view.constructor.scrollIntoView
				? view.constructor.scrollIntoView(pos, { y: 'start', yMargin: 8 })
				: undefined,
			scrollIntoView: true
		});
		activeLine = ln;
	}
</script>

<div class="code">
	<div class="chead">
		<span class="mark mono">&lt;/&gt; Code</span>
		<span class="path mono">{path}</span>
		<span class="spacer"></span>
		<span class="rotag mono">read-only</span>
	</div>

	{#if symbols.length}
		<div class="syms">
			{#each symbols as s (s.label + s.line)}
				<button class="sym mono" class:on={activeLine === s.line} onclick={() => jump(s.line)}>
					{s.label}
				</button>
			{/each}
		</div>
	{/if}

	{#if error}
		<div class="cerr mono">{error}</div>
		<div class="chint">
			The source API may be disabled or token-gated on this server (enable_source_api).
		</div>
	{:else if !content}
		<div class="cload mono">loading source…</div>
	{:else}
		<div class="editor" bind:this={editorEl}></div>
	{/if}
</div>

<style>
	.code {
		display: flex;
		flex-direction: column;
		gap: 8px;
		background: var(--c-field, #211e18);
		border: 1px solid var(--c-field-grid, #3a3529);
		border-radius: 11px;
		padding: 10px 12px;
		/* fill whatever height the host tab gives (the editor scrolls internally) */
		flex: 1;
		min-height: 180px;
	}
	.chead {
		display: flex;
		align-items: center;
		gap: 9px;
	}
	.mark {
		font-size: 12px;
		font-weight: 600;
		color: var(--c-field-ink, #e8e2d4);
	}
	.path {
		font-size: 11px;
		color: #8f8677;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.spacer {
		flex: 1;
	}
	.rotag {
		font-size: 10px;
		color: #8f8677;
		background: color-mix(in srgb, #8f8677 20%, transparent);
		padding: 2px 8px;
		border-radius: 20px;
		white-space: nowrap;
	}
	.syms {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}
	.sym {
		border: none;
		background: color-mix(in srgb, #8f8677 16%, transparent);
		font-size: 10.5px;
		color: #c9c0af;
		padding: 3px 9px;
		border-radius: 6px;
		cursor: pointer;
	}
	.sym:hover {
		color: var(--c-field-ink, #e8e2d4);
	}
	.sym.on {
		background: color-mix(in srgb, #5b6ee0 25%, transparent);
		color: #8ba0f0;
	}
	.editor {
		flex: 1;
		min-height: 0;
		overflow: hidden; /* the .cm-scroller scrolls — avoid a double scrollbar */
	}
	.cload,
	.cerr {
		font-size: 11px;
		color: #c9c0af;
	}
	.cerr {
		color: #e88;
	}
	.chint {
		font-size: 10.5px;
		color: #8f8677;
		line-height: 1.5;
	}
</style>
