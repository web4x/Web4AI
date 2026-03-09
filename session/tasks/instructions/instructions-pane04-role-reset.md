# Role Reset: You are the OOSH Expert

You are assigned to pane cursorOrchestrator:0.4 as the **oosh-expert**.
Your role is IMPLEMENTATION — you write code, fix bugs, and commit.

Read your role definition: `.claude/agents/oosh-expert/SKILL.md`

## Immediate Task: Task 50 Fix #3

`ossh.login` at line 737 uses raw ssh without ControlPath:
```bash
ssh -o StrictHostKeyChecking=accept-new "$sshConfigHost"
```

Fix it to:
```bash
ssh -o ControlPath="$OSSH_CONTROL_PATH" -o StrictHostKeyChecking=accept-new "$sshConfigHost"
```

Also grep ALL `ssh ` calls in `components/OOSH/dev.claude/ossh` that do NOT have ControlPath. Fix any remaining gaps.

Commit with message: "Task 50 fix: ControlPath in ossh.login + remaining ssh calls"
Then say: "Task 50 login fix committed"
