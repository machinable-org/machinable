<script lang="ts">
	// SDK VersionEditor — the pop-up version composer: the compact version as an
	// ordered list of elements (override dicts and ~tokens), each movable, with a
	// typed key editor per dict (schema-driven; free keys allowed) and an arg form
	// per token. Apply emits the wire version; Cancel discards. Reused wherever a
	// version is edited (the target's Config tab, context layers incl. Execution
	// resources). Pure over the introspected schema; no host imports.
	import type { ModuleSchema, SourceRef, Version } from './types';
	import type { EditableElement } from './introspection';
	import { elementsToVersion, versionToElements } from './introspection';
	import { defaultFor, jsonEq, typeLabel } from './fields/util';
	import FieldRenderer from './fields/FieldRenderer.svelte';

	let {
		schema,
		version,
		onApply,
		onCancel,
		onViewSource
	}: {
		schema: ModuleSchema;
		/** The version being edited (wire form). */
		version: Version;
		onApply: (v: Version) => void;
		onCancel: () => void;
		onViewSource?: (ref: SourceRef) => void;
	} = $props();

	let elements = $state<EditableElement[]>(versionToElements(version));
	let open = $state<number | null>(elements.length ? 0 : null); // expanded element
	let addTokenOpen = $state(false);
	let freeKey = $state(''); // free-text key input per open dict

	const methodOf = (name: string) => schema.versionMethods.find((m) => m.name === name);
	const fieldOf = (key: string) => schema.fields.find((f) => f.key === key);

	/** Strip args that equal the method's declared defaults (compact serialization). */
	function compactArgs(name: string, args: Record<string, unknown>): Record<string, unknown> {
		const m = methodOf(name);
		return Object.fromEntries(
			Object.entries(args).filter(([k, v]) => {
				const p = m?.params.find((x) => x.name === k);
				return p === undefined || !jsonEq(v, p.default);
			})
		);
	}
	const wire = $derived(elementsToVersion(elements, compactArgs));

	function label(el: EditableElement): string {
		if (el.kind === 'token') {
			const compact = compactArgs(el.name, el.args);
			const parts = Object.entries(compact).map(
				([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`
			);
			return `~${el.name}${parts.length ? `(${parts.join(', ')})` : ''}`;
		}
		const keys = Object.keys(el.value);
		return keys.length ? `{ ${keys.join(', ')} }` : '{ }';
	}

	// ── element operations ───────────────────────────────────────────────────────
	function move(i: number, dir: 1 | -1) {
		const j = i + dir;
		if (j < 0 || j >= elements.length) return;
		const next = [...elements];
		[next[i], next[j]] = [next[j], next[i]];
		elements = next;
		if (open === i) open = j;
		else if (open === j) open = i;
	}
	function remove(i: number) {
		elements = elements.filter((_, j) => j !== i);
		if (open === i) open = null;
		else if (open !== null && open > i) open -= 1;
	}
	function addDict() {
		elements = [...elements, { kind: 'dict', value: {} }];
		open = elements.length - 1;
	}
	function addToken(name: string) {
		const m = methodOf(name);
		const args = Object.fromEntries(
			(m?.params ?? []).filter((p) => p.default !== undefined).map((p) => [p.name, p.default])
		);
		elements = [...elements, { kind: 'token', name, args }];
		addTokenOpen = false;
		open = elements.length - 1;
	}

	// ── dict editing ─────────────────────────────────────────────────────────────
	function setDictKey(i: number, key: string, v: unknown) {
		elements = elements.map((el, j) =>
			j === i && el.kind === 'dict' ? { kind: 'dict', value: { ...el.value, [key]: v } } : el
		);
	}
	function removeDictKey(i: number, key: string) {
		elements = elements.map((el, j) => {
			if (j !== i || el.kind !== 'dict') return el;
			const { [key]: _, ...rest } = el.value;
			return { kind: 'dict', value: rest };
		});
	}
	function addDictField(i: number, key: string) {
		const f = fieldOf(key);
		setDictKey(i, key, f ? (f.default ?? defaultFor(f.type)) : '');
	}
	function addFreeKey(i: number) {
		const key = freeKey.trim();
		if (!key) return;
		setDictKey(i, key, '');
		freeKey = '';
	}
	function unusedFields(el: Extract<EditableElement, { kind: 'dict' }>) {
		return schema.fields.filter((f) => !(f.key in el.value));
	}

	// ── token args ───────────────────────────────────────────────────────────────
	function setArg(i: number, key: string, v: unknown) {
		elements = elements.map((el, j) =>
			j === i && el.kind === 'token'
				? { kind: 'token', name: el.name, args: { ...el.args, [key]: v } }
				: el
		);
	}

	/** Preview line of the wire version (what lands in the CLI). */
	const preview = $derived(
		wire
			.map((el) =>
				typeof el === 'string'
					? el
					: Object.entries(el)
							.map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`)
							.join(' ')
			)
			.join(' ') || 'defaults'
	);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="overlay" onclick={onCancel}>
	<div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-label="version editor">
		<div class="mhead">
			<span class="mtitle mono">version · {schema.module}</span>
			<span class="mspacer"></span>
			<button class="mclose" onclick={onCancel} title="cancel">×</button>
		</div>

		<div class="mbody">
			{#each elements as el, i (i)}
				<div class="elem" class:openel={open === i}>
					<div class="ehead">
						<button class="etoggle" onclick={() => (open = open === i ? null : i)}>
							<span class="eno mono">{i + 1}</span>
							<span class="echip mono" class:dict={el.kind === 'dict'}>{label(el)}</span>
						</button>
						<span class="espacer"></span>
						{#if el.kind === 'token' && methodOf(el.name)?.sourceRef && onViewSource}
							<button
								class="esrc mono"
								onclick={() => onViewSource(methodOf(el.name)!.sourceRef!)}>&lt;/&gt;</button
							>
						{/if}
						<span class="emv">
							<button class="mv" onclick={() => move(i, -1)} title="move up">▴</button>
							<button class="mv" onclick={() => move(i, 1)} title="move down">▾</button>
						</span>
						<button class="erm" onclick={() => remove(i)} title="remove">×</button>
					</div>

					{#if open === i}
						<div class="ebody">
							{#if el.kind === 'dict'}
								{#each Object.keys(el.value) as key (key)}
									{@const f = fieldOf(key)}
									<div class="krow">
										<span class="kname mono">{key}</span>
										<FieldRenderer
											type={f?.type ?? { kind: 'unknown' }}
											value={el.value[key]}
											onChange={(v) => setDictKey(i, key, v)}
										/>
										{#if f}<span class="ktype mono">{typeLabel(f.type)}</span>{/if}
										<button class="krm" onclick={() => removeDictKey(i, key)} title="remove key">×</button>
									</div>
								{:else}
									<div class="kempty mono">empty — add a field below</div>
								{/each}
								<div class="kadd">
									{#each unusedFields(el) as f (f.key)}
										<button class="kfield mono" onclick={() => addDictField(i, f.key)}>
											+ {f.key}
										</button>
									{/each}
									<input
										class="kfree mono"
										placeholder="custom.key"
										bind:value={freeKey}
										onkeydown={(e) => e.key === 'Enter' && addFreeKey(i)}
									/>
								</div>
							{:else}
								{@const m = methodOf(el.name)}
								{#if m?.doc}<div class="tdoc">{m.doc}</div>{/if}
								{#each m?.params ?? [] as p (p.name)}
									<div class="krow">
										<span class="kname mono">{p.name}</span>
										<FieldRenderer
											type={p.type ?? { kind: 'unknown' }}
											value={el.args[p.name] ?? p.default ?? null}
											onChange={(v) => setArg(i, p.name, v)}
										/>
										{#if p.default !== undefined}
											<span class="ktype mono">def {JSON.stringify(p.default)}</span>
										{/if}
									</div>
								{:else}
									<div class="kempty mono">no arguments</div>
								{/each}
							{/if}
						</div>
					{/if}
				</div>
			{:else}
				<div class="kempty mono">defaults — add overrides or a ~version</div>
			{/each}

			<div class="addbar">
				<button class="add mono" onclick={addDict}>+ overrides {'{}'}</button>
				{#if schema.versionMethods.length}
					<button class="add mono" onclick={() => (addTokenOpen = !addTokenOpen)}>+ ~version</button>
				{/if}
			</div>
			{#if addTokenOpen}
				<div class="vocab">
					{#each schema.versionMethods as m (m.name)}
						<button class="vrow" onclick={() => addToken(m.name)}>
							<span class="vname mono">~{m.name}</span>
							{#if m.doc}<span class="vdoc">{m.doc.split('\n')[0]}</span>{/if}
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<div class="mfoot">
			<span class="mprev mono" title="the compact version, as the CLI writes it">{preview}</span>
			<span class="mspacer"></span>
			<button class="btn" onclick={onCancel}>Cancel</button>
			<button class="btn primary" onclick={() => onApply(wire)}>Apply</button>
		</div>
	</div>
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: color-mix(in srgb, var(--c-ink, #2c2823) 32%, transparent);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
		padding: 24px;
	}
	.modal {
		width: min(560px, 100%);
		max-height: min(640px, 90vh);
		display: flex;
		flex-direction: column;
		background: var(--c-paper, #f6f2e9);
		border: 1px solid var(--c-hairline-strong, #cfc6b3);
		border-radius: 12px;
		box-shadow: 0 18px 50px color-mix(in srgb, var(--c-ink, #2c2823) 25%, transparent);
	}
	.mhead {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		border-bottom: 1px solid var(--c-hairline, #e4e1db);
	}
	.mtitle {
		font-size: 12px;
		font-weight: 600;
		color: var(--c-ink, #2c2823);
	}
	.mspacer {
		flex: 1;
	}
	.mclose {
		border: none;
		background: none;
		font-size: 16px;
		color: var(--c-ink-faint, #a69d8d);
		cursor: pointer;
		padding: 0 2px;
		line-height: 1;
	}
	.mbody {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: 12px 14px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.elem {
		border: 1px solid var(--c-hairline, #dcd5c6);
		border-radius: 9px;
		background: var(--c-paper-raised, #fff);
	}
	.elem.openel {
		border-color: color-mix(in srgb, var(--c-model, #5b6ee0) 40%, transparent);
	}
	.ehead {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 7px 10px;
	}
	.etoggle {
		display: flex;
		align-items: center;
		gap: 9px;
		border: none;
		background: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		min-width: 0;
	}
	.eno {
		font-size: 11px;
		color: var(--c-ink-faint, #8f8677);
	}
	.echip {
		font-size: 12px;
		color: #fff;
		background: var(--c-model, #5b6ee0);
		padding: 2px 9px;
		border-radius: 7px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 320px;
	}
	.echip.dict {
		background: var(--c-live, #2f9e6f);
	}
	.espacer {
		flex: 1;
	}
	.esrc {
		border: none;
		background: none;
		font-size: 10.5px;
		color: var(--c-model, #5b6ee0);
		cursor: pointer;
		padding: 0 3px;
	}
	.emv {
		display: flex;
		flex-direction: column;
	}
	.mv {
		border: none;
		background: none;
		color: var(--c-ink-faint, #c9c0af);
		font-size: 8px;
		line-height: 1;
		padding: 0 2px;
		cursor: pointer;
	}
	.mv:hover {
		color: var(--c-ink-soft, #6b6760);
	}
	.erm {
		border: none;
		background: none;
		color: var(--c-ink-faint, #9a958c);
		cursor: pointer;
		font-size: 13px;
		line-height: 1;
		padding: 0 2px;
	}
	.ebody {
		border-top: 1px solid var(--c-hairline, #ece8df);
		padding: 9px 10px;
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.tdoc {
		font-size: 11px;
		color: var(--c-ink-soft, #6b6760);
		line-height: 1.45;
	}
	.krow {
		display: flex;
		align-items: center;
		gap: 9px;
		min-width: 0;
	}
	.kname {
		font-size: 11.5px;
		color: var(--c-ink, #2c2823);
		min-width: 76px;
		flex: none;
	}
	.ktype {
		font-size: 10px;
		color: var(--c-ink-faint, #a69d8d);
		white-space: nowrap;
	}
	.krm {
		border: none;
		background: none;
		color: var(--c-ink-faint, #a69d8d);
		font-size: 12px;
		cursor: pointer;
		padding: 0 2px;
		margin-left: auto;
	}
	.kempty {
		font-size: 11px;
		color: var(--c-ink-faint, #a69d8d);
	}
	.kadd {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		align-items: center;
		padding-top: 2px;
	}
	.kfield {
		border: 1px dashed var(--c-hairline-strong, #cfc6b3);
		background: none;
		font-size: 10.5px;
		color: var(--c-ink-soft, #6b6760);
		padding: 2px 8px;
		border-radius: 7px;
		cursor: pointer;
	}
	.kfield:hover {
		color: var(--c-ink, #2c2823);
		border-color: var(--c-ink-soft, #6b6760);
	}
	.kfree {
		width: 110px;
		font: inherit;
		font-size: 10.5px;
		padding: 2px 8px;
		border: 1px dashed var(--c-hairline-strong, #cfc6b3);
		border-radius: 7px;
		background: none;
		color: var(--c-ink, #2c2823);
	}

	.addbar {
		display: flex;
		gap: 7px;
	}
	.add {
		border: 1px dashed color-mix(in srgb, var(--c-model, #5b6ee0) 45%, transparent);
		background: none;
		font-size: 11.5px;
		color: var(--c-model, #5b6ee0);
		padding: 4px 11px;
		border-radius: 8px;
		cursor: pointer;
	}
	.vocab {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.vrow {
		display: flex;
		align-items: baseline;
		gap: 8px;
		padding: 6px 10px;
		background: var(--c-paper-raised, #fff);
		border: 1px solid var(--c-hairline, #dcd5c6);
		border-radius: 8px;
		font: inherit;
		cursor: pointer;
		text-align: left;
	}
	.vrow:hover {
		border-color: color-mix(in srgb, var(--c-model, #5b6ee0) 45%, transparent);
	}
	.vname {
		font-size: 12px;
		color: var(--c-model, #5b6ee0);
	}
	.vdoc {
		font-size: 11px;
		color: var(--c-ink-faint, #8f8677);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mfoot {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 10px 14px;
		border-top: 1px solid var(--c-hairline, #e4e1db);
	}
	.mprev {
		font-size: 10.5px;
		color: var(--c-ink-soft, #6b6760);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}
	.btn {
		font: inherit;
		font-size: 12.5px;
		padding: 6px 14px;
		border-radius: 8px;
		border: 1px solid var(--c-hairline-strong, #cfc6b3);
		background: transparent;
		color: var(--c-ink-soft, #6b6760);
		cursor: pointer;
	}
	.btn.primary {
		background: var(--c-model, #5b6ee0);
		border-color: var(--c-model, #5b6ee0);
		color: #fff;
		font-weight: 600;
	}
</style>
