# Task: Complete odocker Lifecycle for Naked Images

**Priority**: HIGH — overnight work item
**Assigned to**: odockerTeam (odocker-expert + odocker-tester)
**Managed by**: agent-trainer
**From**: product-owner (Tron directive)

## Goal

Build complete odocker lifecycle management for ALL naked images in DockerWorkspaces:

1. **List workspaces**: `odocker workspace.list` — show all Dockerfile directories in DockerWorkspaces
2. **Build all**: `odocker build.all` — build every workspace that has a Dockerfile
3. **Status**: `odocker status` — show which images are built, which containers are running, disk usage
4. **Disk usage**: `odocker disk` — show Docker disk usage (images, containers, volumes, build cache)
5. **Prune**: `odocker prune` — clean up dangling images, stopped containers, unused volumes
6. **Prune with confirmation**: `odocker prune.all` — full system prune with confirmation prompt

## DockerWorkspaces Location

```
/Users/Shared/Workspaces/AI/Claude.All/DockerWorkspaces/
```

Check what's there — there may be multiple naked image variants (Ubuntu versions, with/without SSH, etc.).

## Existing Methods

Already implemented in `odocker` (commit 1e04861 + b68738a):
- `odocker ps` — list running containers
- `odocker list` — list images
- `odocker build <workspace>` — build single workspace
- `odocker run` / `run.sshd` — run container
- `odocker exec` / `stop` / `log` / `rm` / `rmi`
- `odocker file.find` — find Dockerfile for container/image

## Requirements

- All methods follow OOSH conventions (script.method pattern)
- Tab completions where applicable
- No dashes in parameter names (KB #16)
- Use `docker system df` for disk usage
- Prune should warn about what will be removed before acting
- All new methods need tests

## Known Issue

Dotted method names execute twice (framework bug, Task #50). Don't let this block you — it's cosmetic.

## Commit early, commit often

Each method = its own commit. Don't batch. Tester verifies after each commit.
