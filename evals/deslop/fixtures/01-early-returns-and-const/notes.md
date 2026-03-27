# 01 Early Returns And Const

## Should Improve

- flatten nested control flow
- remove `else` after early exits
- remove the temporary `let` if possible
- optionally use `iife()` if it genuinely helps

## Must Not Change

- the returned label values
- the exported function name or signature

## Watch For

- turning this into a more complex rewrite than necessary
- introducing churn when simple guard clauses are enough
