// SDK introspection helpers — pure functions that turn machinable's *stringly* reflection
// into the SDK's typed schema. The server reflects each config field's type as
// `str(field.annotation)` (e.g. "<class 'int'>", "int | None", "typing.Literal['a', 'b']",
// "list[Stage]") and each version method's signature as a string (e.g. "(iters: int = 200)");
// these parsers recover the structure client-side. Nested pydantic models arrive as
// "<class 'x.Stage'>" with no field structure → `unknown` (the raw fallback renderer) until
// upstream reflection lands. No captu imports — this file ships with the SDK.

import type {
	ConfigField,
	FieldType,
	ModuleSchema,
	VersionMethod,
	VersionMethodParam
} from './types';

// ── annotation → FieldType ───────────────────────────────────────────────────────────

/** Split on a separator at bracket/quote depth 0. */
function splitTop(s: string, sep: string): string[] {
	const parts: string[] = [];
	let depth = 0;
	let quote: string | null = null;
	let cur = '';
	for (let i = 0; i < s.length; i++) {
		const c = s[i];
		if (quote) {
			cur += c;
			if (c === quote && s[i - 1] !== '\\') quote = null;
			continue;
		}
		if (c === "'" || c === '"') {
			quote = c;
			cur += c;
			continue;
		}
		if (c === '[' || c === '(' || c === '{') depth++;
		if (c === ']' || c === ')' || c === '}') depth--;
		if (depth === 0 && c === sep && sep.length === 1) {
			parts.push(cur);
			cur = '';
			continue;
		}
		cur += c;
	}
	parts.push(cur);
	return parts;
}

/** Parse a Python literal (as it appears inside a Literal[...] or a default) into a JS
 * value; returns the raw trimmed string when it isn't a simple literal. */
function pyLiteral(raw: string): unknown {
	const s = raw.trim();
	if (s === 'None') return null;
	if (s === 'True') return true;
	if (s === 'False') return false;
	if (/^-?\d+$/.test(s)) return parseInt(s, 10);
	if (/^-?\d*\.\d+(e-?\d+)?$/i.test(s) || /^-?\d+e-?\d+$/i.test(s)) return parseFloat(s);
	const q = s.match(/^(['"])(.*)\1$/s);
	if (q) return q[2];
	return s;
}

/**
 * Parse a Python type-annotation string (the server's `str(field.annotation)`) into the
 * SDK's recursive `FieldType`. Best-effort: anything unrecognized becomes
 * `{ kind: 'unknown', annotation }` (→ the raw key=value fallback renderer).
 */
export function parseAnnotation(annotation: string): FieldType {
	let s = (annotation ?? '').trim();
	if (!s) return { kind: 'unknown' };

	// "<class 'int'>" → "int"
	const cls = s.match(/^<class '([^']+)'>$/);
	if (cls) s = cls[1];
	// strip a typing. prefix ("typing.Optional[int]" → "Optional[int]")
	s = s.replace(/^typing\./, '');

	// unions — drop None members; a single survivor becomes optional(inner)
	if (splitTop(s, '|').length > 1) {
		const members = splitTop(s, '|').map((m) => m.trim());
		const nonNull = members.filter((m) => m !== 'None' && m !== 'NoneType');
		const hadNull = nonNull.length !== members.length;
		const inner: FieldType =
			nonNull.length === 1 ? parseAnnotation(nonNull[0]) : { kind: 'unknown', annotation };
		return hadNull ? { kind: 'optional', inner } : inner;
	}

	const generic = s.match(/^(\w+)\[(.*)\]$/s);
	if (generic) {
		const head = generic[1];
		const body = generic[2];
		switch (head) {
			case 'Optional':
				return { kind: 'optional', inner: parseAnnotation(body) };
			case 'Literal': {
				const options = splitTop(body, ',')
					.map((o) => pyLiteral(o))
					.filter((o): o is string | number => typeof o === 'string' || typeof o === 'number');
				return options.length ? { kind: 'enum', options } : { kind: 'unknown', annotation };
			}
			case 'list':
			case 'List':
			case 'Sequence':
			case 'tuple':
			case 'Tuple':
				return { kind: 'list', item: parseAnnotation(splitTop(body, ',')[0]) };
			case 'dict':
			case 'Dict':
			case 'Mapping':
				return { kind: 'object', open: true };
			default:
				return { kind: 'unknown', annotation };
		}
	}

	switch (s) {
		case 'str':
			return { kind: 'str' };
		case 'int':
			return { kind: 'int' };
		case 'float':
			return { kind: 'float' };
		case 'bool':
			return { kind: 'bool' };
		case 'dict':
			return { kind: 'object', open: true };
		case 'list':
		case 'tuple':
			return { kind: 'list', item: { kind: 'unknown' } };
		default:
			// a custom class (e.g. a nested pydantic model, "x.Stage") — structure unknown
			return { kind: 'unknown', annotation };
	}
}

// ── signature → params ───────────────────────────────────────────────────────────────

/**
 * Parse a version-method signature string (e.g. "(iters: int = 200)", "(path)",
 * "(*, mode, backbone)") into typed params. Skips `self`, bare `*`/`/`, and starred
 * args; best-effort on defaults.
 */
export function parseSignature(signature: string | undefined): VersionMethodParam[] {
	if (!signature) return [];
	const body = signature.trim().replace(/^\(/, '').replace(/\)$/, '');
	if (!body.trim()) return [];
	const params: VersionMethodParam[] = [];
	for (const part of splitTop(body, ',')) {
		const p = part.trim();
		if (!p || p === 'self' || p === '*' || p === '/' || p.startsWith('*')) continue;
		// name[: annotation][= default]
		const eq = splitTop(p, '=');
		const left = eq[0].trim();
		const def = eq.length > 1 ? eq.slice(1).join('=').trim() : undefined;
		const colon = splitTop(left, ':');
		const name = colon[0].trim();
		if (!name || !/^\w+$/.test(name)) continue;
		const ann = colon.length > 1 ? colon.slice(1).join(':').trim() : undefined;
		params.push({
			name,
			type: ann ? parseAnnotation(ann) : undefined,
			default: def !== undefined ? pyLiteral(def) : undefined
		});
	}
	return params;
}

// ── raw server schema → ModuleSchema ─────────────────────────────────────────────────

/** The raw `GET /v1/project/{module}` JSON (api/models.py ModuleSchema). */
export interface RawConfigField {
	name: string;
	type?: string;
	default?: unknown;
	required?: boolean;
	/** Recursively reflected sub-fields when the annotation is a nested model. */
	fields?: RawConfigField[] | null;
}
export interface RawModuleSchema {
	module?: string;
	kind?: string;
	doc?: string | null;
	config_fields?: RawConfigField[];
	versions?: string[];
	version_methods?: {
		name: string;
		signature?: string;
		doc?: string | null;
		source_line?: number | null;
	}[];
	/** Project-relative source file of the class (readable via the source API). */
	source_file?: string | null;
	source_line?: number | null;
}

/** Replace the model position inside a parsed type shell with a structured object
 * (`unknown` → the object; `optional`/`list` graft into their inner/item). */
function graftObject(parsed: FieldType, obj: FieldType): FieldType {
	if (parsed.kind === 'unknown') return obj;
	if (parsed.kind === 'optional')
		return { kind: 'optional', inner: graftObject(parsed.inner, obj) };
	if (parsed.kind === 'list') return { kind: 'list', item: graftObject(parsed.item, obj) };
	return parsed;
}

function fieldFromServer(
	f: RawConfigField,
	slotFor?: (fieldName: string) => string | undefined
): ConfigField {
	let type = parseAnnotation(f.type ?? '');
	if (f.fields?.length) {
		// the server reflected the nested model's structure — light up the
		// structured editor instead of the raw-JSON fallback
		const sub = f.fields.map((x) => fieldFromServer(x));
		type = graftObject(type, { kind: 'object', fields: sub });
	}
	return {
		key: f.name,
		type,
		default: f.default ?? undefined,
		required: f.required ?? undefined,
		slot: slotFor?.(f.name)
	};
}

/**
 * Map the server's reflected module schema into the SDK shape. `slotFor` lets the host
 * attach field-renderer slots by field name (e.g. captu's recording_uri picker).
 */
export function moduleSchemaFromServer(
	module: string,
	raw: RawModuleSchema,
	opts?: { slotFor?: (fieldName: string) => string | undefined }
): ModuleSchema {
	const fields: ConfigField[] = (raw.config_fields ?? []).map((f) =>
		fieldFromServer(f, opts?.slotFor)
	);
	const file = raw.source_file ?? undefined;
	// version_methods when present; older servers only send the bare token names
	const methods: VersionMethod[] = raw.version_methods?.length
		? raw.version_methods.map((m) => ({
				name: m.name,
				doc: m.doc ?? undefined,
				signature: m.signature,
				params: parseSignature(m.signature),
				sourceRef: file
					? { path: file, line: m.source_line ?? undefined, symbol: `version_${m.name}` }
					: undefined
			}))
		: (raw.versions ?? []).map((name) => ({ name, params: [] }));
	return {
		module: raw.module ?? module,
		kind: raw.kind,
		doc: raw.doc ?? undefined,
		fields,
		versionMethods: methods,
		sourceRef: file ? { path: file, line: raw.source_line ?? undefined } : undefined
	};
}

// ── version pipeline (the editor's element model) ────────────────────────────────────

/** One editable element of a compact version: an explicit override dict, or a
 * ~token with args. Unlike the wire form, dicts stay distinct and positioned. */
export type EditableElement =
	| { kind: 'dict'; value: Record<string, unknown> }
	| { kind: 'token'; name: string; args: Record<string, unknown> };

/** Wire version → editable elements, order preserved (dicts stay separate). */
export function versionToElements(version: (string | Record<string, unknown>)[]): EditableElement[] {
	const out: EditableElement[] = [];
	for (const el of version) {
		if (typeof el === 'string') {
			const t = parseVersionToken(el);
			if (t) out.push({ kind: 'token', name: t.name, args: t.args });
		} else {
			out.push({ kind: 'dict', value: { ...el } });
		}
	}
	return out;
}

/** Editable elements → wire version. Empty dicts are dropped; token args pass
 * through `compactArgs` (e.g. strip declared defaults) before serializing. */
export function elementsToVersion(
	elements: EditableElement[],
	compactArgs: (name: string, args: Record<string, unknown>) => Record<string, unknown> = (_, a) => a
): (string | Record<string, unknown>)[] {
	const out: (string | Record<string, unknown>)[] = [];
	for (const el of elements) {
		if (el.kind === 'dict') {
			if (Object.keys(el.value).length) out.push({ ...el.value });
		} else {
			out.push(serializeVersionToken(el.name, compactArgs(el.name, el.args)));
		}
	}
	return out;
}

// ── version tokens ───────────────────────────────────────────────────────────────────

/** Parse a version-token string "~name(a=1, b='x')" → { name, args }; bare "~name" has
 * empty args. Returns null when the string isn't a ~token. */
export function parseVersionToken(
	el: string
): { name: string; args: Record<string, unknown> } | null {
	const m = el.match(/^~(\w+)(?:\((.*)\))?$/s);
	if (!m) return null;
	const args: Record<string, unknown> = {};
	if (m[2]?.trim()) {
		for (const part of splitTop(m[2], ',')) {
			const [k, ...rest] = part.split('=');
			const raw = rest.join('=').trim();
			if (!k.trim() || !raw) continue;
			try {
				args[k.trim()] = JSON.parse(raw.replace(/'/g, '"'));
			} catch {
				args[k.trim()] = raw;
			}
		}
	}
	return { name: m[1], args };
}

/** Serialize a token back to its compact string: "~name" or "~name(k=v, …)". */
export function serializeVersionToken(name: string, args: Record<string, unknown>): string {
	const parts = Object.entries(args).map(
		([k, v]) => `${k}=${typeof v === 'string' ? `'${v}'` : JSON.stringify(v)}`
	);
	return parts.length ? `~${name}(${parts.join(', ')})` : `~${name}`;
}

/** Render a compact version as CLI argument parts — `k=v` per override entry, ~tokens
 * verbatim — matching machinable's `get` argument form. */
export function versionCliParts(version: (string | Record<string, unknown>)[]): string[] {
	const parts: string[] = [];
	for (const el of version) {
		if (typeof el === 'string') parts.push(el);
		else
			for (const [k, v] of Object.entries(el))
				parts.push(`${k}=${typeof v === 'string' && !/[\s"'{}[\],]/.test(v) ? v : JSON.stringify(v)}`);
	}
	return parts;
}

// ── display identity ─────────────────────────────────────────────────────────────────

/** Stable short display hash (8 hex chars) of a value — the "#a3f9c2e1" identity chip.
 * Display-only (djb2 over canonical JSON); the server's content identity is authoritative. */
export function shortIdentity(value: unknown): string {
	const s = canonicalJson(value);
	let h = 5381;
	for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
	return (h >>> 0).toString(16).padStart(8, '0');
}

function canonicalJson(value: unknown): string {
	if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
	if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
	const keys = Object.keys(value as Record<string, unknown>).sort();
	return `{${keys
		.map((k) => `${JSON.stringify(k)}:${canonicalJson((value as Record<string, unknown>)[k])}`)
		.join(',')}}`;
}
