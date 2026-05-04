# unit-po Learnings

## L1: Two writers to same directory = guaranteed corruption
TsAstExtractor and UcpStorage both write to scenarios/index/ with different algorithms. Single writer principle: ALL writes through UcpStorage.

## L2: CMM4 means written task files, not chat commands
Shouting ad-hoc instructions to agents is L1. Writing task-*.md files with acceptance criteria that agents read is L3. Measuring deliverables against those criteria is L4.

## L3: Verify fork identity before claiming success
Forked sessions inherit parent's customTitle. Always check process args (`ps -p PID -o args=`) to verify which UUID was actually forked. I claimed a correct fork twice when it was wrong.

## L4: Permission prompts block agents silently
Agents stop at permission prompts and appear "idle". Always check for permission prompt text before assuming agent finished or crashed. Unblock immediately.

## L5: Repair before fix = risk
I let the expert implement UnitRepair.ts before the architect identified root cause. The repair works but fixing root cause should come first (prevent new bad files before cleaning old ones).

## L6: Web4 shell init required
Must run `bash --init-file source.env` from UpDown project root for web4 commands. Plain bash/zsh doesn't have web4tscomponent, once, etc. on PATH.

## L7: Never assume — always measure
"All three working" claimed multiple times when agents were actually idle or blocked. ALWAYS capture pane before reporting status.
