# Task: completion-system audit + fix (otmux / claudeCode / hiveMind)

**From**: oosh-po@MacStudio (guardian — delegating, NOT debugging)  **Team**: WODA.prod ooshTeam  **Branch**: dev
**Priority**: HIGH  **Date**: 2026-06-28

## Why (a CLASS of completion bugs surfaced)
Tab-completion is broken on multiple methods. Two found so far — likely a pattern across all three scripts:
1. **otmux `client.detach`** — had only a *method* completion; c2 resolves params via `otmux.parameter.completion.<param>` and there was no `parameter.completion.client` → blank. FIXED locally (macos.latest `9971ad7`: added `otmux.parameter.completion.client` + delegated). **Needs propagation to dev + a regression test.**
2. **claudeCode `join`** — completion delegates to `private.claudeCode.complete.sessionIds` (claudeCode:340); reported broken (offers nothing/wrong). Data-source helper or resolution is the suspect. (claudeCode uses *method* completions throughout — different convention than otmux's parameter completions.)

## What — AUDIT all three, fix the class
- **Audit every completion** in `otmux`, `claudeCode`, `hiveMind`: for each method's completable param, confirm c2 actually resolves it and the data-source helper returns candidates. Identify the resolution rule c2 uses per script (parameter.completion vs method.completion) and make each script CONSISTENT with how c2 resolves.
- **Fix claudeCode join** (and any siblings): repair `private.claudeCode.complete.sessionIds` (and complete.panes/roleNames if broken) so `join`/`join.byID`/`fork` offer real resumable sessions.
- **Propagate the otmux client fix to dev** + same for any other otmux param missing its `parameter.completion`.
- **Determine the c2 contract** definitively (read `ng/c2`): does c2 use `script.parameter.completion.<param>`, `script.method.completion.<param>`, or both-with-precedence? Document it so every script follows one rule. This is the root that made client.detach silently blank.

## Tests (CMM4 guard)
- **T-COMPLETION-*** per script: every completable param yields non-empty candidates for the normal case (live sessions/panes/clients/uuids present), and resolves via the c2-correct layer. Fails if a completion returns blank when candidates exist. This guards the whole class so it can't regress.

## Constraints (OOSH first principles)
- object.verb, no flags, camelCase, human-readable errors, DRY (shared `complete.*` helpers).
- Match each script's c2 resolution convention consistently (don't mix method/parameter ad-hoc).

## Owners (WODA.prod ooshTeam, dev) — invoke script specialists as needed
| Role | Owns |
|------|------|
| oosh-architect | Read `ng/c2`, document the c2 completion-resolution contract; decide per-script convention. |
| oosh-expert (+ otmux-expert / claudeCode-expert specialists) | Fix claudeCode complete.sessionIds + join; propagate otmux client fix to dev; sweep all completions to the c2-correct layer. |
| oosh-tester | T-COMPLETION-* across otmux/claudeCode/hiveMind. |
| oosh-po (0.0) | Drive + QA: `claudeCode join <TAB>` offers sessions, `otmux client.detach <TAB>` offers ttys, audit clean, T-COMPLETION green. |

## Acceptance
- [ ] c2 completion-resolution contract documented (parameter vs method, precedence)
- [ ] `claudeCode join` <TAB> offers resumable sessions; `otmux client.detach` <TAB> offers client ttys
- [ ] All completions across otmux/claudeCode/hiveMind resolve (no silent-blank where candidates exist)
- [ ] T-COMPLETION-* green
- [ ] Committed + pushed on dev (otmux client fix propagated from macos.latest 9971ad7)

## Report-back (owner edits + commits + pushes)
- oosh-architect:
- oosh-expert:
- oosh-tester:
- oosh-po (QA):
