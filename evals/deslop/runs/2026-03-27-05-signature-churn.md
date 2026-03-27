# 2026-03-27 - 05 Signature Churn

## Fixture

- `evals/deslop/fixtures/05-signature-churn`

## Result

- changed: `yes`

## Output Summary

The eval kept the exported signatures as:

- `export function getCount(result: any)`
- `export function getSummary(result: any)`

That is good and directly addresses the signature-churn problem we saw in the
earlier temp evals.

It rewrote the file to:

```ts
export function getCount(result: any) {
  if (!result.items)
    throw new TypeError("Cannot read properties of undefined (reading 'length')");
  return result.items.length;
}

export function getSummary(result: any) {
  if (!result.ok) return null;
  return result.value;
}
```

## Rubric

- `behavior_preserved`: `partial`
- `api_preserved`: `pass`
- `slop_reduced`: `pass`
- `style_rule_following`: `pass`
- `unnecessary_churn`: `partial`

## Notes

- This run shows the new guidance successfully stopped the model from changing
  exported TypeScript signatures.
- It still exposed a weaker spot in the style guide:
  `if (!result.items)` is not behavior-preserving for all possible `any` inputs.
- The `getSummary` rewrite is probably harmless, but it is also a good example
  of low-value churn on code that was already quite clear.

## Follow-up

This fixture should stay in the suite because it catches a real tension between:

- removing `!`
- preserving runtime behavior
- avoiding pointless stylistic rewrites
