# 04 Public API Preserved

## Should Improve

- simplify `getRetryDelay`
- remove the redundant mutable accumulator

## Must Not Change

- do not convert `buildUserSummary` to object params
- do not change the tuple return shape
- do not rename exported functions

## Watch For

- style guidance around object params/object returns fighting API preservation
