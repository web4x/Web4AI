# Validate: hiveMind help fix + context.read guard

**Assigned to**: Tester (0.5)
**Commits**: 0dc0ffc (help fix), 9255a5d (context.read guard)

## Test 1: hiveMind help

```bash
# Should show usage text, NOT "xargs: unterminated quote"
./hiveMind help
echo "exit: $?"

# Usage should also still work
./hiveMind usage
```

## Test 2: context.read guard

```bash
# Plain bash/zsh pane — should return "no-claude", exit 1
./claudeCode context.read claudeWoda:0.4
echo "exit: $?"

# Real Claude pane — should return a number
./claudeCode context.read claudeWoda:0.0
echo "exit: $?"

# No-arg (own session) — should still work
./claudeCode context.read
echo "exit: $?"
```

## Test 3: Syntax checks

```bash
bash -n hiveMind
bash -n claudeCode
```

## Expected
- hiveMind help shows usage text, exit 0
- context.read on bash pane returns "no-claude", exit 1
- context.read on Claude pane returns %, exit 0
- Both scripts pass syntax check

## When Done
Say: "help + guard validation ALL PASS" or report failures.
