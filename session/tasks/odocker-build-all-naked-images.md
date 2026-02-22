# Task: Build All Naked Images with Labels

**Priority**: MEDIUM — completes odocker lifecycle validation
**Assigned to**: odockerTeam (via SM)
**From**: product-owner

## Goal

Now that all odocker methods are implemented, use them end-to-end:

1. `odocker workspace.list` — see what's available in DockerWorkspaces
2. `odocker build.all` — build everything (with labels injected by `odocker build`)
3. `odocker status` — verify all images built, check disk usage
4. `odocker file.find <image>` — verify Tier 1 label detection works (not just Tier 4 history)
5. `odocker disk` — check total disk usage after builds
6. If disk usage is high: `odocker prune` to clean up dangling/old images

## Validation

After build.all completes:
- Every image built by `odocker build` should have `dockerfile.path` and `dockerfile.dir` labels
- `odocker file.find <any-built-image>` should resolve via Tier 1 (labels), not Tier 3/4
- Report which images built successfully and which failed

## Then

If time allows, the expert can look at the framework bug (method doubling on error exit, Task #50). Or stand by for next assignment.
