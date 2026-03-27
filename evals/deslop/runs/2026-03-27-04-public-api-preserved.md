# 2026-03-27 - 04 Public API Preserved

## Fixture

- `evals/deslop/fixtures/04-public-api-preserved`

## Result

- changed: `yes`

## Output Summary

Only `getRetryDelay` changed:

```ts
export function getRetryDelay(timeout: number, shouldDouble: boolean) {
  if (shouldDouble) return timeout * 2;
  return timeout;
}
```

`buildUserSummary` was correctly left alone, preserving:

- positional arguments
- tuple return shape
- exported API

## Rubric

- `behavior_preserved`: `pass`
- `api_preserved`: `pass`
- `slop_reduced`: `pass`
- `style_rule_following`: `pass`
- `unnecessary_churn`: `pass`

## Notes

- This confirms the current guidance is strong enough to stop object-param churn
  on exported functions during a style-only pass.
