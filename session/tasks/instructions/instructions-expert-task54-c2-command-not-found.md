# Task 54: Fix c2 command not found

**Priority**: Medium
**Source**: WODA story — c2 (completion system) not available as standalone command

## Bug

Running `c2` from the command line gives "command not found". The completion system script lives in `ng/c2` but isn't accessible as a standalone command. Users expect `./c2 function.completion ./scriptname` to work.

## Investigation

1. Read `components/OOSH/dev.claude/ng/c2` — understand the completion script
2. Check if there's a symlink or wrapper expected in the main oosh directory
3. Check how other ng/ scripts are made accessible (is there a pattern?)
4. Look at how `c2` is referenced in other scripts — `grep 'c2' this` and `grep './c2\|source.*c2' *`
5. The fix might be as simple as a symlink: `ln -s ng/c2 c2` or adding ng/ to PATH

## Fix

Make `c2` accessible as a command from the oosh root directory. Follow whatever pattern other ng/ scripts use. If no pattern exists, a symlink is the simplest approach.

## Testing

From `components/OOSH/dev.claude/`:
```bash
./c2 function.completion ./otmux
# Should list otmux methods
```

## When Done
Commit: "Task 54: Make c2 completion system accessible as standalone command"
Then say: "Task 54 committed"
