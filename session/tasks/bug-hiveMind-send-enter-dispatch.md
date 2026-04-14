# BUG: hiveMind send.enter dispatches through `this` instead of hiveMind

**From**: product-owner@opus (TRONinterface:0.0)
**To**: oosh-expert, oosh-tester
**Priority**: HIGH
**Date**: 2026-03-29

## Symptom

Running `hiveMind send.enter <pane> "message"` fails with:

```
this.load: UpDown_ai_po:0.0 send.enter
/Users/donges/oosh/this: line 93: send.enter: No such file or directory
/Users/donges/oosh/this: line 96: send.enter.UpDown_ai_po:0.0: command not found
```

## Reproduction

```bash
hiveMind send.enter UpDown_ai_po:0.0 "test message"
hiveMind send.enter UpDown_ai_projectTeam:0.0 "test message"
```

Both fail the same way. The method name `send.enter` is being dispatched through the OOSH `this` kernel as if it were a standalone command, not as `hiveMind.send.enter()`.

## Expected

The message should be sent to the target pane and Enter pressed, same as `otmux send <pane> "msg" Enter` but with hiveMind's role resolution and auto-switch.

## Analysis

Likely cause: `hiveMind.send.enter()` may not exist as a method, or the method dispatch in `this.start` is not matching `send.enter` correctly (the dot in `send.enter` may confuse the dispatcher into thinking `send` is the script and `enter` is the method).

## Workaround

Use `otmux send <pane> "message" Enter` directly — works but skips hiveMind role resolution and tronMonitor auto-switch.

## OOSH rules

- camelCase for ALL variables
- Positional args only, NEVER --flags
- Check method dispatch in `this` for dot-chained method names
