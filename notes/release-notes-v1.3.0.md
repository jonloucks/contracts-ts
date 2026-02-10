# @jonloucks/contracts-ts v1.3.0
```bash
npm install @jonloucks/contracts-ts@1.3.0
```

## Customer impact
*  New functional interface utilities are available in the auxiliary package.
*  `hasFunction()` now correctly validates property existence before function checks, reducing false positives.

## Forked Repositories Impact
*  None

## 🚀 New Features
*  Added functional interface utilities in auxiliary modules: Consumer, Predicate, Supplier, and Transform.
*  Added Functional barrel exports for functional interface types and helpers.

## ✨ Improvements
*   Performance: None
*   Compatibility: Improved `hasFunction()` behavior for mock objects and inherited properties.
*   Documentation: None
*   Tooling: Bumped `@typescript-eslint/eslint-plugin` to 8.55.0.

## 🐛 Bug Fixes
*  Fixed #118: `hasFunction()` now verifies property existence before checking function type.
*  Fixed functional interface guards and helpers to align with new Functional exports.

## ⬇️ Download

*   [NPM](https://www.npmjs.com/package/@jonloucks/contracts-ts/v/1.3.0)
*   [Source code (zip)](https://github.com/jonloucks/contracts-ts/archive/refs/tags/v1.3.0.zip)
*   [Source code (tar.gz)](https://github.com/jonloucks/contracts-ts/archive/refs/tags/v1.3.0.tar.gz)
