# Config identity

How [identity & dedup](/guide/identity) works is in the guide. This note records why it
is built the way it is, and specifically why identity hashes a canonical normal form of
the configuration rather than the configuration itself.

## The problem with hashing the resolved config

An earlier design hashed the fully-resolved configuration. Two failures followed:

1. **Schema evolution.** Add a field with a default, or rename one, and every prior
   record's resolved config shifts, so its hash shifts, and `get(...)` no longer finds
   it. Records silently disappeared whenever a `Config` changed.
2. **Volatile location.** An interface computing over an external blob it doesn't own
   got a different identity per data URI (`file://` on the rig, `s3://` on the
   cluster), so moving the data spuriously recomputed.

Both are the same mistake: identity was computed over the materialized object,
incidental detail included.

## Borrowing from content-addressed languages

The fix follows how content-addressed systems handle this:

- **Dhall** hashes the αβ-normal form. It evaluates and canonicalizes, so equivalent
  expressions hash identically regardless of how they're written. Hash a normal form,
  not syntax.
- **dCBOR / protobuf** omit default values from the canonical form; a field at its
  default is indistinguishable from an absent one. A default contributes nothing to
  identity.
- **Unison** content-addresses code structure and keeps names as separate, migratable
  metadata, so renames never break references. Address a stable essence; keep mutable
  presentation (names, URIs, labels) separate.

## The canonical normal form

Identity is `hash(module + canonical(config))`, where `canonical` is: evaluate (expand
`~versions` and config methods), strip non-identifying fields
(`Field(identifying=False)`), recursively drop keys equal to their default (descending
into nested models), then serialize as sorted, compact JSON. pydantic's coercion does
the numeric folding (`1` ≡ `1.0`) upstream, so no separate pass is needed.

The payoffs map back to the failures:

- **Version spelling is UX, not identity.** Two spellings that evaluate to the same
  config share an identity. The version layer is how you dial in a config; it can be
  renamed or restructured while the underlying research stays stable.
- **Schema evolution is safe.** Adding a config field with a default leaves prior
  records' canonical form unchanged, so they remain reachable.
- **Volatile location is solved** by letting a field leave identity
  (`Field(identifying=False)`) while a content predicate (`predicate_from_manifest`)
  re-identifies the data by a stable id.

## References, not by-value

Complex or environment-dependent things (a factory, a dtype map, another interface)
enter the canonical form by reference (the `(module, version)` element form), never by
value. A reference identifies by name + args, not by the behavior of the referenced
code. This is the Unison caveat: rename is safe, repointing is invisible, so use a
predicate if you need behavior-identity. Hashing arbitrary objects by value is exactly
the fragility the canonical design avoids.

## Matching follows identity

The lookup path (`find`/`singleton`) matches on the same canonical `identity_key`, not
on the literal version, so a record stored under one spelling is found by any
equivalent spelling. The dedup tuple is `(parent_id, identity_key, predicate_key)`;
relations never affect it.
