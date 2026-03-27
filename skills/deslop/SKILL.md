---
name: deslop
description: Runs a second-pass cleanup over AI-written code using the repo's style guide in style.md. Prefers parallel subagents to simplify recently modified files without changing behavior. Use when the user says "deslop", "clean this up", "make this less AI", "apply my style guide", "second pass", or asks to simplify generated code after implementation.
---

# Deslop

Take code that was just written and make it feel tighter, simpler, and more deliberate.

Read [style.md](style.md) first. That file is the source of truth for the style rules.

## Process

1. Identify the target files.
   - Start with files modified in this session.
   - Use `git diff` if available, otherwise use recent edits or the user's explicit file list.
   - Do not touch unrelated files.
2. Read each target file before editing it.
3. Use parallel subagents for the cleanup pass.
   - If there are multiple files, split them across subagents.
   - If there is one large file, it is still fine to use one subagent for an isolated second pass.
   - Give each subagent the exact file list it owns.
   - If the scope is only one to three small files, a single pass is fine. Do not add subagent overhead just to satisfy the rule mechanically.
4. Tell each subagent to:
   - read `skills/deslop/style.md`
   - simplify only its assigned files
   - preserve behavior exactly
   - skip any change that adds churn without making the code clearer
   - report a short summary of what changed and what was intentionally skipped
5. Review the subagent output, apply the changes, then do a final sanity pass yourself.
6. Summarise the cleanup in concrete terms.
   - Example: "flattened 3 nested conditionals, renamed 2 booleans, replaced 1 non-null assertion"

## Constraints

- Never change behavior. This is a style pass, not a refactor.
- If a style rule conflicts with preserving behavior, preserving behavior wins.
- Prefer small, local edits over wide rewrites.
- If the code only becomes meaningfully cleaner after a deeper architectural refactor, stop and say so instead of forcing deslop beyond its scope.
- Skip generated files, vendor code, build output, and lockfiles.
- Skip tests unless the user asked to include them.
- Skip any rule when applying it would make the code harder to read.
- Preserve exported and public APIs unless the user explicitly asked for API changes.
- Preserve exported TypeScript signatures unless the user explicitly asked for typing or API changes.
- If the code is already clean, say that instead of forcing changes.

## What To Look For First

- Guard clauses instead of nested conditionals
- `if` plus early return instead of `else`
- `const` instead of `let` when there is no reassignment
- narrowing or direct removal instead of `!` non-null assertions
- `Boolean(value)` or explicit comparisons instead of `!!value`
- clearer boolean names like `isOpen`, `hasItems`, `canRetry`
- shorter functions with one clear job
- smaller orchestration functions with extracted helpers
- query/data gathering separated from action/side effects
- function names that describe side effects honestly
- overloaded hooks or components split with small pure helpers
- object parameters instead of long positional argument lists
- exhaustive handling for discriminated unions
- React render branches flattened with early returns
- inline JSX handlers when the logic is only used once
- keep handlers hoisted when they are reused in multiple places

## Bad vs good

```ts
// Bad: nested control flow and unnecessary else
function getLabel(user?: User) {
  if (user) {
    if (user.name) {
      return user.name;
    } else {
      return "Anonymous";
    }
  } else {
    return "Anonymous";
  }
}

// Good: early returns, flat flow
function getLabel(user?: User) {
  if (!user?.name) return "Anonymous";
  return user.name;
}
```

```tsx
// Bad: hoisted one-off handler and && render
const handleClick = () => doSave();
return hasError && <ErrorBanner onRetry={handleClick} />;

// Good: inline simple handler and explicit null branch
return hasError ? <ErrorBanner onRetry={() => doSave()} /> : null;
```

## Checklist

- [ ] `style.md` was read first
- [ ] only relevant files were touched
- [ ] cleanup used subagents where it helped
- [ ] behavior was preserved
- [ ] skipped changes were intentional
- [ ] final summary explains what changed
