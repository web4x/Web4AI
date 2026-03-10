# Boot: hiveMind-tester
*Written by hiveMind-tester 2026-03-10 pre-compact #3.*

## You are: hiveMind-tester
## Pane: hiveMindTeam02_03_26:0.1
## Goal: Fix teams.restore fork reliability — most agents fail silently

## Immediate actions:
1. Run self-awareness: `otmux pane.get.target`, `claudeCode session.id <pane>`, `claudeCode context.self`
2. Read `.claude/agents/hiveMind-tester/SKILL.md`
3. Read `session/agents/hiveMind-tester/context.md`
4. Read `session/agents/hiveMind-tester/learnings.md`
5. Read `/Users/donges/oosh/docs/oosh-architecture.md`

## Current state: teams.restore forks fail silently
- **Cross-machine fork PROVEN**: manual scp + cd + claudeCode fork = working
- **Root cause of "Rate limit reached"**: `opus[1m]` in MacStudio settings.json — FIXED to `opus`
- **teams.migrate ran**: created 7 sessions, 15 panes, but only 3 agents actually running
- **BUG-1**: JSONL transfer only sent 1 of 12 files (manually transferred rest)
- **BUG-2**: cd + claudeCode fork sent to panes but Claude doesn't start on most (blank panes)
- **Expert notified**: reported bugs, awaiting fix
- **T-RESTORE-1..15**: ALL PASS (commit 5cb6eb9)

## Key commits this session:
- 6ab741a: T-RESTORE tests initial
- 5cb6eb9: T-RESTORE fixes — all 15 pass
- 1604e3e (expert): teams.migrate JSONL + fork + model check
- 2efbdec (expert): claudeCode fork method
- 6207f8f (expert): agent.restart.remote

## What to investigate next:
1. Why do most claudeCode fork commands fail silently in teams.restore panes?
   - Effort dialog blocking? Trust dialog? Wrong cwd?
   - Test: manually send `claudeCode fork <uuid>` to a blank MacStudio pane
2. Why does JSONL transfer only copy 1 of 12 files?
   - ossh exec for mkdir might fail, or scp path issue
3. After expert fixes: re-run full restore on MacStudio
4. Verify all 15 agents have identity + working API

## MacStudio state:
- 7 sessions exist, most panes at zsh prompt (Claude not running)
- All 12 JNSONLs present on MacStudio (manually transferred)
- Settings.json has `opus` model (fixed from `opus[1m]`)

## Rules (memorize):
- **NO git rebase. EVER.** Pull with merge only.
- **ONE LINE git commit messages.**
- OOSH is on PATH — no export needed.
- **NEVER source OOSH scripts.** Executables only.
- **NEVER use raw `claude` or `tmux`** — always claudeCode/otmux.
- **NEVER drop files from reading list** — only add, never remove.
- **ossh login <host>** not `ossh <host>`.
- Tests must be fixture-based, not machine-specific.
- **Always MEASURE, never assume.**
- **Graceful exit before kill.** Escape → /exit → Ctrl-C → kill (last resort).
- **Use hiveMind commands, not raw otmux** — you are the hiveMind tester!
