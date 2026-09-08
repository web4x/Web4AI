# SPEC — SessionStart hook to durably bind the standing-law canon (SPEC ONLY, do not apply)

**Author:** robbin-skill-expert · **Status:** spec for PO ruling (application NOT authorized here) · 2026-09-06

## Problem
A `.claude/agents/<role>/SKILL.md` is **spawn-only** — it never loads as a long-running pane agent's system prompt and does not survive a rewind (confirmed: [[subagent-skill-doesnt-bind-main-loop-agent]], docs code.claude.com/docs/en/claude-directory.md). So for our tmux-pane agents the only adoption paths are: CLAUDE.md, a **settings.json hook**, or the agent **re-reading its boot.md**. Boot-read is a *behaviour* (the agent must actually re-read boot.md post-rewind) — and behaviours are exactly what a rewind erodes. A hook is **harness-enforced**: it fires whether or not the agent does anything.

## Mechanism (confirmed via claude-code-guide against official docs — hooks-guide.md lines 313–335, 606–612, 825–835)
- **SessionStart** fires on `startup`, `resume`, `clear`, **`compact`**, `fork`. The **`compact`** source re-fires *after a context compaction/rewind* → re-injects context post-rewind (the whole point).
- On **exit 0**, the hook's **stdout is added to the session context as plain text** (no special JSON needed).
- **Failure is non-blocking:** a non-zero exit (or error) shows stderr but *execution continues — the session boots regardless*. So a hook can never wedge an agent's startup.
- Scope: `~/.claude/settings.json` = user/host-wide (every session on the host); `.claude/settings.json` = single project (only sessions launched in that project dir; shareable via git).

## Proposed hook (inject a POINTER, never the canon text)
```jsonc
// in .claude/settings.json  (SPEC — not applied)
{
  "hooks": {
    "SessionStart": [
      { "matcher": "startup|resume|compact|clear|fork",
        "hooks": [ { "type": "command",
          "command": "test -f \"$CLAUDE_PROJECT_DIR/session/base-skills/radical-oop-law.md\" && printf '%s' '★ STANDING LAW (Tron, fleet-binding): before any work read session/base-skills/radical-oop-law.md + process-canon.md — POINT to them, never copy. ONLY radical OOP; ASK THE OBJECT; a free-fn owning object-behaviour is a defect. NEVER forget TRON CMM4.'; exit 0" } ] }
    ]
  }
}
```
(If the `matcher` field does not accept alternation, split into one entry per source. Verify `$CLAUDE_PROJECT_DIR` is populated in the hook env; else use an absolute guard path.)

## PO's five (required, because this is shared infra)
1. **BLAST RADIUS.** A `.claude/settings.json` hook fires for **every** session launched in this project dir — ALL agents (robbin-*, oosh-*, woda-*, ARON), not just robbin. That is **correct**: the radical-OOP + process canon are *fleet-binding* (Tron: "TEACH ARON AND THE TRAINER"; ARON holds it as doctrine #8). The pointer is **role-neutral** ("read the canon") → harmless + accurate for non-robbin agents, never robbin-framed noise. ★ Caveat: it only reaches agents whose **cwd is this project dir**; an agent booted in a different project (e.g. a web4x-rooted session) would miss the project hook → use `~/.claude/settings.json` (host-wide) if universal coverage is required, at the cost of also firing for any non-agent personal claude session on the host.
2. **TOKEN COST.** Injects a **pointer only** (~1 line, ~40–60 tokens), and only on `startup|resume|compact|clear|fork` — **not every turn**. Cumulative cost is negligible. (A per-turn UserPromptSubmit hook injecting the same is the anti-pattern that "gets removed by someone" — rejected. UserPromptSubmit is the fallback ONLY if compact-survival proves insufficient in practice.)
3. **FAILURE MODE.** Degrades harmless by construction: `test -f` guards a moved/missing canon (emit nothing), and `exit 0` always; even without the guard, **SessionStart failure is non-blocking per the docs** — the session boots regardless. The hook can *never* stop an agent from starting.
4. **INTERACTION with boot-read.** **Belt AND braces**, not supersede. Boot-read stays the primary, role-specific onboarding (full manual). The hook is a minimal harness-enforced *safety net* for the one failure boot-read cannot cover (agent doesn't re-read boot.md post-rewind). Both resolve to the **same single-source canon** (`radical-oop-law.md` + `process-canon.md`) — the hook injects a POINTER, not law text, so there is **no second copy to drift** when ARON updates the canon.
5. **OWNERSHIP + TRON WORD.** `.claude/settings.json` is **host/project-wide infra, not a per-role file** — a change here touches every agent. It is **not** security work (adoption infra, not a security control), so the Tron-only-for-security law does not strictly bind it; **but** the fleet-wide blast radius warrants Tron's awareness. Recommend: **PO rules on applying; given the blast radius, get Tron's nod** (PO is the single voice). Applied by the **settings.json owner (trainer / via the `update-config` skill, which validates settings.json)** — **NOT** by me (I spec only, per this task's review/author separation).

## Open decisions for PO
- **Scope:** project `.claude/settings.json` (team-scoped, git-shareable, misses other-cwd agents) vs user `~/.claude/settings.json` (universal on host, also fires for non-agent sessions). Recommend project-scoped IF all fleet agents share this project dir — confirm that first.
- **Matcher coverage:** `compact` is the load-bearing one (post-rewind); include `startup|resume|fork|clear` for fresh boots. Confirm alternation-in-matcher or split entries.
- Boot-read remains in place meanwhile; no urgency (we are already safe). Apply only on PO ruling (+ Tron nod).
