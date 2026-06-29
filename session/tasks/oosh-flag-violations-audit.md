# Bug: OOSH flag violations — `--fork` in teams.restore/migrate + full audit

**From**: oosh-po (Tron caught it; PO first-principles miss)
**Owners**: oosh-architect (flag-free design) → oosh-expert (implement) → oosh-tester (verify + audit)
**Priority**: HIGH
**Date**: 2026-06-22

## Principle (non-negotiable — "Death to Flags")
OOSH abandons flags entirely. The method name carries the verb; parameters are positional and named by convention (`<param>`, `<?optional>`, `<?opt:default>`), Tab-discoverable. A `--flag` in any method signature is a cardinal violation — it's "the cryptic shit Linux screwed OOP with."

## The Violation
`hiveMind.teams.restore() # <?snapshot_file> <?--fork>` — `<?--fork>` is a FLAG. `teams.migrate` invokes `teams.restore --fork` internally. Both violate the no-flags rule.

## Fix (architect designs, pick one)
1. **Positional mode**: `teams.restore() # <?snapshot> <?mode:join>` — `mode` ∈ {join, fork}, default `join`, with `teams.restore.completion.mode` offering `join`/`fork`. `teams.migrate` calls `teams.restore <snap> fork`.
2. **Object.verb split**: `teams.restore` (join, default) + `teams.fork` (fork) — verb in the name. `teams.migrate` calls `teams.fork`.
Either is acceptable; no `--flag`. Keep behaviour identical; only the interface changes. Update all callers (teams.migrate, any docs/SKILL refs).

## Broader audit (this RECURS — see PO learning F44)
Scan ALL oosh scripts for flag violations in METHOD signatures and internal method calls:
- `grep -nE '# <\??--' <script>` — flags in signatures
- method bodies invoking sibling oosh methods with `--flags`
- raw `find`/`stat`/`sed`-with-flags where an OOSH wrapper or positional form should be used (note: external-tool flags like `git push`, `tmux -t` inside a wrapper are OK — the rule targets OOSH METHOD interfaces, not the underlying tool calls they wrap)
Report every offending `script:line` so they get fixed, not just teams.restore.

## Acceptance
- [ ] `teams.restore` / `teams.fork` (or `<?mode>`) — zero `--flag` in signature; Tab-completion offers the modes
- [ ] `teams.migrate` updated to the flag-free call
- [ ] behaviour unchanged (fork-resume still works)
- [ ] audit report: list of any other `--flag` method violations across oosh scripts
- [ ] tester: T-NO-FLAGS (grep guard — no `# <?--` / `# <--` in any method signature)

## Report-back (edit here → oosh-po)
- Architect (design choice + audit findings):
- Expert (impl + commit):
- Tester (T-NO-FLAGS + audit verification):
