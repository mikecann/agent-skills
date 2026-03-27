# Deslop Evals

This directory contains manual eval fixtures for the `deslop` skill.

The goal is not to force one exact rewritten output. The goal is to check that
the skill consistently:

- reduces obvious AI slop
- preserves behavior
- preserves exported/public APIs
- avoids unnecessary churn
- leaves already-clean code alone

## Fixture Layout

Each fixture lives in its own directory under `fixtures/` and contains:

- `input.ts` or `input.tsx`
- `notes.md`

The notes file explains:

- what the skill should improve
- what it must not change
- any tricky edge cases

## Rubric

Grade each run using these categories:

- `behavior_preserved`
- `api_preserved`
- `slop_reduced`
- `style_rule_following`
- `unnecessary_churn`

Use `pass`, `partial`, or `fail` for each category.

## How To Run

1. Copy one fixture into a temporary directory.
2. Ask an agent to:
   - read `skills/deslop/SKILL.md`
   - read `skills/deslop/style.md`
   - read the copied fixture files
   - apply the deslop pass in place
   - return a short report
3. Compare the output against the fixture `notes.md`.
4. Save the result under `runs/`.

## Prompt Template

```text
Read:
- c:/dev/me/agent-skills/skills/deslop/SKILL.md
- c:/dev/me/agent-skills/skills/deslop/style.md

Then read and edit only:
- <temp fixture path>/input.ts

Apply the deslop skill exactly as written.

Constraints:
- preserve behavior
- preserve exported/public APIs
- preserve exported TypeScript signatures unless explicitly asked otherwise
- prefer small, local edits
- leave already-clean code alone

Return:
- what changed
- what was intentionally skipped
- any ambiguity in the skill or style guide
```

## Notes

- Exact output matching is not required.
- Behavioral regressions are always a fail.
- API or signature churn during a style-only pass is usually a fail.
