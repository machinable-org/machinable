import type { FieldType } from '../types';

export function defaultFor(type: FieldType): unknown {
	switch (type.kind) {
		case 'str':
			return '';
		case 'int':
		case 'float':
			return 0;
		case 'bool':
			return false;
		case 'enum':
			return type.options[0] ?? '';
		case 'optional':
			return null;
		case 'list':
			return [];
		case 'object':
			return Object.fromEntries(
				(type.fields ?? []).map((f) => [f.key, f.default ?? defaultFor(f.type)])
			);
		default:
			return null;
	}
}

export function typeLabel(type: FieldType): string {
	switch (type.kind) {
		case 'str':
			return 'str';
		case 'int':
			return 'int';
		case 'float':
			return 'float';
		case 'bool':
			return 'bool';
		case 'enum':
			return 'Literal[…]';
		case 'optional':
			return `${typeLabel(type.inner)} | None`;
		case 'list':
			return `list[${typeLabel(type.item)}]`;
		case 'object':
			return 'dict';
		default:
			return type.annotation ?? '?';
	}
}

export function jsonEq(a: unknown, b: unknown): boolean {
	return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

export function preview(v: unknown): string {
	if (v === null || v === undefined) return 'null';
	if (Array.isArray(v)) return `${v.length} item${v.length === 1 ? '' : 's'}`;
	if (typeof v === 'object') return `{ ${Object.keys(v).length} }`;
	return String(v);
}
