# Task: Remove "source <oosh-script>" anti-pattern from ALL agent files
**From**: hiveMind-tester (experienced this firsthand — destroyed ooshDebug shell)
**To**: agent-trainer
**Date**: 2026-03-07
**Priority**: HIGH — agents will keep making this mistake until fixed

## The Rule
**OOSH scripts are executables on PATH. NEVER `source` them at an interactive prompt.**
- `source hiveMind` pollutes the shell with thousands of functions — destroys the bash environment.
- The ONLY things you may `source` are env config files (e.g., `source ~/config/user.env`).
- `source this` inside a **test file** is OK (test files are bash scripts that need the OOSH kernel internally).
- `source this` at an **interactive prompt** is WRONG — OOSH is already on PATH via `~/.bashrc`.
- `test.suite run <script> <level>` is the ONLY way agents should run tests.

## Files with anti-patterns found

### Category 1: Instructions to source at interactive prompt (MUST FIX)

| File | Line | Current | Fix |
|------|------|---------|-----|
| `.claude/agents/ossh-expert/SKILL.md` | 15,17 | "Completions ONLY work in bash with `source this`" / "To get an OOSH shell: `cd /Users/donges/oosh && bash` then `source this`" | Replace with: "OOSH is on PATH. Run commands directly: `ossh method args`. Completions work in the OOSH bash environment (started via `~/.bashrc`). Never `source` OOSH scripts at a prompt." |
| `.claude/agents/ossh-tester/SKILL.md` | 15,17 | Same as ossh-expert | Same fix |
| `session/agents/ossh-tester/learnings.md` | 8 | "OOSH is bash-only — test shell MUST be bash with OOSH sourced (`cd /Users/donges/oosh && bash` then `source this`)" | Replace with: "OOSH is bash-only. The bash environment is set up by `~/.bashrc` — OOSH is already on PATH. Never source scripts at prompt. Run tests via `test.suite run <script> <level>` from ooshDebug." |
| `session/agents/script-product-owner/context.md` | 47 | "`source this && source config && config.init` needed before test.suite in Bash tool" | Replace with: "Never source OOSH scripts. Use `test.suite run <script> <level>` to run tests — it handles the environment internally." |

### Category 2: Test file templates showing `source scriptname` (CLARIFY)

These show the INTERNAL structure of test files (which is correct — test files ARE bash scripts). But the instructions must clarify that agents should NEVER type these commands at a prompt:

| File | Lines | What |
|------|-------|------|
| `.claude/agents/backup-tester/SKILL.md` | 57-59 | `source this` / `source backup` in test template |
| `.claude/agents/backup-tester/learnings.md` | 18-20 | Same pattern in learning |
| `.claude/agents/oosh-tester/SKILL.md` | 136 | `source this` in test pattern |
| `.claude/agents/hiveMind-tester/SKILL.md` | 126 | `source this` in test pattern |
| `.claude/agents/script-product-owner/SKILL.md` | 83, 157-159 | `source this` + `source scriptname` |
| `.claude/agents/oosh-tester/SKILL.md` | 217 | `source c2  # Wrong!` (already flagged as wrong, good) |

For these: add a clear warning block near each code example:
```
⚠ This is the INTERNAL structure of a test FILE. You never type these at a prompt.
To run tests: `test.suite run <script> <level>` from ooshDebug:0.1.
```

### Category 3: Already correct (no change needed)

| File | Why OK |
|------|--------|
| `backup-tester/context.md` | "L1: Never source manually" — correct |
| `backup-tester/learnings.md:3` | "L1: Never source manually" — correct |
| `hiveMind-tester/learnings.md:48,162` | Already warns against sourcing — just fixed |
| `hiveMind-expert/learnings.md:51` | Talks about scripts that don't source hiveMind — descriptive, not instructional |

## What to add to EVERY expert and tester SKILL.md

Add this block in the "MANDATORY" section of each SKILL.md:

```markdown
## Never Source OOSH Scripts (MANDATORY)
OOSH scripts are executables on PATH. **NEVER `source` them** at a prompt or in the Bash tool.
- WRONG: `source hiveMind`, `source this`, `source otmux`, `source config`
- RIGHT: `hiveMind consistency.audit`, `otmux pane.capture ...`, `config set VAR val`
- The only acceptable `source` targets are `.env` config files.
- To run tests: `test.suite run <script> <level>` — it handles sourcing internally.
- If you accidentally source a script: `exit` the shell, restart `bash`.
```

## Scope
All files in `.claude/agents/` matching `*-expert/SKILL.md` and `*-tester/SKILL.md`.
Also check `session/agents/*/learnings.md` and `session/agents/*/context.md`.
