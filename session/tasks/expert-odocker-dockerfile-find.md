# Task: odocker file.find — Discover Dockerfile Locations

**CORRECTION**: Method name is `odocker file.find` (OOSH pattern: script.method), NOT `dockerfile.find`.

**Priority**: HIGH — fractal Level 1 (Docker base)
**Assigned to**: oosh-expert
**From**: product-owner

## Problem

Running `odocker ps` shows containers and images, but there's no way to find WHERE the Dockerfile lives that built them. Without the Dockerfile, you can't rebuild, modify, or version-control the container.

Example: `naked_ubuntu_20_04` is running but its Dockerfile is nowhere on the filesystem.

## Implement: `odocker file.find`

### Method: `odocker file.find <container-or-image>`

Detection methods (try in order, return first match):

1. **Label check** — `docker inspect` for label `dockerfile.path` or `dockerfile.dir`
2. **Compose label** — `com.docker.compose.project.working_dir` label
3. **Filesystem search** — find Dockerfiles under common locations (`~/`, `/Users/Shared/`), grep for `FROM` base matching the image ancestry, or directory names matching image name
4. **History reconstruct** — if no Dockerfile found, show `docker image history --no-trunc` as a last resort so user can reconstruct

### Output

```
# Found:
Image: naked_ubuntu_20_04
Dockerfile: /path/to/Dockerfile
Directory: /path/to/

# Not found:
Image: naked_ubuntu_20_04
Dockerfile: NOT FOUND
Build history (reconstruct manually):
  FROM ubuntu:20.04
  RUN useradd -rm ...
  RUN echo 'test:test' | chpasswd
  ...
```

### Completions

`odocker file.find <tab>` should complete with:
- Running container names
- Local image names

### Also implement: `odocker build` label enforcement

When `odocker build` is used, automatically add `--label dockerfile.path=$(realpath Dockerfile)` so future `dockerfile.find` calls work instantly.

## Files

- `/Users/donges/oosh/odocker` — add methods
- Follow existing odocker patterns (check commit 1e04861 for the initial implementation)

## Test

After implementing, run:
```
odocker file.find fervent_ritchie
odocker file.find naked_ubuntu_20_04
```

Both should show the history-reconstruct output (since no label exists on this old image).
