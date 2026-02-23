# agent-trainer Learnings

*Patterns, failures, KPIs — identity after compact.*

## Patterns

- **Rule in SKILL.md but not practiced = CMM2 gap.** Writing a rule is CMM2 (repeatable). Agents actually following it is CMM3 (deterministic). Must verify adoption, not just presence. (2026-02-12, PO observation: zero agents using TaskCreate/TaskUpdate despite rule in all SKILL.md files)
- **DRY is highest directive.** Write once, link everywhere. KB is single source. SKILL.md files link, never copy.
- **Parallel edits work.** Can edit 10+ files in one tool call if strings are unique. Always read files first or Edit will fail with "File has not been read yet."
- **Never suppress errors.** `2>/dev/null || echo` hides root causes. Just run the command and read the real error. KB: `session/knowledge-base/anti-patterns.md`
- **PO + Trainer can always create specialists.** Script-product-owner is a delegate template, not just a contract. One specialist per complex script. No permission needed to spawn more.

## Audit Technique
- **Bulk updates via Python**: For 78+ files, use python3 with glob + string replace. Much faster than manual Edit per file.
- **Verification after bulk update**: Always `grep -rl | wc -l` to verify all files were updated. Target = 81 (total SKILL.md count).
- **Proactive auditing while idle**: Check coverage of mandatory sections across all 81 SKILL.md. Gaps found: SM missing WODA (80/81), task-agent hardcoded pane, script-product-owner had binary thresholds.
- **Boot template improvements persist**: Changes to `.claude/hooks/pre-compress.sh` affect ALL future agent compacts.

## Key Numbers
- Total SKILL.md files: 81
- Mandatory sections: Base Skills, OOSH-Only, Knowledge Base, Compact Protocol, WODA+PDCA, CMM3/4 Split, CMM4 Velocity, Prefer Built-in Tools (8 sections)
- agent-overview.md is the master reference — SKILL.md must align with it

## Compact Lifecycle (learned 2026-02-22)

- **"42" principle**: An agent CANNOT measure its own context %. Only a peer can — send `/context` to their pane, capture the output. Context measurement is always a service for others.
- **Only `/context` is reliable** — `claudeCode context.read` is wrong (off by 10+ points, hardcoded 200K window).
- **`otmux send` > `hiveMind send` for Enter keys**: `hiveMind send <role> "text" Enter` sometimes sends "Enter" as literal text. Use `otmux send <pane> "text" Enter` with Enter as SEPARATE unquoted argument. Always verify with capture afterward.
- **`C-u` before resending**: When prompt has garbled text at `❯`, first clear with `otmux send <pane> C-u`, then send clean command. Never pile text on garbled text.
- **Accept-edits is non-blocking**: Prompt still accepts /compact, /clear (per MEMORY.md). The Enter issue is a send-keys problem, not accept-edits blocking.
- **Attribute accurately**: Never claim "I did X" if PO or peer intervened. Honest attribution = CMM3. First compact was CMM2 — PO fixed Enter submission.
- **Verify files BEFORE compact**: context.md (current?), learnings.md (present?), boot.md ("Written by" = safe, "Auto-generated" = generic fallback), git status (uncommitted = lost).
- **"Written by" pattern**: boot.md with "Written by [role]" on line 2 tells the pre-compact hook NOT to overwrite it. "Auto-generated" = hook replaced it.
- **NEVER /clear above 0%**: /clear kills all context. Only use at 0% when /compact can't work.
- **Compact sequence**: capture pane → verify files → send /compact → wait 20s → verify recovery → unblock if stuck at prompt.
- **Self-care thresholds**: 50%=note burn rate, 35%=save context, 25%=final save, 15%=compact NOW, 6%=CRITICAL, 0%=/clear only.

## Failures & Fixes

- **Parallel edit failure (2026-02-11):** Tried editing 9 unread files — only 2 succeeded. Fix: read all files first, then edit.
- **Wrong task version (2026-02-11):** Started work before re-reading corrected task file. Fix: always re-read task file if told it was updated.
- **SM WODA gap (2026-02-19):** SM SKILL.md was only file missing Decision Framework: WODA+PDCA section (80/81). Found via `comm -23` between all SKILL.md and those with the section. Fix: added section, verified 81/81.
- **Binary thresholds keep reappearing (2026-02-18 → 2026-02-19):** Even after bulk removal, found 2 more in SM + script-product-owner. Fix: targeted grep after bulk update. Must check for "At 80%", "At 90%", "80%+" patterns specifically.
- **Deadlock from missing rewake (2026-02-22):** Measured PO with /context, read the result, but never sent report back. Both sides waited on each other = deadlock. Fix: measurement protocol is **measure → report → rewake**. ALWAYS send results back to the measured agent. Also: never send long messages via hiveMind send — write task file, send short reference only.
- **Zoom pane for /context capture**: /context output is 200+ lines with all skills/tools. Standard 30-line capture misses the top where `Xk/200k tokens (XX%)` is. Either zoom pane first (`tmux resize-pane -Z`) or use `tmux capture-pane -S - | grep "200k"` for full scrollback search.
- **OOSH wrappers for session setup (2026-02-22)**: NEVER use raw tmux commands when oosh wrappers exist. Session creation: `otmux new <name>`, split: `otmux splitH <pane>`, start Claude: `otmux send <pane> "claude --name <role>" Enter`. The `--name` flag names the Claude session to match the agent role. Using raw `tmux new-session` / `tmux split-window` / `tmux send-keys` violates the OOSH-Only rule.
- **CLAUDECODE env var blocks nested sessions**: `claude` inside a tmux pane started FROM Claude gets `CLAUDECODE` env var inherited. Fix: `unset CLAUDECODE && claude --name <role>`. The otmux wrappers may handle this automatically.
- **F-T1: Sent raw /compact without letting expert save context (2026-02-23):** Tron said "compact, do not clear" — I sent /compact directly without first saying "Save your context and run /compact NOW." This is EXACTLY F11 (PO's failure). Peer Compact Protocol: ALWAYS trigger the agent to save first, wait for confirmation, THEN compact. Never send raw /compact to another agent. The sequence: "Save context" → wait for save → /compact.

## Incident Tracking (learned 2026-02-22)

- **Track repetitive incidents by count.** Any problem that happens 2+ times gets an entry in `session/knowledge-base/recurring-incidents.md`. At 3+ occurrences, escalate to expert.
- **WODA for incidents**: W=what keeps recurring, O=pattern analysis, D=reproduction steps, A=assign for fixing.
- **CMM1→CMM4 path**: Heroic workarounds (CMM1) → track occurrences (CMM2) → assign root cause fix (CMM3) → measurement-driven prioritization (CMM4).
- **KB contributions follow DRY**: Link to existing articles, don't duplicate. New article only when topic doesn't exist yet.

## Overnight Responsibilities (learned 2026-02-22)

- **Context health is MY job.** SM handles permissions + team management. Trainer handles context monitoring + compact lifecycle.
- **INC-004 detection during context sweeps**: text at `❯` + NO "esc to interrupt" = stuck self-prompt → send Enter.
- **Sweep ALL panes every cycle**: projectTeam (0.0, 0.1, 0.2, 0.3, skip 0.4), odockerTeam (0.0, 0.1), hiveMindTeam (0.0, 0.1).
- **SM compact at 5% was too late** — should have interrupted background bash earlier. At 10%, start the compact process immediately. Don't wait for SM to finish long-running tasks.
- **OOSH naming rules (KB #16)**: camelCase params, no dashes, no underscores. Added to all 4 script team SKILL.md files. oosh-expert reviews all script team commits.

## PO Failures F26-F34 — Training Reference (2026-02-22)

- **F26: Never `hiveMind unblock all`** — it sends to 0.4 (Tron). Unblock specific panes, skip 0.4.
- **F27: "Slow down" ≠ "stop"** — no new large tasks, but current work FINISHES. Never interrupt mid-task — context loss is permanent. KB #25.
- **F28: No compound `&&` commands** — `sleep N && command` and `cmd1 && cmd2` trigger unique permission prompts. OOSH wrappers have `<?interval>` params. Anti-pattern #4.
- **F29: /clear is 0% ONLY** — at 5% after compact, try /compact AGAIN. /clear kills everything. "Are you mad...it kills your team mate."
- **F30: One file: boot.md. Always.** No variant names (boot-post-compact.md, boot-curated.md). Hook depends on the exact name.
- **F31: Monitor ALL panes** — including orchestrator. Use `hiveMind team.status` not selective captures. One forgotten pane = one dead agent.
- **F32: Self-care at 35%** — save context. If monitoring others while ignoring own burn = die and take team with you. Priority #1.
- **F33: Recovery order SM FIRST** — without SM sweeping, nobody has a safety net. Trainer burned 64%→0% because SM was recovered last.
- **F34: Rules are eternal** — NEVER delete from any agent file. Append new, copy ALL old forward. Emergency is no excuse.
- **Fractal connection**: Every sub-task was born from a failure. F→learning→KB→tool→fractal = PDCA = CMM4 = web4x.

## Quality Gate (learned 2026-02-22)

- **Reproduce BEFORE fix**: Run tests to confirm the bug exists. Document the failing case. Then send to expert.
- **Monitor expert's git operations**: Watch for rebase (BANNED). Verify clean commits.
- **Verify AFTER fix**: Run ALL test cases (not just the failing one). Test edge cases too.
- **INC-001 root cause**: `-l` flag in tmux send-keys makes everything literal. `$*` joins args into one string. Both together prevent "Enter" from being a keypress. Fix: regex detect trailing key names, send separately.
- **Use the fix to send the report**: The ultimate integration test — send the completion notification via the fixed command.
