export type FieldType =
	| { kind: 'str' }
	| { kind: 'int' }
	| { kind: 'float' }
	| { kind: 'bool' }
	| { kind: 'enum'; options: (string | number)[] }
	| { kind: 'optional'; inner: FieldType }
	| { kind: 'list'; item: FieldType }
	| { kind: 'object'; fields?: ConfigField[]; open?: boolean }
	| { kind: 'unknown'; annotation?: string };

export interface FieldConstraints {
	gt?: number;
	ge?: number;
	lt?: number;
	le?: number;
	multipleOf?: number;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
}

export interface ConfigField {
	key: string;
	type: FieldType;
	default?: unknown;
	required?: boolean;
	doc?: string;
	constraints?: FieldConstraints;
	slot?: string;
}

export type VersionElement = string | Record<string, unknown>;
export type Version = VersionElement[];

export interface VersionMethodParam {
	name: string;
	type?: FieldType;
	default?: unknown;
}
export interface VersionMethod {
	name: string;
	doc?: string;
	signature?: string;
	params: VersionMethodParam[];
	sourceRef?: SourceRef;
}

export interface SourceRef {
	path: string;
	line?: number;
	symbol?: string;
}

export interface ModuleSchema {
	module: string;
	kind?: string;
	title?: string;
	doc?: string;
	fields: ConfigField[];
	versionMethods: VersionMethod[];
	sourceRef?: SourceRef;
}

export interface ResolveIssue {
	path?: string;
	message: string;
}

export type ResolveResult =
	| {
			ok: true;
			config: Record<string, unknown>;
			cli: string;
			predicate?: Record<string, unknown>;
			identity?: string;
	  }
	| { ok: false; issues: ResolveIssue[] };

export type InterfaceStatus =
	| 'draft'
	| 'pending'
	| 'running'
	| 'cached'
	| 'failed'
	| 'interrupted';

export interface Ref {
	target: string;
	version?: Version;
}

export interface FindResult {
	status: InterfaceStatus;
	executionRef?: string;
	uuid?: string;
	issues?: ResolveIssue[];
}

export interface RunDetail {
	uuid: string;
	nickname?: string;
	seed?: number;
	startedAt?: string | null;
	finishedAt?: string | null;
	heartbeatAt?: string | null;
	active?: boolean;
	finished?: boolean;
}

export interface OutputChunk {
	output: string | null;
	offset: number;
	size: number;
}

export type FacetOp = 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'contains';
export interface Facet {
	path: string;
	op: FacetOp;
	value: unknown;
}
export interface CatalogSort {
	by: string;
	direction?: 'asc' | 'desc';
	configPath?: boolean;
}
export interface CatalogQuery {
	text?: string;
	module?: string;
	facets?: Facet[];
	sort?: CatalogSort;
	limit?: number;
	offset?: number;
}

export interface RunRecord {
	uuid: string;
	module: string;
	config: Record<string, unknown>;
	version?: Version;
	identity?: string;
	executionRef?: string;
	status: InterfaceStatus;
	label?: string;
	createdAt?: number;
	creator?: string;
	runCount?: number;
	manifest?: { commit: string; dirty?: boolean };
}
export interface CatalogPage {
	items: RunRecord[];
	total: number;
}

export interface ProvenanceNode {
	uuid: string;
	kind: string;
	module?: string;
	version: Version;
	label?: string;
	attributes: Record<string, unknown>;
}

export interface ProvenanceEdge {
	source: string;
	target: string;
	rel: string;
}

export interface ProvenanceRecord {
	root: string;
	nodes: ProvenanceNode[];
	links: ProvenanceEdge[];
	truncated: boolean;
}

export interface SourceFile {
	path: string;
	module?: string;
	size?: number;
}
export interface SourceContent {
	path: string;
	content: string;
	language?: string;
	etag?: string;
}

export interface WidgetAssets {
	esm: string;
	css?: string | null;
	meta?: Record<string, unknown>;
}

export interface WidgetModel {
	get(key: string): unknown;
	set(key: string, value: unknown): void;
	save_changes(): void;
	on(event: string, cb: (...args: unknown[]) => void): void;
	off(event: string, cb?: (...args: unknown[]) => void): void;
	send(content: unknown, callbacks?: unknown, buffers?: unknown): void;
}

export type BoundWidgetModel = WidgetModel & { close?(): void };

export interface HostSlots {
	fields?: Record<string, unknown>;
	result?: unknown;
}

export interface WidgetHostAdapter {
	connect(
		url: string,
		token?: string,
		opts?: { readOnly?: boolean }
	): Promise<{
		connected: boolean;
		needsTrust?: boolean;
		readOnly?: boolean;
		modules?: string[];
		project?: string;
		message?: string;
	}>;
	trust(url: string): Promise<void>;

	listModules?(): Promise<{ module: string; kind?: string; doc?: string }[]>;
	introspect(module: string): Promise<ModuleSchema>;
	resolve(module: string, version: Version): Promise<ResolveResult>;

	dispatch(
		target: string,
		version: Version,
		opts?: { context?: Ref[]; execution?: Ref; executionRef?: string }
	): Promise<{ executionRef: string }>;
	find(
		module: string,
		version: Version,
		opts?: { context?: Ref[]; executionRef?: string }
	): Promise<FindResult>;
	interrupt(executionRef: string): Promise<void>;
	runDetail?(executionRef: string): Promise<RunDetail>;
	runOutput?(
		executionRef: string,
		opts?: { offset?: number; tail?: number; limit?: number }
	): Promise<OutputChunk>;
	call(
		module: string,
		method: string,
		args: Record<string, unknown>,
		version: Version
	): Promise<unknown>;

	list(query?: CatalogQuery): Promise<CatalogPage>;
	setLabel?(uuid: string, label: string): Promise<void>;
	provenance(module: string, version: Version): Promise<ProvenanceRecord | null>;

	listSource?(): Promise<SourceFile[]>;
	readSource?(path: string): Promise<SourceContent>;
	widgetAssets?(module: string): Promise<WidgetAssets | null>;
	widgetModel?(module: string, version: Version): BoundWidgetModel;

	slots?: HostSlots;
}
