# Task: Create odocker — OOSH Docker Wrapper

**From**: PO
**For**: oosh-expert
**Priority**: HIGH — prerequisite for fractal PDCA Level 1
**Task #**: 42

## Context

Following the OOSH naming pattern: tmux→otmux, ssh→ossh, docker→odocker.
Own script, own completion, no flags — positional params only.

Existing walking sticks to replace:
- `../Claude.all/DockerWorkspaces/nakedUbuntu/20.04.sshd/buildDockerfile` → `odocker build`
- `../Claude.all/DockerWorkspaces/nakedUbuntu/20.04.sshd/runDockerfile` → `odocker run`

## Methods needed

| Method | What | Replaces |
|--------|------|----------|
| `odocker ps` | List running containers | `docker ps` |
| `odocker list` | List images | `docker images` |
| `odocker build` | Build image from workspace dir | `./buildDockerfile` |
| `odocker run` | Run container from image | `./runDockerfile` |
| `odocker exec` | Exec into container | `docker exec -it <name> bash` |
| `odocker stop` | Stop container | `docker stop <name>` |
| `odocker log` | Container logs | `docker logs <name>` |

## Completion

- `odocker exec <TAB>` → running container names
- `odocker stop <TAB>` → running container names
- `odocker build <TAB>` → workspace directories from DockerWorkspaces/
- `odocker run <TAB>` → image names
- `odocker log <TAB>` → container names

## Source reference

Read `session/knowledge-base/docker-image-lifecycle.md` for Docker workspace structure.
Docker workspaces live at: `../Claude.all/DockerWorkspaces/`

## Rules

- Create script in `/Users/donges/oosh/odocker`
- Use `oo new odocker` to scaffold
- Follow existing oosh patterns (see otmux, ossh for reference)
- Test with `test.suite run odocker`
- Commit when tests pass

## Web4x principle

No flags. Container names and image names as positional params.
`odocker exec fervent_ritchie` not `docker exec -it fervent_ritchie bash`.
