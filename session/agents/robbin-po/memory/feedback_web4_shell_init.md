---
name: Web4 shell initialization
description: Web4 test shells must be initialized with bash --init-file source.env from UpDown project root
type: feedback
originSessionId: fe80b13c-c559-45f0-92f4-a55c95488460
---
Web4 component commands (web4tscomponent, once, web4test, etc.) require a properly initialized shell.

**How to init a Web4 shell:**
```bash
cd /Users/Shared/Workspaces/AI/Claude.All/UpDown
bash --init-file source.env
```

This sources the project's source.env which adds `scripts/` and `scripts/versions/` to PATH, sets up tab completion via `_web4_generic_completion`, and sets `WEB4_PROJECT_ROOT`.

**Why:** Without this, `web4tscomponent: command not found`. The oosh bash or plain zsh shell does NOT have Web4 commands on PATH. You must init from the UpDown project root.

**How to apply:** Before running any Web4 CLI command in a shell pane, ensure it was initialized with `bash --init-file source.env`. Check the prompt — a properly initialized shell shows `[web4 0.3.23.1 | user@host]`, not `donges@MacStudio %`.
