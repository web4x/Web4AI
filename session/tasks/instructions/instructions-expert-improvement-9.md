# Improvement #9: Context velocity tracking

**Source**: CMM improvement checklist (session/cmm.improvement.md)
**PO authorized**

## Problem

We only measure context % remaining — not burn rate or prediction. We need to know tokens/hour per agent and predict when compact is needed.

## Solution

Add methods to `claudeCode` or `scrumMaster` that:
1. Measure tokens per hour from JSONL data
2. Know max tokens per model (200k for Opus/Sonnet)
3. Calculate velocity = tokens/hour
4. Predict time until compact needed

## Implementation

### 1. `claudeCode.context.velocity` method

Read the JSONL file and calculate token burn rate:

```bash
claudeCode.context.velocity() # <?pane> # calculate context burn rate (tokens/hour) from JSONL data
{
    local pane="$1"
    local jsonl_file
    jsonl_file=$(claudeCode.context.jsonl)
    [ -z "$jsonl_file" ] || [ ! -f "$jsonl_file" ] && { echo "unknown"; return 1; }

    # Use python3 to parse timestamps and token counts from assistant messages
    python3 -c "
import json, sys
from datetime import datetime

messages = []
with open('$jsonl_file') as f:
    for line in f:
        try:
            d = json.loads(line)
            if d.get('type') == 'assistant':
                msg = d.get('message', {})
                usage = msg.get('usage', {})
                if usage and 'input_tokens' in usage:
                    # Get timestamp from the jsonl entry
                    ts = d.get('timestamp', '')
                    input_t = usage['input_tokens']
                    cache_create = usage.get('cache_creation_input_tokens', 0)
                    cache_read = usage.get('cache_read_input_tokens', 0)
                    total = input_t + cache_create + cache_read
                    messages.append({'ts': ts, 'tokens': total})
        except:
            pass

if len(messages) < 2:
    print('unknown')
    sys.exit(0)

# Use first and last message to calculate rate
first = messages[0]
last = messages[-1]

try:
    t1 = datetime.fromisoformat(first['ts'].replace('Z', '+00:00'))
    t2 = datetime.fromisoformat(last['ts'].replace('Z', '+00:00'))
    hours = (t2 - t1).total_seconds() / 3600
    if hours <= 0:
        print('unknown')
        sys.exit(0)

    token_growth = last['tokens'] - first['tokens']
    tokens_per_hour = token_growth / hours

    # Predict time until 200k (compact threshold ~180k = 90%)
    current = last['tokens']
    max_tokens = 200000
    threshold = int(max_tokens * 0.90)
    remaining = threshold - current

    if tokens_per_hour > 0 and remaining > 0:
        hours_left = remaining / tokens_per_hour
        mins_left = int(hours_left * 60)
        print(f'{int(tokens_per_hour)} tokens/hr | {current} current | ~{mins_left}min until compact')
    elif remaining <= 0:
        print(f'{int(tokens_per_hour)} tokens/hr | {current} current | COMPACT NOW')
    else:
        print(f'{int(tokens_per_hour)} tokens/hr | {current} current')
except Exception as e:
    print('unknown')
" 2>/dev/null

    return 0
}
claudeCode.context.velocity.completion() { :; }
```

### 2. `claudeCode.context.dashboard` method

Show a summary for all active sessions:

```bash
claudeCode.context.dashboard() # # show velocity dashboard for all active sessions
{
    local project_dirs
    project_dirs=$(find ~/.claude/projects/ -maxdepth 1 -type d 2>/dev/null)

    echo "=== Context Velocity Dashboard ==="
    echo "Session | Tokens | Rate | Time Left"
    echo "--------|--------|------|----------"

    for dir in $project_dirs; do
        local latest
        latest=$(ls -t "$dir"/*.jsonl 2>/dev/null | head -1)
        [ -z "$latest" ] && continue

        # Only show recently modified (last hour)
        local mtime
        mtime=$(stat -f %m "$latest" 2>/dev/null)
        local now=$(date +%s)
        local age=$(( now - mtime ))
        [ "$age" -gt 3600 ] && continue

        local uuid=$(basename "$latest" .jsonl)
        local short="${uuid:0:8}"

        # Get velocity info
        local info
        info=$(JSONL_FILE="$latest" python3 -c "
import json, sys, os
from datetime import datetime

jsonl_file = os.environ.get('JSONL_FILE', '')
messages = []
with open(jsonl_file) as f:
    for line in f:
        try:
            d = json.loads(line)
            if d.get('type') == 'assistant':
                usage = d.get('message', {}).get('usage', {})
                if usage and 'input_tokens' in usage:
                    total = usage['input_tokens'] + usage.get('cache_creation_input_tokens', 0) + usage.get('cache_read_input_tokens', 0)
                    messages.append({'ts': d.get('timestamp', ''), 'tokens': total})
        except: pass

if len(messages) < 2:
    print('- | - | - | -')
    sys.exit(0)

first, last = messages[0], messages[-1]
try:
    t1 = datetime.fromisoformat(first['ts'].replace('Z', '+00:00'))
    t2 = datetime.fromisoformat(last['ts'].replace('Z', '+00:00'))
    hours = (t2 - t1).total_seconds() / 3600
    if hours <= 0:
        print(f\"{last['tokens']} | - | -\")
        sys.exit(0)
    rate = int((last['tokens'] - first['tokens']) / hours)
    remaining = 180000 - last['tokens']
    mins = int(remaining / rate * 60) if rate > 0 and remaining > 0 else 0
    pct = round(last['tokens'] / 200000 * 100, 1)
    print(f\"{pct}% | {rate}/hr | {mins}min\")
except:
    print('- | - | -')
" 2>/dev/null)

        echo "$short | $info"
    done
}
claudeCode.context.dashboard.completion() { :; }
```

## KPIs from improvement checklist
- Tokens per hour measured each cycle
- Max tokens known per model (200k)
- Velocity = tokens/hour calculated
- Prediction: time until compact needed
- Scrum-master can log structured KPIs
- CMM4 calculation for velocity/wait per agent

## Testing

From `components/OOSH/dev.claude/`:
```bash
# 1. Syntax check
bash -n claudeCode

# 2. Test velocity
./claudeCode context.velocity

# 3. Test dashboard
./claudeCode context.dashboard

# 4. Completion stubs
grep 'velocity.completion\|dashboard.completion' claudeCode
```

## When Done
Commit: "Improvement #9: Context velocity tracking — tokens/hr + time-until-compact"
Then say: "Improvement #9 committed"
