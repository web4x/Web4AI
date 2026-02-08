# TASK-16: Object.Verb Notation Enforcement

## User Directive (verbatim)

> we only want to have scripts with the object.verb notation methods. all other methods may exist but should become private so they do not show up in the completion.

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | Expert | Audit all scripts for non-object.verb public methods |
| 2 | Expert | Refactor: add private. prefix to non-matching methods |
| 3 | Tester | Validate completion only shows object.verb methods via Tab |
| 4 | Agent Trainer | Add object.verb notation rule to Expert and Tester SKILL.md files |

## Status: DONE

- Implemented in commit 461c6e1
- Updated by Task Agent (task board) 2026-02-01
