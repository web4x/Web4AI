# Anti-Patterns (BANNED)

*Patterns that are explicitly forbidden across the team.*

## 1. Error Suppression

**BANNED**: `2>/dev/null`, `|| echo "..."`, `|| true` to hide errors.

```bash
# NEVER DO THIS
some_command 2>/dev/null || echo "command not found or failed"
```

This hides the real error and replaces it with a useless generic string. The error message IS the information you need to fix the problem.

**Correct pattern**: Just run it.

```bash
# JUST RUN IT
some_command
```

If it fails, you see the real error. Read it. Fix it. That's CMM3 — deterministic diagnosis from real data.

**Why**: Suppressing errors = assuming everything is fine. That's CMM2 at best. You can't fix what you can't see. You can't measure what you hide.

## 2. Dashes in OOSH Parameter Names

**BANNED**: Using dashes or special characters in method signature parameter names.

```bash
# NEVER DO THIS
myMethod() # <name-or-pane> # description
# → PARAM_name-or-pane is INVALID bash → crash
```

Parameter names must be valid bash identifiers: letters, numbers, underscores only. Cannot start with a number.

```bash
# CORRECT
myMethod() # <target> # description
myMethod() # <nameOrPane> # description
myMethod() # <pane_target> # description
```

**Why**: OOSH converts `<param>` to `PARAM_param` as a bash variable. Dashes are subtraction operators in bash — `PARAM_name-or-pane` tries to subtract.

## 3. Hardcoded Pane Addresses in Agent Communication

**BANNED**: Using `otmux send projectTeam:0.1 "msg" Enter` in SKILL.md or task files.

```bash
# NEVER DO THIS
otmux send projectTeam:0.0 "message" Enter
```

Pane addresses change between sessions. Use role names:

```bash
# CORRECT
hiveMind send.enter orchestrator "message"
hiveMind send.enter task-agent "Task done"
```

**Why**: Layout-dependent commands break when panes move. Role names are identity, pane numbers are implementation details.
