# 2026-03-27 - 02 Union Behavior Preserved

## Fixture

- `evals/deslop/fixtures/02-union-behavior-preserved`

## Result

- changed: `yes`

## Output Summary

The eval added a local `exhaustiveCheck()` helper and rewrote the function to
handle both union members explicitly:

```ts
function exhaustiveCheck(param: never): never {
  throw new Error(`Exhaustive check failed: ${param}`);
}

export function getMessage(result: Result) {
  if (result.kind === "success") return result.value;
  if (result.kind === "error") return "Something went wrong";
  return exhaustiveCheck(result);
}
```

This preserved:

- the fixed error string
- the exported function signature
- the runtime behavior for the current union members

## Rubric

- `behavior_preserved`: `pass`
- `api_preserved`: `pass`
- `slop_reduced`: `pass`
- `style_rule_following`: `pass`
- `unnecessary_churn`: `pass`

## Notes

- This is a good example of a valid non-trivial cleanup that does not change
  behavior.
- It also confirms the recent guidance update worked: the eval did not switch
  to `result.message`.
- There is still a judgment call here about whether the original version was
  already clean enough to leave alone, but this output is acceptable.
