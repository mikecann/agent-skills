# 09 Multi File Batch

## Should Improve

- flatten nested control flow in `orderUtils.ts`
- remove the `!` in `getCount` without changing the exported signature
- simplify the React render flow in `UserPanel.tsx`
- remove `open`
- replace `&&` JSX with `? : null`
- remove `user!` by narrowing

## Must Not Change

- keep the fixed error string in `processPaymentResult`
- keep `handleRetry` hoisted because it is reused in two places
- keep exported function signatures stable
- keep `alreadyFine.ts` untouched

## Watch For

- rewriting already-clean files
- changing `processPaymentResult` to use `result.message`
- narrowing exported `any`
- blindly inlining reused handlers
- over-editing just because multiple files are present
