# 2026-03-27 - 07 Mixed Typescript

## Fixture

- `evals/deslop/fixtures/07-mixed-typescript`

## Result

- changed: `yes`

## Output Summary

The eval handled the mixed file mostly well:

- flattened the nested `handle` function into guard clauses
- simplified `getRetryDelay`
- preserved the fixed error string in `processPaymentResult`
- preserved the tuple API of `getOrderSummary`
- preserved the exported `any` signature of `getCount`

Output excerpt:

```ts
export async function handle(orderId: string, shouldLog: boolean) {
  const order = await loadOrder(orderId);

  if (!order) return { ok: false, value: 0 };
  if (order.status !== "complete") return { ok: false, value: 0 };
  if (order.amount <= 0) return { ok: false, value: 0 };
  if (order.isRefunded) return { ok: false, value: 0 };

  if (shouldLog) console.log("Processing order", order.id);

  return {
    ok: true,
    value: order.amount,
  };
}
```

## Rubric

- `behavior_preserved`: `pass`
- `api_preserved`: `pass`
- `slop_reduced`: `pass`
- `style_rule_following`: `pass`
- `unnecessary_churn`: `pass`

## Notes

- This is a strong mixed-case pass.
- The agent resisted two common bad rewrites:
  - switching to `result.message`
  - converting the exported tuple helper to object params
