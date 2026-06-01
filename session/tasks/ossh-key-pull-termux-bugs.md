# Bug: ossh key.pull broken on Termux (Android)

**Priority**: HIGH
**Date**: 2026-05-29
**Platform**: Termux on Samsung Tablet (Android)

## Reproduction

```bash
ossh key.pull MacStudio
```

## 4 Bugs Found

### BUG 1: SSH identity path doubled
```
no such identity: /data/data/com.termux/files/home/.ssh/ids//data/data/com.termux/files/home/.ssh/id_rsa/id_rsa
```
The sshDir (`/data/data/com.termux/files/home/.ssh`) is being concatenated with itself. Likely `private.get.sshDir` returns the full path, then the code prepends `$HOME/.ssh/ids/` again.

### BUG 2: Missing function `get.file.name`
```
/Users/donges/oosh/this: line 145: get.file.name: No such file or directory
/Users/donges/oosh/this: line 148: get.file.name.usage: command not found
```
`get.file.name` is called but doesn't exist. Either it was removed, renamed, or never ported. The `this.load` fallback also fails.

### BUG 3: rsync not available on Termux
```
/data/data/com.termux/files/home/oosh/ossh: line 100: rsync: command not found
```
ossh uses `rsync` for file transfer, but rsync isn't installed by default on Termux. Fix: fall back to `scp` when rsync is unavailable, or use `pkg install rsync` as a prerequisite check.

### BUG 4: ControlPath socket too long
```
unix_listener: cannot bind to path /tmp/ossh-donges@macstudio.fritz.box:22.J0oFR3PRJ6SVvMmV: No such file or directory
```
Unix domain socket paths have a ~104 char limit. The ControlPath template generates paths that exceed this on Termux where hostnames are long. Fix: use shorter ControlPath template (e.g., hash the hostname).

## Cross-Platform Note

These bugs are Termux-specific but reveal general fragility:
- Hard-coded path assumptions (BUG 1)
- Missing function (BUG 2 — affects ALL platforms)
- Tool dependency without fallback (BUG 3)
- Socket path length assumption (BUG 4)

## Acceptance Criteria

- [ ] `ossh key.pull <host>` works on Termux
- [ ] sshDir path not doubled
- [ ] `get.file.name` exists or is replaced
- [ ] Falls back to scp when rsync unavailable
- [ ] ControlPath uses short/hashed socket names
- [ ] Still works on macOS and Linux
