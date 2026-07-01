#!/usr/bin/env bash
# SCENARIO FIRST propagation — run by TRON (outside the auto-mode guard).
# Idempotent (skips files already carrying the rule). Byte-faithful block below.
set -euo pipefail
cd /var/dev/Workspaces/AI/Claude

BLK=$'\n## ☑ SCENARIO FIRST — scenario units on disk BEFORE implementation (TRON law #100)\n\nScenario units are written **on disk BEFORE any implementation**. The Markdown is a **generated VIEW** of the scenarios — never hand-authored ahead of them. **A backfill (scenarios written after the code) means the rule was already broken.**\n\nIf a task begins implementation without its scenario units, **reject the task** until the scenario exists. Scenario first, or reject.\n'
export BLK

ins=0; skip=0
while IFS= read -r f; do
  if grep -q "SCENARIO FIRST" "$f"; then skip=$((skip+1)); continue; fi
  if [ "$(sed -n '1p' "$f")" = "---" ]; then
    n=$(awk 'NR>1 && /^---[[:space:]]*$/ {print NR; exit}' "$f")
  else
    n=1
  fi
  awk -v n="$n" 'NR==n{print; printf "%s", ENVIRON["BLK"]; next}{print}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  ins=$((ins+1))
done < <(find .claude/agents -name SKILL.md | sort)

echo "inserted=$ins skipped=$skip"
echo "coverage: $(grep -rl 'SCENARIO FIRST' .claude/agents --include=SKILL.md | wc -l)/91"
git add .claude/agents/*/SKILL.md
git commit -m "doctrine: propagate SCENARIO FIRST (law #100) into all SKILL.md — TRON authorized"
