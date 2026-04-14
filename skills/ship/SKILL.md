---
name: ship
description: Drive a branch to merge-ready by ensuring a PR exists, monitoring checks, triaging automated review comments, replying and resolving each handled bot thread, and optionally squash merging when the user asked for it. Use when the user says ship, land this, get this PR ready, babysit CI, handle bot review comments, or wants you to keep a PR green until merge.
---

# Ship

Take the current branch from "work in progress" to "ready to merge".

This skill is for the full PR babysitting loop:

- confirm you are on a real feature branch
- find or create the PR
- watch CI and review activity
- handle automated review comments one by one
- push fixes and keep re-checking
- stop only when the PR is merge-ready or blocked by something a human must decide

## When to Use

Use this when the user wants you to:

- ship a branch
- create a PR if needed
- monitor CI until it settles
- deal with AI review bots or automated review comments
- keep a PR merge-ready in a loop
- squash merge once everything is green

Do not use this for a normal one-off code review or a one-time push.

## Core Rules

1. Work from the current local branch.
   - If `git branch --show-current` is empty, or you are detached, stop and tell the user.
   - If you are on `main` or the repo's default branch, stop and tell the user there is no feature branch to ship.
2. Use `gh` for GitHub work.
   - Use `gh pr view`, `gh pr create`, `gh pr checks`, `gh pr review`, and `gh api`.
   - If `gh pr view` is not enough for review threads, use `gh api graphql`.
3. After every push, monitor checks again.
   - Do not push and walk away.
4. Handle automated review comments explicitly.
   - Decide whether the comment is valid.
   - If valid, implement a fix, push it, reply with what changed, then resolve the thread.
   - If not valid, do not change code, reply with why, then resolve the thread.
5. Do not auto-resolve human reviewer comments unless the user explicitly asked for that.
6. Do not merge unless the user explicitly asked you to merge when ready.
   - If they asked for squash merge, use squash merge.

## Workflow

### 1. Establish PR state

1. Get the current branch.
2. Check whether it already has an open PR.
3. If there is no PR:
   - make sure the branch is pushed
   - create the PR
   - capture the PR number and URL
4. Report the PR URL to the user once it exists.

If PR creation needs missing information and the repo does not make it obvious, draft a concise title/body from the branch diff and recent commits.

### 2. Start the shipping loop

Stay in this loop until one of these is true:

- the PR is genuinely ready to merge: required checks are green, automated review threads are handled, and GitHub shows it as mergeable
- the user asked for merge and the merge is complete
- you hit a real blocker that needs a human

Each loop iteration:

1. Check current PR status.
   - mergeability
   - review state
   - draft/open state
   - pending, failing, or passing checks
2. Check for new automated review activity.
   - review summaries
   - inline review comments
   - unresolved review threads from bots
3. Triage anything new before waiting again.
4. If nothing needs action and checks are still pending, wait and poll again.

Use short waits at first, then back off:

- first few polls: 15 to 30 seconds
- later polls: 30 to 60 seconds

## Handling Automated Review Comments

Treat each automated thread as a small review task.

### Triage rules

For each bot comment:

1. Read the surrounding code and understand the claim.
2. Decide if the comment is:
   - valid
   - partially valid
   - not valid
3. Prefer your own fix over blindly copying the suggestion.
4. Keep the fix scoped to the actual issue.
5. If the comment is wrong, do not churn the code just to satisfy the bot.

### Required action for every handled bot thread

1. Reply to the thread.
2. Resolve the thread.

Do both even when you disagree with the comment. The point is that every bot thread ends with an explicit decision.

### Reply style

Write in a short, direct, conversational tone.

- Say what you changed, or why you did not change it.
- Do not write a corporate essay.
- Do not hedge when the answer is clear.

Examples:

```text
Fixed this. The bot was right that we could hit the null path, so I added an explicit guard and covered it in the existing test.
```

```text
I looked at this and I don't think it's a real issue. That branch is already unreachable because `result.kind` is narrowed earlier, so changing it would just add noise.
```

### Resolution order

When a comment is valid:

1. implement the fix
2. run the smallest useful verification
3. commit if needed
4. push
5. reply to the thread
6. resolve the thread
7. go back to check status again

When a comment is not valid:

1. do not change code
2. reply to the thread with the reasoning
3. resolve the thread
4. go back to check status again

## Handling Failing Checks

Treat failing CI like another loop input.

1. Identify which check failed.
2. Decide whether it is caused by your changes, a flaky test, or an unrelated external failure.
3. If the fix is clear, implement it and push.
4. If the failure is unrelated but obvious, say so in your status update.
5. If the failure is ambiguous, investigate before changing code.

Do not declare success while required checks are still failing or pending.

If the repo has no checks configured, confirm that and focus on review state plus mergeability.

## Stop Conditions

Stop and ask the user when:

- GitHub auth is missing or broken
- PR creation needs product input you cannot infer
- merge conflicts are non-trivial
- a review comment requires a product decision, not an engineering fix
- a required check is hung or repeatedly flaky with no clear next step
- the repo settings block thread resolution or merge

The loop is meant to be persistent, not mindless. If progress stalls, explain the blocker clearly instead of thrashing.

## Merge

Only merge when the user explicitly asked for it.

If they said to squash merge when ready:

1. confirm the PR is mergeable
2. confirm required checks are green
3. confirm automated bot threads are handled
4. run the squash merge

If they asked for merge but did not specify squash, use the repo's normal merge strategy if it is obvious. Otherwise ask.

After merge:

1. if the current local branch is still checked out, switch back to `main`
2. if the repo does not use `main`, switch to the default base branch instead
3. tell the user the PR is merged and the local branch has been moved off the feature branch

If the user did not ask for merge, stop at "ready to merge" and say so explicitly.

## Bad vs Good

```bash
# Bad: create a PR, push once, then stop watching
git push -u origin HEAD
gh pr create --fill

# Good: create or find the PR, then keep monitoring it
git push -u origin HEAD
gh pr create --fill
gh pr checks --watch
```

```text
Bad: "Addressed."

Good: "Fixed this. The fallback path really could return stale data, so I moved the cache invalidation before the early return."
```

## Checklist

- [ ] current branch is a real feature branch
- [ ] PR exists and URL is known
- [ ] checks were monitored after every push
- [ ] every automated review thread was triaged
- [ ] every handled bot thread got a reply
- [ ] every handled bot thread was resolved
- [ ] failing checks were triaged and fixed where appropriate
- [ ] merge happened only if the user explicitly asked for it
- [ ] after merge, local checkout moved back to `main` or the default base branch
