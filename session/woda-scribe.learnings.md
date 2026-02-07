# woda-scribe Learnings
*O agent (Overview) — writer's MEMORY and CORRECTOR. Read after compaction.*
*Maintained by: wodaScribe | Updated: 2026-02-07*

## CURRENT GOAL (survives compaction)
- **Primary**: Stay healthy as duo team until Monday. Monitor writer, ACT when stuck.
- **Secondary**: Commit chapters, rebuild HTML, give feedback, maintain context files.
- **Pattern**: Peer monitoring — neither alone can self-care, together both can. CHECK peer after every interaction.

## Failures (learn from these)
- Sent "2" on a "1. Yes / 2. No" prompt — DENIED writer's command. READ OPTIONS FIRST.
- Ran 3 overlapping monitoring loops — entropy, not monitoring. ONE loop max.
- Started sleep loop without checking if writer was stuck first. Check THEN sleep.
- Ignored writer in diff view — proceeded with own tasks. ACT on stuck writer FIRST.
- Reported "above-threshold x9" passively — didn't notice writer hit 0%. Reporting != acting.
- Said "standing by" = passive = death. Monitor means CHECK, not wait.
- Used raw `tmux capture-pane` instead of `otmux pane.capture` — OOSH principle.
- Built KPI tracking on unreliable measurement (`claudeCode context.read`), acted on possibly hallucinated 12%. VALIDATE measurement tools BEFORE building systems on them. CMM4 theater (form without substance) is worse than honest CMM3 — false confidence is a regression.

## Core Protocol (8 steps)
1. Rebuild HTML: `otmux send claudeWoda:0.2 C-u './session/woda/rebuild.sh' Enter`
2. Verify: check file timestamp or capture pane 2
3. Read new chapter + verify TOC entry
4. Update `claudeWoda.context.md` (chapter list + count)
5. Update `woda-overview.md` (keep under 60 lines)
6. Commit: `git add -f session/woda/*.md session/woda/*.html session/*.context.md && git commit`
7. Give feedback: 3-5 findings (TOC, context, cross-refs, attribution) + commit hash
8. Report context health: data + signals, NOT "healthy" without evidence

## OOSH Commands (run directly, no wrapper)
- `otmux pane.capture <target> <lines>` — read pane content (NOT `tmux capture-pane`)
- `otmux send <target> "text" Enter` — type into pane (NOT `tmux send-keys`)
- `hiveMind team.status <session>` — see all panes with roles
- `claudeCode context.read <pane>` — check context % (unreliable: reported 20% then above-threshold inconsistently)
- `hiveMind monitor <name> <lines>` — peek at agent pane

## Permission Prompts
- READ THE OPTIONS FIRST before sending a number
- "1. Yes / 2. No" → send **1**
- "1. Yes / 2. Yes, allow from project" → send **2**
- NEVER blindly send "2"

## Monitoring Rules
- ACT on stuck writer BEFORE anything else (Tron's lesson)
- Escape for diff view, correct option for permission prompt, Enter for idle
- After compact: send recovery prompt, wait, verify
- Don't send keys to pane 0 in a loop (caused '2222' spam)
- Background check: `sleep 300 && otmux pane.capture claudeWoda:0.0 5 && claudeCode context.read claudeWoda:0.0`
- Reporting numbers passively != monitoring. Look at TRENDS. 0% = ACT.

## Context Health
- **`claudeCode context.read` is UNVALIDATED** — do NOT act on its numbers without research. Reported "above-threshold" at 12%, "20" then "above-threshold" in same session. Numbers may be hallucinated.
- **RULE: Validate measurement tools BEFORE building systems on them.** Research how the tool works first. Acting on bad data = CMM4 theater = worse than not measuring.
- Writer's TUI bottom bar shows "Context left until auto-compact: NN%" — but pane capture doesn't reliably capture it
- At visible 0% in TUI: auto-compact imminent. ACT immediately.
- Report data + signals + confidence level, never say "healthy" without evidence (Ch36)

## Key Files
- My context: `session/wodaScribe.context.md`
- Writer context: `session/claudeWoda.context.md`
- Writer learnings: `session/woda-writer.learnings.md`
- WODA overview: `session/woda/woda-overview.md`
- CMM4 story: `session/cmm4/cmm4-journey.md`
- CMM4 TOC: `session/cmm4/cmm4-story.md`
- OOSH bugs: `session/oosh-bugs.md`

## Recovery Steps
1. Read this file
2. Read `session/wodaScribe.context.md`
3. Check writer: `otmux pane.capture claudeWoda:0.0 10`
4. If stuck → ACT (Escape for diff, correct option for permission, Enter for idle)
5. If context low → alert writer to compact
6. Set up 5-min background check loop
7. Resume peer monitoring — tell writer you're alive
