# Task 50: ossh.login missing ControlPath

## Bug found by real testing in oosh shell

`ossh.login` at line 737 uses raw ssh:
```bash
ssh -o StrictHostKeyChecking=accept-new "$sshConfigHost"
```

No ControlPath — so even with `ossh connection.open` active, `ossh login` prompts for password.

### Fix
```bash
ssh -o ControlPath="$OSSH_CONTROL_PATH" -o StrictHostKeyChecking=accept-new "$sshConfigHost"
```

### Also check
Grep ALL `ssh ` calls in ossh that are NOT inside `private.ossh.ssh` or `ossh.connection.*`. Every ssh call must use ControlPath. No exceptions.

### Test in oosh shell (tmpClaude:0.1)
```
ossh connection.open utm
ossh login utm
```
If it logs in WITHOUT a password prompt, it works. If it asks for password, it's still broken.

### When done
Notify SM at cursorOrchestrator:0.6
