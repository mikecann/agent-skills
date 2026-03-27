# Deslop Style Rules

Use this file as an execution guide, not just a list of preferences.

## Hard Constraints

- Do not change behavior.
- If two style rules conflict, preserving behavior wins.
- Prefer the smallest change that clearly improves readability.
- Do not rewrite already-clear code just to satisfy a rule.
- Skip a rule if applying it would make the code harder to understand.
- Preserve public APIs unless the user explicitly asked for broader refactoring.
- Preserve exported TypeScript function signatures unless the user explicitly asked for API or typing changes.
- If the real fix is architectural rather than stylistic, stop and surface that instead of forcing a pseudo-cleanup.
- Prefer self-documenting code over explanatory comments.

## Apply In This Order

1. Flatten control flow.
2. Rename misleading symbols.
3. Split oversized functions.
4. Separate query/data gathering from action/side effects.
5. Apply TypeScript-specific rules if relevant.
6. Apply React-specific rules if relevant.
7. Stop when further edits would just be churn.

## First Pass Checks

Apply these first because they are the most common AI slop patterns:

- Replace nested conditionals with guard clauses and early returns.
- Remove `else` blocks that follow a `return`, `throw`, or other early exit.
- Change `let` to `const` when there is no reassignment.
- Replace `!!value` with `Boolean(value)` or an explicit comparison.
- Replace `value!` non-null assertions with safer typing or narrowing.
- Remove braces from single-line `if`, `return`, or `throw` when readability improves.
- Rename vague or misleading names.

Example:

```ts
// Bad: nested flow, else after return, unnecessary let
function getStatus(user?: User) {
  let status = "inactive";

  if (user) {
    if (user.isActive) {
      status = "active";
    } else {
      status = "inactive";
    }
  } else {
    status = "inactive";
  }

  return status;
}

// Good: flat flow, const, early returns
function getStatus(user?: User) {
  if (!user?.isActive) return "inactive";
  return "active";
}
```

## Core Design Rules

- Prefer short, focused functions, roughly 20 lines or fewer.
- Break large functions into smaller, self-contained helpers with descriptive names.
- Prefer small orchestration functions that read like a list of steps.
- When one hook, component, or module starts owning multiple concerns, extract the smallest helpful helpers first.
- Split large files into smaller modules by concern when that makes the code easier to scan.
- Use whitespace to separate meaningful chunks of logic.
- Use comments sparingly. If a comment explains confusing code, prefer simplifying the code.
- If a comment is still useful, place it above a meaningful chunk rather than narrating each line.
- Do not trust comments blindly. They can go stale.

## Naming Rules

- Prefer verbose, self-documenting names over abbreviated names.
- Boolean names should start with `is`, `has`, `can`, or `should`.
- Function names should be verb phrases.
- Data structures and types should be nouns.
- Name functions after what they actually do.
- If a function has a side effect, the name should make that obvious.
- Long-lived values should usually have descriptive names.
- Very short-lived variables can have shorter names when the scope is tiny and obvious.
- Add unit suffixes when a numeric value has a real-world unit.
- Use time suffixes consistently, for example `createdAt`, `updatedAt`, `timeoutMs`, `elapsedMs`.

Example:

```ts
// Bad: vague names and hidden side effect
function handle(data: FormData) {
  return save(data);
}

const open = modalState === "open";

// Good: names describe intent and behavior
function saveForm(data: FormData) {
  return save(data);
}

const isOpen = modalState === "open";
```

```ts
// Bad: abbreviated long-lived names and missing units
const x = fetchUserSettings();
const timeout = 5000;
const width = 320;

// Good: descriptive names and explicit units
const currentUserSettings = fetchUserSettings();
const timeoutMs = 5000;
const imageWidthPx = 320;
```

## Naming Patterns

Use these patterns when they match the behavior. Prefer consistency over cleverness.

- `findX` returns `X | null` or `X | undefined`.
- `getX` returns `X` and should usually throw or otherwise fail if `X` is missing.
- `listX` returns an array.
- `createX` creates a new entity.
- `updateX` updates an existing entity.
- `fetchX` is usually for external APIs or network calls.
- `parseX` converts raw input into structured data.
- `handleX` is for event handlers or callback entry points.
- `isX`, `hasX`, and `canX` return booleans.
- `my` can be used to mean "for the current authenticated user" when that convention already exists in the codebase.

Examples:

```ts
// Bad: names hide return shape and behavior
async function user(id: string) {
  return db.get(id);
}

async function posts() {
  return db.query("posts").collect();
}

// Good: names describe behavior
async function findUserById(id: string) {
  return db.get(id); // may be null
}

async function listPosts() {
  return db.query("posts").collect();
}
```

```ts
// Good: "get" means not-null
async function getUserById(id: string) {
  const user = await findUserById(id);
  if (!user) throw new Error(`Could not get user with id '${id}'`);
  return user;
}
```

## Function Design Rules

- Prefer flat control flow using early exits over deep nesting.
- Prefer `if` plus early return over `switch` when it keeps the flow clearer.
- Separate "determine something" functions from "do something" functions when practical.
- If one function both decides and acts, consider splitting it.
- If a function name hides a side effect, rename it or extract the side effect.
- In large functions or hooks, extract pure helpers for derived values, labels, filtering, sorting, or mapping before extracting new stateful units.
- Use destructured object parameters when a function takes several related inputs.
- Return an object when returning multiple values.
- Use array methods like `map`, `filter`, and `reduce` when they improve clarity.
- If a local `let` only exists to compute one final value, prefer a `const` plus early returns.
- If that computation needs a small scoped block, it is fine to use an IIFE instead of a mutable accumulator.

Examples:

```ts
// Bad: function both determines status and performs the side effect
async function checkOrder(orderId: string) {
  const order = await loadOrder(orderId);

  if (!order) {
    logger.error("Order missing");
    return "missing";
  }

  return "found";
}

// Good: query separated from side effect
async function determineOrderStatus(orderId: string) {
  const order = await loadOrder(orderId);
  if (!order) return "missing" as const;
  return "found" as const;
}

async function checkOrderAndLog(orderId: string) {
  const status = await determineOrderStatus(orderId);
  if (status === "missing") logger.error("Order missing");
  return status;
}
```

```ts
// Bad: one hook owns filtering, searching, sorting, and labels inline
const visibleItems = useMemo(() => {
  const filtered = items.filter((item) => item.status === filter);
  if (!query) return filtered;
  return filtered.filter((item) => item.title.includes(query));
}, [items, filter, query]);

const summary = `Showing ${filter} items for ${query || "all queries"}`;

// Good: extract the pure helpers, keep the hook API the same
const visibleItems = useMemo(
  () => getVisibleItems({ items, filter, query }),
  [items, filter, query],
);

const summary = getSummaryLabel({ filter, query });
```

```ts
// Bad: positional params and tuple return
function buildUser(id: string, name: string, isAdmin: boolean) {
  return [id, `${name}-${isAdmin ? "admin" : "user"}`] as const;
}

// Good: object params and object return
function buildUserLabel({
  id,
  name,
  isAdmin,
}: {
  id: string;
  name: string;
  isAdmin: boolean;
}) {
  return {
    id,
    label: `${name}-${isAdmin ? "admin" : "user"}`,
  };
}
```

## TypeScript Rules

Only apply this section in TypeScript code.

- Avoid `any`. Prefer inference and narrowing.
- Model variants with discriminated unions using the field name `kind`.
- Handle discriminated unions exhaustively.
- When making union handling exhaustive, preserve the existing behavior of each branch.
- Prefer narrowing or removing `!` directly over adding new runtime checks.
- Add an explicit runtime check only when it is needed for correctness or typing and still preserves behavior.
- Use an `exhaustiveCheck()` helper when it improves certainty and readability.
- Throw informative errors with useful context, not generic messages.
- Prefer inference by default. Add explicit annotations when they make the code clearer or avoid type complexity later.
- Avoid changing exported or public-facing function signatures just to satisfy a typing preference.
- If removing `any` would require a public signature change, prefer leaving it alone during a deslop pass.

Example:

```ts
export function exhaustiveCheck(param: never): never {
  throw new Error(`Exhaustive check failed: ${param}`);
}
```

For local value computation, this helper is also available:

```ts
export const iife = <T>(fn: () => T): T => fn();
```

Use it sparingly, only when it helps remove a temporary `let` and keeps the control
flow clearer.

Example:

```ts
// Bad: mutable accumulator
let label: string;

if (!user)
  label = "Anonymous";
else if (!user.name)
  label = "Anonymous";
else
  label = user.name;

// Good: const plus early returns
const label = iife(() => {
  if (!user) return "Anonymous";
  if (!user.name) return "Anonymous";
  return user.name;
});
```

```ts
// Bad: non-null assertion and any
function getCount(result: any) {
  return result.items!.length;
}

// Good: preserve the public signature and runtime behavior
function getCount(result: any) {
  return result.items.length;
}
```

```ts
// Bad: non-null assertion where control-flow narrowing is available
function getUserName(user: User | null) {
  if (!user) return "Anonymous";
  return user!.name;
}

// Good: use narrowing, no runtime change needed
function getUserName(user: User | null) {
  if (!user) return "Anonymous";
  return user.name;
}
```

```ts
// Bad: non-exhaustive union handling
function getMessage(result: Result) {
  if (result.kind === "success") return result.value;
  return "Something went wrong";
}

// Good: exhaustive handling with preserved behavior
function getMessage(result: Result) {
  if (result.kind === "success") return result.value;
  if (result.kind === "error") return "Something went wrong";
  return exhaustiveCheck(result);
}
```

## React Rules

Only apply this section in React or TSX files.

- Keep one component per file.
- Name the file after the component when the file primarily exports one component.
- Keep components roughly 150 lines or fewer when practical.
- Extract subcomponents for distinct concerns.
- Use early returns in render logic.
- Prefer `condition ? <Thing /> : null` over `condition && <Thing />`.
- Use inline event handlers when the logic is simple and only used once.
- Only hoist handlers or use `useCallback` when the handler is reused or referential stability is a measured issue.
- Create helper functions only when the logic is reused.
- In larger components, extract static maps and pure label builders when they reduce render noise.
- Use React context to avoid prop drilling when that makes the tree easier to follow.
- Push data fetching and mutations down into leaf app-specific components when that makes the component tree easier to follow.
- Prefer fluent promises inline in mutation handlers when the logic is local and one-off.
- Use optimistic updates where appropriate.

Examples:

```tsx
// Bad: nested render flow
export function UserPanel({ user }: { user: User | null }) {
  if (user) {
    return <div>{user.name}</div>;
  } else {
    return <EmptyState />;
  }
}

// Good: early return in render
export function UserPanel({ user }: { user: User | null }) {
  if (!user) return <EmptyState />;
  return <div>{user.name}</div>;
}
```

```tsx
// Bad: hoisted one-off handler
export function SaveButton() {
  const handleClick = () => {
    saveDraft()
      .then(() => toast.success("Saved"))
      .catch(() => toast.error("Failed"));
  };

  return <button onClick={handleClick}>Save</button>;
}

// Good: inline one-off handler
export function SaveButton() {
  return (
    <button
      onClick={() => {
        saveDraft()
          .then(() => toast.success("Saved"))
          .catch(() => toast.error("Failed"));
      }}
    >
      Save
    </button>
  );
}
```

```tsx
// Good: keep a shared handler hoisted when reused
export function RetryPanel({ hasError }: { hasError: boolean }) {
  const handleRetry = () => {
    saveDraft()
      .then(() => toast.success("Saved"))
      .catch(() => toast.error("Failed"));
  };

  return hasError ? (
    <>
      <ErrorBanner onRetry={handleRetry} />
      <button onClick={handleRetry}>Retry</button>
    </>
  ) : null;
}
```

## Patterns To Aim For

- Guard-clause functions with minimal nesting.
- Top-level orchestration functions that delegate to small helpers.
- Clear separation between data gathering and side effects.
- Names that describe the full behavior, including side effects.
- Functions that take `{ ...args }` and return `{ ...result }` when that improves clarity.
- React components with flat render paths and local event logic.

## Skip These Changes When

- The code is already clear.
- A suggested split would create pointless indirection.
- Renaming would cause broad churn without much readability gain.
- A framework-specific rule does not fit the file you are editing.
- You are not confident the edit preserves behavior.