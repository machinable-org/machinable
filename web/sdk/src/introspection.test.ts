// Pins the introspection parsers' behavior (they decode the server's stringly
// reflection; regressions here silently break every form).
import { describe, expect, it } from 'vitest';

import {
	elementsToVersion,
	moduleSchemaFromServer,
	parseAnnotation,
	parseSignature,
	parseVersionToken,
	serializeVersionToken,
	shortIdentity,
	versionToElements
} from './introspection';

describe('parseAnnotation', () => {
	it('handles primitives and <class> wrappers', () => {
		expect(parseAnnotation("<class 'int'>")).toEqual({ kind: 'int' });
		expect(parseAnnotation('str')).toEqual({ kind: 'str' });
		expect(parseAnnotation('bool')).toEqual({ kind: 'bool' });
	});
	it('handles optionals and unions', () => {
		expect(parseAnnotation('int | None')).toEqual({ kind: 'optional', inner: { kind: 'int' } });
		expect(parseAnnotation('typing.Optional[float]')).toEqual({
			kind: 'optional',
			inner: { kind: 'float' }
		});
	});
	it('handles Literal, list, and dict', () => {
		expect(parseAnnotation("typing.Literal['a', 'b']")).toEqual({
			kind: 'enum',
			options: ['a', 'b']
		});
		expect(parseAnnotation('list[int]')).toEqual({ kind: 'list', item: { kind: 'int' } });
		expect(parseAnnotation('dict[str, int]')).toEqual({ kind: 'object', open: true });
	});
	it('degrades unknown annotations to the raw fallback', () => {
		// the original annotation string is preserved for display
		expect(parseAnnotation("<class 'x.Stage'>")).toEqual({
			kind: 'unknown',
			annotation: "<class 'x.Stage'>"
		});
	});
});

describe('parseSignature', () => {
	it('parses names, annotations, and defaults', () => {
		expect(parseSignature('(iters: int = 200)')).toEqual([
			{ name: 'iters', type: { kind: 'int' }, default: 200 }
		]);
	});
	it('skips self and stars', () => {
		expect(parseSignature('(self, *, mode)')).toEqual([
			{ name: 'mode', type: undefined, default: undefined }
		]);
	});
});

describe('version tokens', () => {
	it('round-trips ~name(args)', () => {
		const token = parseVersionToken("~precise(iters=500, mode='fast')");
		expect(token).toEqual({ name: 'precise', args: { iters: 500, mode: 'fast' } });
		expect(serializeVersionToken(token!.name, token!.args)).toBe(
			"~precise(iters=500, mode='fast')"
		);
	});
	it('returns null for non-tokens', () => {
		expect(parseVersionToken('plain')).toBeNull();
	});
});

describe('moduleSchemaFromServer', () => {
	it('maps the raw GET /v1/project/{module} payload', () => {
		const schema = moduleSchemaFromServer('estimator', {
			module: 'estimator',
			kind: 'Interface',
			doc: 'An estimator.',
			config_fields: [{ name: 'alpha', type: "<class 'float'>", default: 0.1, required: false }],
			version_methods: [{ name: 'precise', signature: '(iters: int = 200)', doc: 'More iters.' }]
		});
		expect(schema.fields).toEqual([
			{ key: 'alpha', type: { kind: 'float' }, default: 0.1, required: false, slot: undefined }
		]);
		expect(schema.versionMethods[0].params).toEqual([
			{ name: 'iters', type: { kind: 'int' }, default: 200 }
		]);
	});
});

describe('version pipeline elements', () => {
	it('round-trips order with multiple dicts and tokens', () => {
		const version = ['~fast', { note: '1' }, '~precise(lr=0.001)', { lr: 0.5 }];
		const elements = versionToElements(version);
		expect(elements).toEqual([
			{ kind: 'token', name: 'fast', args: {} },
			{ kind: 'dict', value: { note: '1' } },
			{ kind: 'token', name: 'precise', args: { lr: 0.001 } },
			{ kind: 'dict', value: { lr: 0.5 } }
		]);
		expect(elementsToVersion(elements)).toEqual(version);
	});
	it('drops empty dicts and compacts token args', () => {
		const elements = versionToElements(['~fast(epochs=1)']);
		expect(
			elementsToVersion([{ kind: 'dict', value: {} }, ...elements], (name, args) =>
				name === 'fast' ? {} : args
			)
		).toEqual(['~fast']);
	});
});

describe('moduleSchemaFromServer nested reflection', () => {
	it('grafts server-reflected sub-fields into the parsed type shell', () => {
		const schema = moduleSchemaFromServer('pipeline', {
			config_fields: [
				{
					name: 'optimizer',
					type: "<class 'pipeline.Optimizer'>",
					default: { kind: 'sgd', lr: 0.1 },
					fields: [
						{ name: 'kind', type: "typing.Literal['sgd', 'adam']", default: 'sgd' },
						{ name: 'lr', type: "<class 'float'>", default: 0.1 }
					]
				},
				{
					name: 'stages',
					type: 'list[pipeline.Stage]',
					default: [],
					fields: [{ name: 'epochs', type: "<class 'int'>", default: 1 }]
				}
			]
		});
		const optimizer = schema.fields[0].type;
		expect(optimizer.kind).toBe('object');
		if (optimizer.kind === 'object') {
			expect(optimizer.fields?.[0].type).toEqual({ kind: 'enum', options: ['sgd', 'adam'] });
			expect(optimizer.fields?.[1].type).toEqual({ kind: 'float' });
		}
		const stages = schema.fields[1].type;
		expect(stages.kind).toBe('list');
		if (stages.kind === 'list') {
			expect(stages.item.kind).toBe('object');
		}
	});
});

describe('shortIdentity', () => {
	it('is stable under key order', () => {
		expect(shortIdentity({ a: 1, b: 2 })).toBe(shortIdentity({ b: 2, a: 1 }));
	});
});
