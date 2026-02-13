# @jonloucks/contracts-ts v2.0.0
```bash
npm install @jonloucks/contracts-ts@2.0.0
```

## Customer impact
*  **Breaking Change**: root package exports are now intentionally minimal (`CONTRACTS`, `createContract`, `createContracts`, core types, and `VERSION`)
*  **Breaking Change**: deprecated APIs removed as announced in prior releases
*  **Breaking Change**: package is now ESM-first (`"type": "module"`)

## Forked Repositories Impact
*  Forks importing broad barrel exports from `@jonloucks/contracts-ts` must migrate to `api/Convenience` or direct subpath imports
*  Forks using `api/Types` transform aliases must migrate to `auxiliary/Transform`

## 🚀 New Features

*  Consolidated convenience exports in `api/Convenience` and `auxiliary/Convenience`
*  Stronger API boundary between core root exports and convenience helpers

## ✨ Improvements

*   Performance: Leaner root export surface reduces unnecessary symbol exposure
*   Compatibility: Modernized module packaging with explicit ESM behavior
*   Documentation: Added release migration guidance for import-path changes

## 🐛 Bug Fixes
*  Fixed #126: moved barrel exports out of `index.ts` into `api/Convenience` to prevent broad/implicit root imports
*  Fixed #127: removed deprecated feature set scheduled for next major version
*  Fixed #128: completed package modernization by setting `"type": "module"`

## ✅ Issues Fixed

*  #126 - Move barrel exports from `index.ts` to `api/Convenience` (PR #131)
*  #127 - Remove deprecated features for major release (PR #130)
*  #128 - Complete ESM modernization with module package type (PR #129)

## 🧭 Upgrade Guide (v1.x → v2.0.0)

1. Update dependency

	```bash
	npm install @jonloucks/contracts-ts@2.0.0
	```

2. Migrate root imports to convenience or explicit subpaths

	- If you imported many symbols from `@jonloucks/contracts-ts`, move those imports to:
	  - `@jonloucks/contracts-ts/api/Convenience` (core convenience API)
	  - `@jonloucks/contracts-ts/auxiliary/Convenience` (auxiliary convenience API)
	  - or explicit subpaths under `api/*` and `auxiliary/*`

3. Migrate deprecated transform aliases from `api/Types`

	- Old (removed): `Transform`, `TransformFunction`, `TransformType`, `typeToTransform` from `@jonloucks/contracts-ts/api/Types`
	- New: import transform types/helpers from `@jonloucks/contracts-ts/auxiliary/Transform`

4. Remove usage of deleted auxiliary barrel

	- Old (removed): `@jonloucks/contracts-ts/auxiliary/Functional`
	- New: use `@jonloucks/contracts-ts/auxiliary/Convenience` or direct functional modules (`Consumer`, `Predicate`, `Supplier`, `Transform`)

5. Ensure your build/runtime is ESM-compatible

	- This package now declares `"type": "module"`; update consuming configs if they relied on CommonJS defaults.

## ⬇️ Download

*   [NPM](https://www.npmjs.com/package/@jonloucks/contracts-ts/v/2.0.0)
*   [Source code (zip)](https://github.com/jonloucks/contracts-ts/archive/refs/tags/v2.0.0.zip)
*   [Source code (tar.gz)](https://github.com/jonloucks/contracts-ts/archive/refs/tags/v2.0.0.tar.gz)
