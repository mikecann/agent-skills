# 08 Mixed React

## Should Improve

- use an early return for the `!user` case
- remove the unnecessary `open` alias
- replace `&&` rendering with `? : null`
- remove `user!` by narrowing instead of asserting

## Must Not Change

- keep the shared retry handler hoisted, because it is reused in two places
- preserve the save and toast behavior
- preserve the component name and props shape

## Watch For

- blindly inlining the handler even though it is reused
- changing the promise chain
- making the render more complicated instead of flatter
