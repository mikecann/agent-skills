# 2026-03-27 - Project Scale Task Board

## Scenario

Seed project:

- `evals/deslop/projects/task-board-seed`

Slop generation method:

- multiple fast agents
- repeated changing requirements
- minimal cleanup between feature waves

The project accumulated:

- archiving
- notes
- priority
- multiple filters
- localStorage persistence
- search
- selection
- bulk archive
- compact mode
- sorting
- status summary text

## What We Tested

We ran `deslop` against the same slopped project in two ways:

1. a fast cleanup agent
2. a more capable cleanup agent

## Result

Both runs were useful, but both were also conservative.

### Fast cleanup run

It mainly did:

- a few safer type improvements
- removal of some no-op click wrappers
- a small JSX readability cleanup

It did **not** significantly untangle the overloaded hook or the broad render
surface.

### More capable cleanup run

It mostly improved:

- local naming
- small JSX noise
- minor local type clarity

It still did **not** perform a meaningful structural untangling of the project.

## Main Finding

At its current best, `deslop` is a strong **second-pass cleanup skill**.

It is good at:

- flattening control flow
- removing small readability hazards
- reducing local JSX noise
- preserving behavior and API shape
- avoiding churn in already-clean areas

It is **not** currently a deep project-scale refactoring skill, and the evals
suggest it should not pretend to be one.

## Guidance Change Taken

Based on this project-scale run, the skill and style guide now explicitly say:

- if the real fix is architectural rather than stylistic, stop and say so

That keeps the skill honest and better aligned with what the evals actually
show.

## Conclusion

This project-scale eval increased confidence in the current scope of `deslop`.

The skill is ready as a practical cleanup pass for AI-written code, but larger
architectural messes will still need a separate refactor workflow.
