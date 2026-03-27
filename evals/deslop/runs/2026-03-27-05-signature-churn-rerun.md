# 2026-03-27 - 05 Signature Churn Rerun

## Fixture

- `evals/deslop/fixtures/05-signature-churn`

## Result

- changed: `yes`

## Output Summary

After the guidance update, the eval made the minimal intended change:

```ts
export function getCount(result: any) {
  return result.items.length;
}

export function getSummary(result: any) {
  if (result.ok) return result.value;
  return null;
}
```

That is better than the earlier run because:

- it removed the unnecessary `!`
- it preserved the exported `any` signature
- it preserved runtime behavior
- it did not add extra runtime checks
- it left `getSummary` alone instead of restyling it for no real gain

## Rubric

- `behavior_preserved`: `pass`
- `api_preserved`: `pass`
- `slop_reduced`: `pass`
- `style_rule_following`: `pass`
- `unnecessary_churn`: `pass`

## Notes

- This rerun confirms the updated non-null-assertion guidance is better than the
  previous version.
- The old guidance nudged the model toward heavier edits.
- The new guidance nudges it toward the smallest safe TypeScript cleanup.
