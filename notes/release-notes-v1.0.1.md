# @jonloucks/contracts-ts v1.0.1
```bash
npm install @jonloucks/contracts-ts@1.0.1
```

## Customer impact
*  **Breaking Change**: `Transform<I, O>` interface method signature changed from `transform(I: OptionalType<I>): OptionalType<O>` to `transform(input: I): O`
*  Version information now statically generated at build time instead of runtime parsing

## Forked Repositories Impact
*  Build process changes: `src/version.ts` is now a generated file

## 🚀 New Features

*  Added `TransformType<I, O>` union type for accepting either `Transform<I, O>` or `TransformFunction<I, O>`
*  Added `TransformFunction<I, O>` type alias for transformation functions
*  Added `isFunctionWithArity()` type guard for checking function arity
*  Automatic release notes generation from template

## ✨ Improvements

*   Performance: VERSION constant now statically compiled instead of runtime file parsing
*   Compatibility: `Transform` interface simplified - no longer handles optional types internally
*   Documentation: Improved JSDoc comments for type definitions

## 🐛 Bug Fixes
*  Fixed `Transform` interface parameter name from `I` to `input` for clarity
*  Improved error handling in version application script 

## ⬇️ Download

*   [NPM](https://www.npmjs.com/package/@jonloucks/contracts-ts/v/1.0.1)
*   [Source code (zip)](https://github.com/jonloucks/contracts-ts/archive/refs/tags/v1.0.1.zip)
*   [Source code (tar.gz)](https://github.com/jonloucks/contracts-ts/archive/refs/tags/v1.0.1.tar.gz)
