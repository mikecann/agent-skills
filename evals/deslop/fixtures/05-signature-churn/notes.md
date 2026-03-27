# 05 Signature Churn

## Should Improve

- remove non-null assertions if that can be done without changing the public signature
- improve local clarity if possible

## Must Not Change

- exported TypeScript signatures should stay the same during a style-only pass
- do not narrow `any` to a more specific exported parameter type

## Watch For

- the model over-correcting typing issues by changing public signatures
- changing runtime behavior while trying to remove `!`
