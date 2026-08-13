import type {
	ConfigField,
	FieldType,
	ModuleSchema,
	VersionMethod,
	VersionMethodParam
} from './types';


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

export function parseAnnotation(annotation: string): FieldType {
	let s = (annotation ?? '').trim();
	if (!s) return { kind: 'unknown' };

	const cls = s.match(/^<class '([^']+)'>$/);
	if (cls) s = cls[1];
	s = s.replace(/^typing\./, '');

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
			return { kind: 'unknown', annotation };
	}
}


export function parseSignature(signature: string | undefined): VersionMethodParam[] {
	if (!signature) return [];
	const body = signature.trim().replace(/^\(/, '').replace(/\)$/, '');
	if (!body.trim()) return [];
	const params: VersionMethodParam[] = [];
	for (const part of splitTop(body, ',')) {
		const p = part.trim();
		if (!p || p === 'self' || p === '*' || p === '/' || p.startsWith('*')) continue;
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


export interface RawConfigField {
	name: string;
	type?: string;
	default?: unknown;
	required?: boolean;
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
	source_file?: string | null;
	source_line?: number | null;
}

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

export function moduleSchemaFromServer(
	module: string,
	raw: RawModuleSchema,
	opts?: { slotFor?: (fieldName: string) => string | undefined }
): ModuleSchema {
	const fields: ConfigField[] = (raw.config_fields ?? []).map((f) =>
		fieldFromServer(f, opts?.slotFor)
	);
	const file = raw.source_file ?? undefined;
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


export type EditableElement =
	| { kind: 'dict'; value: Record<string, unknown> }
	| { kind: 'token'; name: string; args: Record<string, unknown> };

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

export function serializeVersionToken(name: string, args: Record<string, unknown>): string {
	const parts = Object.entries(args).map(
		([k, v]) => `${k}=${typeof v === 'string' ? `'${v}'` : JSON.stringify(v)}`
	);
	return parts.length ? `~${name}(${parts.join(', ')})` : `~${name}`;
}

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
