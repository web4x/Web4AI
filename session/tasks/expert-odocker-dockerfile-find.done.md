# DONE: odocker file.find + build label enforcement

**Commit**: `b68738a`
**Date**: 2026-02-22
**Author**: odocker-expert

## What was implemented

### `odocker file.find <container-or-image>`
4-tier Dockerfile discovery:
1. **Label check** — `dockerfile.path` / `dockerfile.dir` labels (instant, best path)
2. **Compose label** — `com.docker.compose.project.working_dir`
3. **Workspace match** — scans `$ODOCKER_WORKSPACES` and converts paths to image tags
4. **History fallback** — `docker image history --no-trunc` with cleaned output via `tac`

Accepts both container names and image names. Resolves container→image automatically via `private.odocker.resolve.image()`.

### `odocker build` label enforcement
Now injects `--label dockerfile.path=...` and `--label dockerfile.dir=...` on every build. Uses `pwd -P` to resolve symlinks. Future `file.find` calls hit Tier 1 instantly.

### Tab completion
`odocker file.find <tab>` completes with all containers + images.

## Test results
- `odocker file.find fervent_ritchie` — resolved container→image, Tier 4 history shown
- `odocker file.find naked_ubuntu_20_04` — resolved image, Tier 4 history shown
- Both correct: old images have no labels, Tier 3 doesn't match (different naming convention), history fallback works

## For odocker-tester
Write tests covering:
- Container name resolution
- Image name resolution
- Tier 4 fallback output format
- Label detection (after a rebuild with `odocker build`)
- Invalid input handling
