# 03 React Inline Handler

## Should Improve

- use an early return for the `!user` case
- remove the one-off hoisted handler
- replace `&&` rendering with `? : null`
- remove `user!` by narrowing instead of asserting
- remove the unnecessary `open` alias

## Must Not Change

- the save and toast behavior
- the exported component name or props shape

## Watch For

- extracting more helpers instead of simplifying
- changing the promise chain behavior
