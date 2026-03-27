# 07 Mixed Typescript

## Should Improve

- flatten the deeply nested `handle` function
- remove redundant `let` usage in `getRetryDelay`
- remove the non-null assertion in `getCount` without changing the exported signature
- make union handling in `processPaymentResult` more explicit only if it stays low-noise

## Must Not Change

- the exported function names
- the exported function signatures
- the tuple return shape of `getOrderSummary`
- the fixed error string in `processPaymentResult`
- runtime behavior of the success path in `handle`

## Watch For

- changing `processPaymentResult` to return `result.message`
- narrowing `result: any` in `getCount`
- converting `getOrderSummary` to object params
- over-refactoring into too many tiny helpers
