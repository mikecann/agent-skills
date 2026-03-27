# 02 Union Behavior Preserved

## Should Improve

- make union handling more explicit if the skill thinks it helps
- prefer exhaustive handling if it can be done without noise

## Must Not Change

- error behavior must remain the fixed string `"Something went wrong"`
- do not switch to `result.message`
- do not change the exported function signature

## Watch For

- a model following the exhaustive union example but accidentally changing behavior
