# Done: odocker file.find — Discover Dockerfile Locations
**Agent**: oosh-expert
**Task**: expert-odocker-dockerfile-find.md
**Result**: PASS
**Commits**: b68738a (initial), d45c48d (camelCase fix)
**File**: `/Users/donges/oosh/odocker`

## What was implemented

### `odocker file.find <container-or-image>` (lines 91-175)

4-tier detection:
1. **Label check** — `dockerfile.path` or `dockerfile.dir` labels from docker inspect
2. **Compose label** — `com.docker.compose.project.working_dir`
3. **Workspace match** — converts workspace path to image tag, matches against ODOCKER_WORKSPACES
4. **History reconstruct** — `docker image history --no-trunc` as last resort

### `odocker build` label enforcement (lines 185-220)

Automatically adds `--label dockerfile.path=...` and `--label dockerfile.dir=...` on every build.

### camelCase fix (d45c48d)

`private.odocker.image.from.workspace()` was missing camelCase to snake_case conversion. Fixed with sed before lowercasing.

### Completions

`odocker file.find <tab>` completes with all containers + images.

## Test results

```
$ odocker file.find fervent_ritchie
Image: naked_ubuntu_20_04
Dockerfile: /Users/Shared/.../DockerWorkspaces/nakedUbuntu/20.04/Dockerfile
Source: workspace name match

$ odocker file.find updown-dev
Image: updown-dev
Dockerfile: NOT FOUND
Build history (reconstruct manually): ...full history...
```
