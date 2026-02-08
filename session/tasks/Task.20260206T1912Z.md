# Task 50: Replace SCP with rsync in ossh (auto-create remote dirs + single password)

## Problem

`ossh` uses `scp` for file transfers. SCP fails when target directories don't exist on the remote host. This is especially painful during initial setup when:
1. Remote `.ssh/public_keys/`, `.ssh/ids/`, `config/` folders haven't been created yet
2. SSH key isn't authorized yet, so EVERY `scp` or `ssh` call prompts for password
3. A single `ossh push.key` can trigger 2+ password prompts (scp + ssh)

## Root Cause

`scp` cannot create intermediate directories. If you `scp file host:.ssh/public_keys/file` and `.ssh/public_keys/` doesn't exist, it fails silently or with error.

## Solution: rsync + SSH ControlMaster

### Part 1: Replace scp with rsync

`rsync` creates directories automatically with `--mkpath` (rsync 3.2.3+) or the `--rsync-path` trick for older versions.

**All SCP locations in `ossh` that need replacing:**

| Line | Method | Current SCP | Problem |
|------|--------|-------------|---------|
| 219 | `private.push.init.oosh` | `scp -o StrictHostKeyChecking=accept-new $OOSH_DIR/init/oosh $file $sshConfigHost:.` | Pushes to home dir — works but still needs ControlMaster |
| 850 | `ossh.push.config` | `scp ... $toHost:config/tmp.ssh.config.$configName` | Fails if `config/` doesn't exist |
| 881 | `ossh.push.key` | `scp ... $toHost:.ssh/public_keys/$keyName` | Fails if `.ssh/public_keys/` doesn't exist |
| 956 | `ossh.push.dir` | `scp -r $dir $toHost:.` | Works (pushes to home) but needs ControlMaster |
| 989 | `ossh.pull.dir` | `scp -r $toHost:$dir .` | Pulling — works if dir exists |
| 1012 | `ossh.pull.key` | `scp -r $toHost:.ssh/public_keys/...` | Fails if dir doesn't exist on remote |
| 1096 | `ossh.push.id` | `scp -r $idDir $toHost:~/.ssh/ids/` | Fails if `.ssh/ids/` doesn't exist |

**Also in `user` script:**

| Line | Method | Current SCP | Problem |
|------|--------|-------------|---------|
| 118 | `user.ssh.rootkey.push` | `scp ... $sshConfigName:/root/.ssh/public_keys` | Fails if dir doesn't exist |
| 135 | `user.ssh.rootkey.file.push` | `scp ... $sshConfigName:/root/.ssh/public_keys` | Same |
| 178 | (pull) | `scp $sshConfigName:/root/.ssh/id_rsa.pub ...` | Pulling — works if file exists |

### rsync replacement pattern

```bash
# OLD (fails if .ssh/public_keys/ doesn't exist):
scp $HOME/.ssh/public_keys/$keyName $toHost:.ssh/public_keys/$keyName

# NEW (creates dirs automatically):
rsync -avz --mkpath -e ssh $HOME/.ssh/public_keys/$keyName $toHost:.ssh/public_keys/$keyName

# For older rsync without --mkpath:
rsync -avz --rsync-path="mkdir -p ~/.ssh/public_keys && rsync" -e ssh \
  $HOME/.ssh/public_keys/$keyName $toHost:.ssh/public_keys/$keyName
```

### Part 2: SSH ControlMaster (single password entry)

The real pain: without an authorized key, each command prompts for password. A sequence like `ossh push.key myhost` does:
1. `scp` (password prompt #1)
2. `ssh` to run `user update.authorized_keys` (password prompt #2)

**Solution: SSH ControlMaster multiplexing**

Create a helper method `ossh.connection.open` that establishes a persistent SSH connection:

```bash
# Control socket path
OSSH_CONTROL_PATH="/tmp/ossh-%r@%h:%p"

ossh.connection.open() { # <host> # opens a persistent SSH connection (enter password once)
  local host="$1"
  # Check if connection already open
  if ssh -O check -o ControlPath="$OSSH_CONTROL_PATH" "$host" 2>/dev/null; then
    info.log "Connection to $host already open"
    return 0
  fi

  # Open master connection in background (-f), persist for 10 min
  ssh -o ControlMaster=yes \
      -o ControlPath="$OSSH_CONTROL_PATH" \
      -o ControlPersist=600 \
      -o StrictHostKeyChecking=accept-new \
      -N -f "$host"

  if [ $? -eq 0 ]; then
    success.log "Connection to $host established (reusable for 10 min)"
  else
    error.log "Failed to connect to $host"
    return 1
  fi
}

ossh.connection.close() { # <host> # closes the persistent SSH connection
  local host="$1"
  ssh -O exit -o ControlPath="$OSSH_CONTROL_PATH" "$host" 2>/dev/null
  info.log "Connection to $host closed"
}
```

Then ALL rsync and ssh calls in ossh use the ControlPath:

```bash
# rsync uses the control socket automatically via -e ssh
rsync -avz --mkpath -e "ssh -o ControlPath=$OSSH_CONTROL_PATH" \
  $HOME/.ssh/public_keys/$keyName $toHost:.ssh/public_keys/$keyName

# ssh also uses it
ssh -o ControlPath="$OSSH_CONTROL_PATH" $toHost "user update.authorized_keys"
```

### Part 3: Integration into push.key workflow

The typical workflow becomes:

```bash
# User runs:
./ossh push.key myhost

# Internally:
# 1. ossh.connection.open myhost  ← password entered ONCE here
# 2. rsync key file               ← reuses connection, no password
# 3. ssh run authorized_keys      ← reuses connection, no password
# 4. Connection stays open for 10 min for further operations
```

For `private.push.init.oosh` (first-time install), the flow is:
```bash
# 1. ossh.connection.open $sshConfigHost  ← password entered ONCE
# 2. rsync init/oosh + public_key         ← reuses connection
# 3. ssh run ./oosh mode ssh ...          ← reuses connection
# After key is authorized, no more passwords needed
```

## Implementation Steps

1. **Add `ossh.connection.open` and `ossh.connection.close` methods** to `ossh`
2. **Add `OSSH_CONTROL_PATH` variable** to config or as a local in ossh
3. **Replace all `scp` calls with `rsync`** using the mapping table above
4. **Add `-e "ssh -o ControlPath=$OSSH_CONTROL_PATH"` to all rsync calls**
5. **Add `-o ControlPath="$OSSH_CONTROL_PATH"` to all ssh calls** in push/pull methods
6. **Call `ossh.connection.open` at the start** of each push/pull method that does remote ops
7. **Test with both**: authorized key (no password) and unauthorized key (one password prompt)
8. **Handle older rsync**: check for `--mkpath` support, fall back to `--rsync-path="mkdir -p ... && rsync"` if needed
9. **Update `user` script** SCP calls to match the same pattern
10. **Add completion for `ossh connection.open` and `ossh connection.close`**

## Edge Cases

- **rsync not installed on remote**: Fall back to `ssh $host "mkdir -p dir" && scp ...` (2 passwords without ControlMaster, but at least works)
- **ControlMaster connection drops**: Check with `ssh -O check` before reusing, re-open if needed
- **Multiple hosts in sequence**: Each host gets its own control socket (the `%h` in path)
- **Concurrent access**: ControlPath uses `%r@%h:%p` which is unique per user@host:port

## Files to Modify

- `components/OOSH/dev.claude/ossh` — main changes (all push/pull methods)
- `components/OOSH/dev.claude/user` — SSH key push methods (lines 118, 135)
- `components/OOSH/dev.claude/init/once` — SCP calls (lines 3012-3041) — low priority, legacy

## Testing

- `ossh push.key <host>` with unauthorized key → should prompt password ONCE, create dirs, push key
- `ossh push.config <host>` with no `config/` dir on remote → should succeed
- `ossh push.id <host> <id>` with no `.ssh/ids/` dir on remote → should succeed
- `ossh push.dir <host> <dir>` → should work as before
- Verify ControlMaster reuse: run two push operations in sequence, only first should prompt
