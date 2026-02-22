# Docker Image Lifecycle

*Source: `../Claude.all/DockerWorkspaces/` — Tron's Docker infrastructure*

## Directory Structure

```
Claude.all/DockerWorkspaces/
├── DOCKER README.txt          ← General docker usage notes
├── DockerImageTemplate/       ← Template for new images
├── WODA/                      ← WODA docker workspace
├── nakedUbuntu/
│   ├── 18.04/                 ← Ubuntu 18.04 variant
│   ├── 20.04/                 ← Ubuntu 20.04 (no sshd)
│   └── 20.04.sshd/           ← Ubuntu 20.04 with SSH ← ACTIVE
├── nakedAlpine/
├── nakedDebian9.12/
├── minimalLinux/
├── plantuml/
└── structr/
```

## Active Image: naked_ubuntu_20_04 (20.04.sshd)

| File | Purpose |
|------|---------|
| `Dockerfile` | Ubuntu 20.04, net-tools, wget, openssh-server, sudo, user test:test, sshd on port 22 |
| `buildDockerfile` | `docker build -t naked_ubuntu_20_04 .` |
| `runDockerfile` | Maps 8022→22, 8080, 8443, 5001-5002, 5005, mounts EAMD sbin + docker.sock |

## Running Container

- Name: `fervent_ritchie`
- Image: `naked_ubuntu_20_04`
- SSH: `ssh -p 8022 test@localhost` (pw: test)
- Root login: enabled via sshd_config

## Web4x Principle: Naked Means Naked

Images are called "naked" for a reason. The ONLY precondition is SSH connectivity. **No deps baked in.**

Web4x = each software manages its own lifecycle from ground up. oosh installs itself into a naked container via SSH, pulls its own deps, bootstraps itself. You don't add git/tmux/curl to the Dockerfile — oosh's install process handles that.

**Wrong**: `docker exec ... apt-get install git tmux` (ad-hoc, CMM1)
**Wrong**: Add deps to Dockerfile (baking deps into image, not self-managing)
**Right**: `ossh` into container → oosh bootstrap handles everything

## buildDockerfile / runDockerfile = Walking Sticks

These shell scripts are CMM1/2 — they work but they're not oosh-managed:
- `buildDockerfile` → will become `odocker build nakedUbuntu`
- `runDockerfile` → will become `odocker run nakedUbuntu`

## odocker: OOSH Docker Wrapper (PREREQUISITE)

Following the naming pattern: tmux→otmux, ssh→ossh, docker→odocker.

Own script, own completion, no flags. Must exist BEFORE any Docker work in the fractal stack. Without it, every Docker operation is raw commands with flags = CMM1.
