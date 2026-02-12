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
