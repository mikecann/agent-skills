# 2026-03-27 - 03 React Inline Handler

## Fixture

- `evals/deslop/fixtures/03-react-inline-handler`

## Result

- changed: `yes`

## Output Summary

The eval:

- added an early return for `!user`
- removed the one-off hoisted handler
- replaced `&&` JSX with `? : null`
- removed `user!` by narrowing
- removed the redundant `open` alias

Output:

```tsx
export function UserPanel({ user, hasError }: Props) {
  if (!user) return <div>No user</div>;

  return (
    <div>
      {hasError ? (
        <ErrorBanner
          onRetry={() => {
            saveDraft({ userName: user.name })
              .then(() => toast.success("Saved"))
              .catch(() => toast.error("Failed"));
          }}
        />
      ) : null}
      <div>{user.name}</div>
    </div>
  );
}
```

## Rubric

- `behavior_preserved`: `pass`
- `api_preserved`: `pass`
- `slop_reduced`: `pass`
- `style_rule_following`: `pass`
- `unnecessary_churn`: `pass`

## Notes

- This is a good example of the React rules being applied in the intended way.
- The inline handler rule worked because the handler was genuinely one-off.
