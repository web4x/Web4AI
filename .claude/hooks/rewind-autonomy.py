#!/usr/bin/env python3
"""PreToolUse hook — CMM4 continuous-operations enabler (TRON 2026-07-22).
Force-allows peer-driven fleet-coordination commands (rewind-drive, SM
sweep/unblock, cross-pane sends, health reads) so continuous autonomy runs
WITHOUT a per-action prompt to TRON — WHILE mechanically blocking the host-killer
(any single Up/Down jump >40 = a >50% rewind that can OOM a low-resource host)
and keeping destructive verbs gated. Full protocol lives in agent-rewind.md."""
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
    sys.exit(0)  # unparseable -> defer to normal permission flow
if data.get("tool_name") != "Bash":
    sys.exit(0)
cmd = ((data.get("tool_input") or {}).get("command") or "")

# Continuous-op verbs the classifier gates as "workload interference":
ALLOW = re.compile(
    r'\b(?:'
    r'otmux\s+(?:send\S*|pane\.\S+|selectPane|sp|zoom|panes|fit)'
    r'|hiveMind\s+(?:send\S*|unblock\S*|sweep\S*|monitor|resolve|agent\.(?:verify|bootstrap|send))'
    r'|claudeCode\s+(?:context\.\S+|session\.\S+|join\.\S+)'
    r'|tmux\s+resize-pane\s+-Z'      # sanctioned recovery zoom only
    r')\b')
# NEVER auto-allowed (stay gated): /clear, /compact, kill*, rm*, git push, settings edits.

# DEPTH BACKSTOP (host safety): a single Up/Down jump > 40 risks a > 50% rewind.
jump = re.search(r'\b(?:Up|Down)\s+(\d{2,})\b', cmd)
if jump and int(jump.group(1)) > 40 and 'send' in cmd:
    decide("deny",
           "Rewind depth backstop (TRON): single Up/Down jump >40 risks a >50% rewind "
           "that can OOM/crash a low-resource host (the Pi). Navigate in <=40 batches.")

if ALLOW.search(cmd):
    decide("allow",
           "CMM4 continuous-ops: peer-driven fleet-coordination command pre-authorized "
           "(no TRON prompt). Driver MUST follow agent-rewind.md: target IDLE, context "
           "MEASURED by fresh /context (not a relayed claim), 2-phase Option-2 by label, "
           "code-intact, NEVER deeper than 50%.")

sys.exit(0)  # not a coordination command -> defer to normal permission flow
