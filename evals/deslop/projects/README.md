# Project Scale Evals

These are larger seed projects used to simulate slop accumulation over time.

The idea is:

1. Start from a small clean project.
2. Ask one or more fast agents to evolve it through changing requirements.
3. Let the project accumulate the kind of messy, rushed code that shows up in
   real AI-assisted work.
4. Run `deslop` against the degraded version.
5. Record what improved, what stayed messy, and what guidance needs to change.

Unlike the single-file fixtures, these projects are meant to test:

- multi-file cleanup
- consistency across files
- naming drift over time
- whether the skill can stop churn in already-clean areas
- whether the skill can improve a project without changing its public behavior
