# stdin Consumption in Bash while-read Loops

**Created**: 2026-03-25
**Context**: hiveMind team.pull only downloaded first JSONL out of ~10

## The Bug Pattern

```bash
# BROKEN — ossh/ssh/scp inside loop consumes stdin, loop stops after 1st iteration
while IFS='|' read -r field1 field2; do
  result=$(ossh exec "$host" "some command")    # ← eats remaining stdin
  ossh scp "$host:$file" "$local"               # ← also eats stdin
done < "$snapshot_file"
```

Any command inside a `while read < file` loop that reads from stdin (fd 0) will steal the loop's input. The loop processes the first line, then the subcommand consumes the rest of the file.

## The Fix

Redirect the file to a different file descriptor:

```bash
# FIXED — fd 3 keeps loop input separate from subcommand stdin
while IFS='|' read -r field1 field2 <&3; do
  result=$(ossh exec "$host" "some command")    # reads fd 0 — safe
  ossh scp "$host:$file" "$local"               # reads fd 0 — safe
done 3< "$snapshot_file"
```

Alternative (per-command): add `< /dev/null` to stdin-consuming commands:
```bash
result=$(ossh exec "$host" "command" < /dev/null)
```

## Commands That Consume stdin
- `ssh` / `ossh exec` — SSH reads stdin for remote command input
- `scp` / `ossh scp` — may read stdin for password prompts
- `read` (nested) — obviously
- `cat` without args — reads stdin
- Any interactive command (editors, pagers)

## Where We Found It

hiveMind had 6 bare `while read ... done < file` loops with ossh calls inside:
- `team.pull` — JSONL download loop (line ~1969)
- `teams.migrate` — JSONL transfer loop (line ~1846)
- `teams.restore` — agent resume loop
- `team.restart` — bulk restart loop
- And 2 more snapshot-parsing loops

All 6 fixed in commit `2dcbfa9` with fd 3 redirect.

## Test: T-PULL-8

Grep-based pattern detection (does NOT execute the bug):
```bash
# Count bare stdin loops (done < file without fd 3)
BARE_STDIN_LOOPS=$(grep -c 'done < ' hiveMind)
# Count protected loops (done 3< or read <&3)
FD3_LOOPS=$(grep -c 'done 3< \|<&3' hiveMind)
# PASS if bare=0 or fd3>0
```

**Warning**: Do NOT write a test that reproduces the stdin consumption by executing a while-read loop with `cat > /dev/null` inside — it will hang the test harness itself (the test.suite also reads from stdin).

## Rule

**Every `while read ... done < file` loop in OOSH that calls external commands MUST use fd 3.** No exceptions. Grep for `done < ` to find violations.
