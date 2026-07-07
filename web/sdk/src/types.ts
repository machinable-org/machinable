// ── machinable Widget SDK — host-agnostic contract (v2) ─────────────────────────────
// This folder is the UPSTREAM artifact: it must NOT import anything from captu ($lib/*).
// It depends only on this interface, the anywidget model contract, and web APIs, so it can
// be lifted into machinable and served verbatim (GET /widget-sdk.js). The host (captu now,
// machinable's default adapter later) supplies a `WidgetHostAdapter` at mount.
// See docs/machinable-widget-sdk.md §3/§4 and docs/machinable-widget-implementation-plan.md.

// ── Config schema (recursive over the pydantic type space) ──────────────────────────
// The server reflects `type` as a flat Python annotation string (api/models.py
// ConfigField.type = str(field.annotation)); hosts parse it into this tree via
// `parseAnnotation` (introspection.ts). Nested pydantic models arrive without field
// structure and degrade to `object`/`unknown` until upstream reflection lands.

export type FieldType =
	| { kind: 'str' }
	| { kind: 'int' }
	| { kind: 'float' }
	| { kind: 'bool' }
	/** A fixed option set (Literal / Enum). */
	| { kind: 'enum'; options: (string | number)[] }
	/** `T | None` — value may be unset (renders the italic None + "set value"). */
	| { kind: 'optional'; inner: FieldType }
	| { kind: 'list'; item: FieldType }
	/** A sub-config. `fields` when the structure is known; `open` ⇒ a free-form dict
	 * that accepts arbitrary keys (fields, when present, are the known ones). */
	| { kind: 'object'; fields?: ConfigField[]; open?: boolean }
	/** Unparseable/unreflected annotation → the raw key=value fallback renderer. */
	| { kind: 'unknown'; annotation?: string };

export interface ConfigField {
	key: string;
	type: FieldType;
	default?: unknown;
	/** True when the field has no default (must be provided before launch). */
	required?: boolean;
	doc?: string;
	/** Host-provided renderer hint (the field-renderer slot, §6) — e.g. 'recording_uri'
	 * so captu can inject a recording picker; the SDK falls back to the typed default. */
	slot?: string;
}

// ── Version — the ordered composition that IS a run's identity ───────────────────────
/** One element of a compact version: a `~token` string (e.g. "~precise(iters=500)") or a
 * config-override dict. Order is significant — this list is what the CLI renders. */
export type VersionElement = string | Record<string, unknown>;
export type Version = VersionElement[];

/** A `version_<name>` method (~token) with its callable surface. `params` is parsed from
 * the server's signature string (see `parseSignature`). */
export interface VersionMethodParam {
	name: string;
	type?: FieldType;
	default?: unknown;
}
export interface VersionMethod {
	/** Token name — used as `~name` in a version list. */
	name: string;
	doc?: string;
	/** The raw signature string from the server, e.g. "(iters: int = 200)". */
	signature?: string;
	params: VersionMethodParam[];
	sourceRef?: SourceRef;
}

/** A pointer into project source — where a symbol (interface, ~token, accessor) is
 * defined. Feeds the "view source" jumps (D6). */
export interface SourceRef {
	path: string;
	line?: number;
	symbol?: string;
}

export interface ModuleSchema {
	module: string;
	/** Interface kind (Interface | Execution | Scope | …). */
	kind?: string;
	title?: string;
	/** The class docstring. */
	doc?: string;
	fields: ConfigField[];
	/** The ~token vocabulary. */
	versionMethods: VersionMethod[];
	sourceRef?: SourceRef;
}

// ── Resolve — the live dry-run (version → resolved config + CLI + identity) ──────────
export interface ResolveIssue {
	/** Dotted config path the issue attaches to (e.g. "alpha", "params.tol"), when known. */
	path?: string;
	message: string;
}

/** Mirrors machinable `POST /v1/interfaces/resolve`. On failure the issues render inline
 * (field-attached when `path` is known) and Launch is disabled. `identity` is a short
 * display hash of the content predicate (the "#a3f9c2e1" chip). */
export type ResolveResult =
	| {
			ok: true;
			config: Record<string, unknown>;
			cli: string;
			predicate?: Record<string, unknown>;
			identity?: string;
	  }
	| { ok: false; issues: ResolveIssue[] };

// ── Lifecycle ────────────────────────────────────────────────────────────────────────
/** `interrupted` is a client-side flavor of failed (set after a successful interrupt);
 * the server reports draft | running | cached | failed. */
export type InterfaceStatus = 'draft' | 'running' | 'cached' | 'failed' | 'interrupted';

/** A uniform interface reference — module path + compact version (everything is an
 * interface: the Execution container and each `with`-context are also refs). */
export interface Ref {
	target: string;
	version?: Version;
}

export interface FindResult {
	status: InterfaceStatus;
	/** The latest run instance backing a running/cached/failed status, if any. */
	executionRef?: string;
	/** The materialized interface uuid, when the config has been created. */
	uuid?: string;
}

/** One run instance's inspectable record (timestamps ISO-8601, from the server). */
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

/** A bounded byte-window of a run's output log — logs can be huge, so clients
 * request a `tail` first and then poll `offset=size` for appended bytes only. */
export interface OutputChunk {
	/** The window's text, or null when no output exists yet. */
	output: string | null;
	/** Byte position where the window starts (>0 ⇒ earlier output exists). */
	offset: number;
	/** Total log size in bytes — the next poll's `offset`. */
	size: number;
}

// ── Catalog (browse/search over past runs) ──────────────────────────────────────────
export type FacetOp = 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'contains';
/** One operator clause over a config json path — mirrors machinable ConfigFilter. */
export interface Facet {
	path: string;
	op: FacetOp;
	value: unknown;
}
export interface CatalogSort {
	/** Index column (created_at_ns, label, …) or a config json path with configPath. */
	by: string;
	direction?: 'asc' | 'desc';
	configPath?: boolean;
}
export interface CatalogQuery {
	/** Free-text over labels (host maps to a `label contains` filter). */
	text?: string;
	module?: string;
	facets?: Facet[];
	sort?: CatalogSort;
	limit?: number;
	offset?: number;
}

/** One content-addressed identity in the catalog (possibly with several executions). */
export interface RunRecord {
	uuid: string;
	module: string;
	/** The resolved configuration (for the identifying-fields summary). */
	config: Record<string, unknown>;
	/** The compact version when known — what "Open" reconstructs. */
	version?: Version;
	/** Short display hash of the content identity. */
	identity?: string;
	executionRef?: string;
	status: InterfaceStatus;
	/** The mutable human label (renameable via setLabel). */
	label?: string;
	/** Creation time (ms since epoch). */
	createdAt?: number;
	creator?: string;
	/** Number of executions recorded for this identity. */
	runCount?: number;
	/** Code state of the latest run, when known. */
	manifest?: { commit: string; dirty?: boolean };
}
export interface CatalogPage {
	items: RunRecord[];
	total: number;
}

// ── Provenance ───────────────────────────────────────────────────────────────────────
/** One node in a provenance graph. `attributes` is the per-kind open facet: an interface
 * carries `config_layers` + `context`, an Execution seed/timing, a Manifest code state. */
export interface ProvenanceNode {
	uuid: string;
	kind: string;
	module?: string;
	version: Version;
	label?: string;
	attributes: Record<string, unknown>;
}

/** A typed, directed edge between provenance nodes (rel ∈ derivation | context | uses |
 * runs | manifest | …). */
export interface ProvenanceEdge {
	source: string;
	target: string;
	rel: string;
}

/** A run's provenance as a normalized node-link DAG (machinable `ProvenanceGraph`): how a
 * result came to be — recipe (config layers / context / derivation) ⊕ history (executions,
 * each with the Manifest it ran under). `root` is the queried interface's uuid; shared nodes
 * appear once and are referenced by many edges. `truncated` when a depth/node cap bounded it. */
export interface ProvenanceRecord {
	root: string;
	nodes: ProvenanceNode[];
	links: ProvenanceEdge[];
	truncated: boolean;
}

// ── Source (code inspection, D6) ─────────────────────────────────────────────────────
export interface SourceFile {
	path: string;
	module?: string;
	size?: number;
}
export interface SourceContent {
	path: string;
	content: string;
	/** Display language hint ("python" | "javascript" | …), derived from the path. */
	language?: string;
	etag?: string;
}

// ── Slots (host-supplied powers, §6) ─────────────────────────────────────────────────
/** Host slot injection points. Values are host-framework components (opaque to the SDK
 * contract); every slot has an SDK default when absent. */
export interface HostSlots {
	/** Per-field renderer override keyed by `ConfigField.slot` (e.g. a captu
	 * recording_uri picker). Absent ⇒ the SDK uses its generic typed renderer. */
	fields?: Record<string, unknown>;
	/** Renders the opaque result (mounted on the field-dark result area). Absent ⇒ the
	 * SDK's "result ready · raw JSON" fallback. */
	result?: unknown;
}

/**
 * The seam every SDK piece is pure over. captu implements it against its host (Tauri →
 * machinable HTTP); a bare machinable project ships a default flat implementation.
 */
export interface WidgetHostAdapter {
	// ── connection (the shell) ──────────────────────────────────────────────────
	/**
	 * Connect to a machinable server. Returns the discoverable interface modules on success;
	 * `needsTrust` when the host requires the user to trust the URL first (then call `trust`
	 * and retry, or connect read-only). A standalone/in-process machinable connects
	 * immediately. `readOnly` connections may introspect + browse but not run host widgets.
	 */
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
		/** On failure, the reason (probe message / exception) — for diagnostics. */
		message?: string;
	}>;
	/** Trust a server URL (host security gate), so a subsequent `connect` proceeds. */
	trust(url: string): Promise<void>;

	// ── introspection (config editor) ───────────────────────────────────────────
	/** Discoverable modules with display metadata (kind, docstring) — feeds the
	 * module picker. Optional; hosts without it fall back to connect()'s names. */
	listModules?(): Promise<{ module: string; kind?: string; doc?: string }[]>;
	introspect(module: string): Promise<ModuleSchema>;
	/** Live dry-run: compact version → resolved config + CLI + predicate/identity, or
	 * structured issues (renders inline; Launch disabled). */
	resolve(module: string, version: Version): Promise<ResolveResult>;

	// ── lifecycle (Job/Call) ────────────────────────────────────────────────────
	/**
	 * Dispatch `target(version)` into an Execution, under an ordered `context` stack of
	 * arbitrary interfaces (entered as `with`; Scope is one kind — order significant). The
	 * connection-model launch (§12). Plain `dispatch(target, version)` is the no-context case.
	 */
	dispatch(
		target: string,
		version: Version,
		opts?: { context?: Ref[]; execution?: Ref; executionRef?: string }
	): Promise<{ executionRef: string }>;
	/**
	 * Content-addressed lifecycle lookup — is THIS version (under this context) already
	 * computed? `context` must match what it was/will be dispatched under so a scoped
	 * config resolves to its scoped identity.
	 */
	find(
		module: string,
		version: Version,
		opts?: { context?: Ref[]; executionRef?: string }
	): Promise<FindResult>;
	/** Best-effort cancel of a running interface's run instance. */
	interrupt(executionRef: string): Promise<void>;
	/** Inspect a run instance: nickname, seed, timestamps, liveness. Optional —
	 * hosts without it hide the run panel. */
	runDetail?(executionRef: string): Promise<RunDetail>;
	/** A bounded window of the run's output log (see `OutputChunk`) — never the
	 * whole file. `tail` reads the last N bytes; `offset` reads forward. */
	runOutput?(
		executionRef: string,
		opts?: { offset?: number; tail?: number; limit?: number }
	): Promise<OutputChunk>;
	/** Synchronous method call on a (possibly cached) interface — the Call primitive. */
	call(
		module: string,
		method: string,
		args: Record<string, unknown>,
		version: Version
	): Promise<unknown>;

	// ── catalog + provenance ────────────────────────────────────────────────────
	/** Search past runs — config facets (eq/range/…), sort, pagination. */
	list(query?: CatalogQuery): Promise<CatalogPage>;
	/** Rename an identity's mutable label (PATCH /v1/interfaces/{uuid}/label). */
	setLabel?(uuid: string, label: string): Promise<void>;
	/** Reproducible spec for a version, or null when it has no materialized run yet. */
	provenance(module: string, version: Version): Promise<ProvenanceRecord | null>;

	// ── source (code inspection; optional — hosts without the source API omit) ──
	listSource?(): Promise<SourceFile[]>;
	readSource?(path: string): Promise<SourceContent>;

	// ── slots ───────────────────────────────────────────────────────────────────
	slots?: HostSlots;
}
