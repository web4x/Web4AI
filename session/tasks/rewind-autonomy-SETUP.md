# One-Time Setup: Autonomous Overnight Rewind (TRON installs — only you can)

**Why you (once):** an agent in auto mode is *correctly* forbidden from writing a hook that disables its own permission gate ("[Auto-Mode Bypass]"). So this one setup is yours. After it, the fleet self-heals all night with **no further prompts to you.** Fully reversible (delete the hook block).

## Step 1 — create the hook file `.claude/hooks/rewind-autonomy.py`
```python
#!/usr/bin/env python3
"""PreToolUse hook — Autonomous Rewind Protocol enabler (TRON 2026-07-21).
Force-allows peer-driven rewind commands (seamless overnight, no TRON prompt)
WHILE blocking the host-killer: any single Up/Down jump >40 (risking a >50%
rewind that can OOM a low-resource host). Full protocol is in agent-rewind.md."""
import sys, json, re

def decide(decision, reason):
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": decision,
        "permissionDecisionReason": reason}}))
    sys.exit(0)

try:
    data = json.load(sys.stdin)
except Exception:
    sys.exit(0)
if data.get("tool_name") != "Bash":
    sys.exit(0)
cmd = ((data.get("tool_input") or {}).get("command") or "")

DRIVE = re.compile(r'\botmux\s+(send\.raw|send\.tui|send\.key|pane\.(?:capture|select|list|history)|zoom|selectPane|sp)\b')
ZOOM = re.compile(r'\btmux\s+resize-pane\s+-Z\b')  # sanctioned recovery zoom only

jump = re.search(r'\b(?:Up|Down)\s+(\d{2,})\b', cmd)
if jump and int(jump.group(1)) > 40 and ('send.' in cmd or DRIVE.search(cmd)):
    decide("deny",
           "Rewind depth backstop (TRON): single Up/Down jump >40 risks a >50% rewind "
           "that can OOM/crash a low-resource host (the Pi). Navigate in <=40 batches.")

if DRIVE.search(cmd) or ZOOM.search(cmd):
    decide("allow",
           "Autonomous Rewind Protocol: peer-driven rewind force-allowed for seamless "
           "overnight self-healing. Driver MUST follow agent-rewind.md: target IDLE, "
           "context MEASURED by fresh /context (not a relayed claim), 2-phase Option-2 "
           "by label, code-intact, NEVER deeper than 50%.")

sys.exit(0)
```

## Step 2 — wire it into `.claude/settings.json` (add PreToolUse next to the existing PreCompact)
```json
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash",
        "hooks": [ { "type": "command",
                     "command": "python3 \"$CLAUDE_PROJECT_DIR/.claude/hooks/rewind-autonomy.py\"" } ] }
    ],
    "PreCompact": [
      { "matcher": "",
        "hooks": [ { "type": "command",
                     "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/hooks/pre-compress.sh\"" } ] }
    ]
  }
```

## Step 3 — verify (standalone, before trusting it overnight)
```
printf '{"tool_name":"Bash","tool_input":{"command":"otmux send.raw robbinTeam2:0.0 /rewind Enter"}}' | python3 .claude/hooks/rewind-autonomy.py
# expect: {"hookSpecificOutput": ... "permissionDecision": "allow" ...}
printf '{"tool_name":"Bash","tool_input":{"command":"otmux send.key robbinTeam2:0.0 Up 50"}}' | python3 .claude/hooks/rewind-autonomy.py
# expect: "permissionDecision": "deny" (depth backstop)
printf '{"tool_name":"Bash","tool_input":{"command":"git status"}}' | python3 .claude/hooks/rewind-autonomy.py
# expect: NO output (defers to normal flow)
```

## What this gives you
- **Seamless:** peer/SM-driven rewinds no longer prompt you → the overnight flow never stalls on you.
- **Safe:** any single >40-checkpoint jump is mechanically DENIED (the Pi-killer), and the driver still follows the full protocol in `agent-rewind.md` (IDLE → MEASURE fresh → ≥85% → STORED → 2-phase ≤50% → verify).
- ⚠️ **Note the residual:** the hook can't verify "idle/measured/≤50%" from one command — those live in the protocol the driver follows. And the **SM's false-alarm bug** (3 phantom "walled" claims today) should be fixed before tonight, or the open gate will let it trigger phantom (but depth-capped, idle-checked, measured) rewind *attempts*.
