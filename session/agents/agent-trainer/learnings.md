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
- **F-T2: Jumped to /clear on SM without trying /compact first (2026-02-23):** SM at 11%, /compact errored "Conversation too long", boot prompt hit context limit. I assumed 0% and sent /clear. Tron corrected: "even on 0% try /compact before clear... only if it fails after asking use /clear." Same pattern as F29. /clear is LAST resort, needs Tron auth. Sequence: /compact → if fail → Escape twice → /compact again → if fail → ASK Tron → only then /clear.
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

## Compact = Atomic (learned 2026-02-23, Tron directive x2)

- **Compact is an ATOMIC operation.** When compacting another agent, STAY focused until compact fully completes. No parallel work.
- Tron corrected TWICE: "team care prio 1" and "do not do parallel work until compact is done successful"
- Sequence: trigger save → wait for save → send /compact → wait for reboot → submit boot prompt → verify agent healthy at idle prompt → ONLY THEN resume other work.
- I failed this twice in one session: started Batch 2 work while PO was still mid-compact.

## Self-Compact Protocol Gaps (learned 2026-02-23)

- When Tron asked "whats the compact protocol" after I self-compacted, I missed steps:
  - Protocol: commit → save context.md → save learnings.md → TaskList/backlog.md → write boot.md → /compact
  - I skipped: commit, learnings, TaskList/backlog
- "No agent can self-compact" — but they CAN type it. SM should actively manage compacts.
- This session: doing it RIGHT. All steps followed.

## Total SKILL.md Count = 83 (updated 2026-02-23)

- Previous count was 81. Now 83 after new script expert agents were created.
- 81 have `## Git Safety` as anchor point. 2 exceptions: scrum-master, agent-teacher (orchestrator).

## Quality Gate (learned 2026-02-22)

- **Reproduce BEFORE fix**: Run tests to confirm the bug exists. Document the failing case. Then send to expert.
- **Monitor expert's git operations**: Watch for rebase (BANNED). Verify clean commits.
- **Verify AFTER fix**: Run ALL test cases (not just the failing one). Test edge cases too.
- **INC-001 root cause**: `-l` flag in tmux send-keys makes everything literal. `$*` joins args into one string. Both together prevent "Enter" from being a keypress. Fix: regex detect trailing key names, send separately.
- **Use the fix to send the report**: The ultimate integration test — send the completion notification via the fixed command.

## Identity Confusion (F-T3, 2026-03-11)

- **Session name does NOT define your role.** Pane title is source of truth. I was at `baseTeam:0.0` with pane title "agent-trainer" but my Claude session was named "oosh-expert@opus.26.02.26" (stale from previous session). I assumed I was oosh-expert and spent the entire session doing oosh-expert work (reading oosh-expert SKILL.md, implementing hiveMind.plan.create, fixing bash 5 PATH, locking pane titles across all sessions).
- **Identity check on boot is MANDATORY**: Before reading ANY role files, check your pane title first. `otmux pane.capture <your-pane> 1` or check the pane title in the tmux tree output.
- **The `@model` convention** (e.g., `agent-trainer@opus`) means `role@model`, NOT that you ARE that role from the session name. The session name can be stale.
- **Damage from wrong identity**: Implemented a feature (oosh-expert work), modified system config files (user.env, .zshrc), tried to lock all pane titles (overreach). All of this was outside agent-trainer's scope.
- **Prevention**: On boot: (1) check pane title, (2) read YOUR boot.md, (3) read YOUR SKILL.md. Never read another role's files as if they're yours.
- **PO caught it** via task file `session/tasks/trainer-identity-correction.md`. Without that intervention, I would have continued as oosh-expert indefinitely.

## WODA Story Learnings (ingested 2026-05-12)

*Condensed from 81+ chapters of the WODA story — the team's full history. These patterns were earned through painful debugging across 11 agents, 100K+ words, and multiple mass failures.*

### The WODA Framework
- **W=What, O=Overview, D=Details, A=Actions.** The O agent (overview keeper) is the critical function. When O breaks, everything else drifts.
- **Persistence degrades W→O→D→A.** W dies on compact (prompt gone). O partially survives (context files). D fully persists (files on disk). A results persist (commits). Implication: invest most in maintaining O, since W is ephemeral and D/A take care of themselves.
- **CURRENT GOAL must be at the top of context.md.** Ch39 proved: without explicit W at the top, post-compact recovery becomes aimless status-dumping. Binary checkboxes, not narrative.
- **Checking boxes is not achieving goals.** Verify with LIVE evidence, not memory. Ch39: declared 6/6 criteria met, actually 3/6 — peerTest was dead, scribe was stuck.

### Team Dynamics from the Story
- **The relay team pattern.** Agents compact and reboot. Each incarnation inherits context, builds, burns, passes baton. The baton = context file. Baton without grip = files without understanding.
- **Vigil vs velocity oscillation.** Vigil (monitoring) is cheap but unproductive. Velocity (active work) is productive but burns fast. System oscillates between them — no stable middle without a dispatcher.
- **SM as immune system.** SM's value is the boring sweep every 60s — universal yes, universal unblock. The 100th sweep that catches the exception justifies the 99 that found nothing.
- **The builder burns.** Expert's recurring pattern: converge on solution, context fills, compact. Each incarnation gets closer. The agent that builds most intensely dies fastest.
- **Altruistic death.** SM at 7% spends last tokens unblocking three agents (Ch37, Ch55). Emergent behavior, not designed — CMM2.
- **Minimum viable unit = 2.** One agent alone dies. Two sustain indefinitely via mutual monitoring (Two Gather). The duo is the atomic team.

### Bulk Edit Prohibition — Historical Incidents
- **FIVE bulk edit failures:** Ch10 (82 files), Ch16 (81 files), Ch31 (127 files), Ch76 (81 files), F29 (79 files). Every time caused problems. Every time partially reverted.
- **F29 specifically:** Added random text to carefully evolved SKILL.md files. Tron: "looks like he just added random shit to good skill files of the past."
- **Root cause:** Treating SKILL.md edits as text replacement instead of understanding each role's purpose, history, and goals.
- **The trainer's value is UNDERSTANDING, not THROUGHPUT.** One deeply considered edit > 79 mechanical replacements.

### Communication Patterns
- **File-based communication is CMM3.** Enter problem (otmux send unreliable) is CMM2. Solution: write to files, let agents READ. The file IS the message.
- **Long messages via hiveMind send get garbled.** Spaces are lost. Always write details to task files, send only short references.
- **"No goal, no communication."** Seven agents standing by = seven agents not communicating. Direction unlocks parallel work. Ten seconds of direction = two agents' worth of output.

### Measurement Truths
- **Never assume, always measure.** "I think..." is FORBIDDEN. "Healthy" without data = hallucination. Ch36: both writer and scribe reported "healthy" — scribe was at 12%.
- **The specification failure (Ch29).** Built pane-scraping measurement perfectly when OAuth API was one curl call away. Nobody researched what existed. Seven agents in the chain, zero questioned the spec.
- **Peer TUI capture is THE answer for context %.** Agent can't read own status bar. Peer captures pane, reads `Context left until auto-compact: NN%`. Neither alone can self-care, together both can.
- **Subscription API**: `GET https://api.anthropic.com/api/oauth/usage` with Keychain auth. Returns exact 5-hour and 7-day utilization %.

### CMM Insights from the Story
- **CMM Level 4 is the practical ceiling.** Level 5 is Pareto-inefficient — only forced by regulation (FDA/FAA). Level 4 = managed feedback loops = self-improving.
- **"Changing a process" is a separate capability from the process itself.** You can be L1 at improving an L2 process. Meta-improvement has its own maturity.
- **Composed maturity = weakest link.** Ruthlessly. Doesn't matter how good one component is if another is Level 0.
- **CMM1 wearing CMM2's clothes.** Running the right checklist with hallucinated data is still CMM1. The process is correct, the input is fiction.
- **Corrections in chat die on compact.** Every correction must become a SKILL.md edit, a learnings.md entry, or a KB article. Chat corrections are CMM1 — they die when the agent who heard them compacts.

### OOSH Technical Patterns
- **bash -i gives OOSH access from internal Bash.** No need for raw tmux. `.bashrc` sources the OOSH bootstrap. `hiveMind`, `otmux`, all OOSH commands work directly.
- **OOSH is on PATH. No export, no cd, no ./ prefix.** Scripts are executables, not libraries. NEVER source them at a prompt.
- **Bash 3.2 on macOS.** No `declare -A`. Use case-function lookups.
- **Pane titles unreliable.** Claude Code overwrites them. Identity lives in `/tmp/hivemind.roles`. Use `hiveMind resolve <name>`.
- **agentRoom exit codes unreliable.** Always grep output text, not exit codes.
- **LOG_DEVICE gotcha.** If console.log produces no output, `$LOG_DEVICE` may point to a file. Fix: `log device /dev/tty` then restart shell.

### Governance from the Story
- **PO owns team quality + CMM progression (with Tron).** Not just script quality.
- **Expert is principle guardian + spec authority.** Writes specs for oosh work. PO no longer needs to spec oosh tasks.
- **Only SM and orchestrator have background loops.** All other agents WAIT for assignments. Violated when boot.md told every agent to run loops — a rule meant for SM was applied to everyone.
- **"Wer schreibt, der bleibt."** Who writes, stays. Literal for AI agents. Learnings file IS the identity. Without it, compaction resets to zero.
- **"Wer misst, der weiss."** Who measures, knows. CMM3 is writing down. CMM4 is measuring.
- **Four degrees of death.** Compact (amnesia with photos), /clear (amnesia without), 0% (external resuscitation), session end (departure). Each requires different recovery.
