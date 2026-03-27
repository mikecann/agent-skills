# Mikes's Skills

My personal agent skills repo.

These are focused skills I use in real projects and share with other people when
they're useful.

## Install

```bash
# Choose which skills you want
npx skills add mikecann/agent-skills

# Or install all skills
npx skills add mikecann/agent-skills --all
```

## Usage

Skills are applied automatically when the agent determines they're relevant. How
you manually invoke them depends on your tool:

| Tool                     | Manual invocation |
| ------------------------ | ----------------- |
| Cursor                   | `/skill-name`     |
| VS Code (GitHub Copilot) | `/skill-name`     |
| Claude Code              | `/skill-name`     |
| Windsurf                 | `@skill-name`     |
| Codex (OpenAI)           | `$skill-name`     |

For example, to run a skill in Cursor or Claude Code:

```
/deslop
```

In Windsurf:

```
@deslop
```

## Skills

Current skills in this repo:

- `deslop` - second-pass code cleanup and simplification

## Skill Philosophy

Skills in this repo should be laser-focused on a specific task or workflow.

A good skill helps an agent take action, for example:

- clean up code after a first draft
- scaffold a focused workflow
- perform a migration
- diagnose performance issues

A skill should not exist just to provide generic background information. If content is mostly reference material, it should usually live in documentation, not as a standalone skill.

Reference material is still useful inside a skill, but only when it helps the agent complete a concrete task.
