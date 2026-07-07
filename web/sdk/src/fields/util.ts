// Shared helpers for the typed field renderers (design D1). No captu imports.

import type { FieldType } from '../types';

/** A sensible zero value for a type — used when adding list items or setting an
 * optional from None. */
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

/** Compact display label for a type — the faint mono caption next to a field
 * (e.g. "float", "int | None", "Literal[…]", "list[·]", "dict"). */
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

/** Value equality by JSON shape (defaults and edits share construction, so key
 * order is stable) — drives the changed-from-default dot. */
export function jsonEq(a: unknown, b: unknown): boolean {
	return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

/** Compact one-line preview of a structured value (object/list card headers). */
export function preview(v: unknown): string {
	if (v === null || v === undefined) return 'null';
	if (Array.isArray(v)) return `${v.length} item${v.length === 1 ? '' : 's'}`;
	if (typeof v === 'object') return `{ ${Object.keys(v).length} }`;
	return String(v);
}
