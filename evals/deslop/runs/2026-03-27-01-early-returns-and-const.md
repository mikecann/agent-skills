# 2026-03-27 - 01 Early Returns And Const

## Fixture

- `evals/deslop/fixtures/01-early-returns-and-const`

## Result

- changed: `yes`

## Output Summary

The eval flattened the nested `if`/`else` structure into guard clauses and
removed the temporary `let`.

Output:

```ts
export function getDisplayLabel(user: User | null) {
  if (!user) return "Anonymous";
  if (!user.isVerified) return "Anonymous";
  if (user.age < 18) return "Anonymous";
  if (user.preferredName) return user.preferredName;
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  return "Anonymous";
}
```

## Rubric

- `behavior_preserved`: `pass`
- `api_preserved`: `pass`
- `slop_reduced`: `pass`
- `style_rule_following`: `pass`
- `unnecessary_churn`: `pass`

## Notes

- This is a clean success case for the core deslop behavior.
- No unnecessary helper extraction was introduced.
