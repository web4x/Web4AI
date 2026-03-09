# Task 50: macOS openrsync Bug — NOT DONE

## Found by ScrumMaster testing in oosh shell

macOS ships `openrsync` (protocol 29, "rsync version 2.6.9 compatible"), NOT GNU rsync.

### Problem 1: `--mkpath` not supported
```
$ rsync --mkpath
rsync: unrecognized option `--mkpath'
```

The version check in `private.ossh.rsync` (line 81) correctly falls to the fallback path because openrsync reports "version 2.6.9". So `--mkpath` is never attempted on macOS. Good.

### Problem 2: Fallback assumes GNU rsync on REMOTE
The fallback uses:
```bash
rsync -avz --rsync-path="mkdir -p $remote_dir && rsync" -e "$ssh_opts" "$src" "$dest"
```
This runs `mkdir -p` + `rsync` on the REMOTE side. If the remote also has openrsync (unlikely for Linux servers, but possible for macOS-to-macOS), it works differently.

### Problem 3: openrsync flag compatibility
openrsync may not support all flags used (`-avz`). Need to verify:
- Does openrsync support `-a`, `-v`, `-z`?
- Does the `--rsync-path` trick work with openrsync as the local client?

### What to do
1. Test from the oosh shell: `./ossh push.key <host>` with a real host
2. If rsync fails, may need to detect openrsync and use a different approach
3. Consider: `ssh $host "mkdir -p dir" && rsync ...` as a more portable fallback
4. Test on at least one real host from the ossh list

### Test command
```bash
# In oosh shell:
./ossh connection.open KPP
./ossh connection.status KPP
# Then try a push that creates a remote dir
```
