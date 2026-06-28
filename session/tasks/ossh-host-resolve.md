# Task: ossh host-name ⇄ ssh-config-host resolution

**From**: oosh-po@MacStudio  **Team**: WODA.prod ooshTeam  **Branch**: dev (oosh repo)
**Priority**: HIGH  **Date**: 2026-06-28

## Why (the gap)
Agents are named `role@<sshConfigHost>` (e.g. `oosh-po@WODA.prod` — the `~/.ssh/config` Host alias) for `/remote-control` clarity. But tools that derive the host from the live box get the **physical hostname** (`v60211`), so `hiveMind consistency.audit ooshTeam` flagged `@WODA.prod` ≠ `@v60211` (4 false-positive MEDIUM violations). There is no canonical way to map an ssh-config Host alias to its real hostname or back. **Build that mapping into `ossh` so naming/identity tooling can normalize either direction.**

## What (two resolutions — architect finalizes exact object.verb names + mechanism)
1. **config-host → real hostname**: given an ssh-config Host alias (e.g. `WODA.prod`), return the machine's actual `hostname` (e.g. `v60211`).
2. **real hostname → config-host** (vice versa): given a physical hostname (e.g. `v60211`), return the ssh-config Host alias(es) that reach it (e.g. `WODA.prod`).

Proposed names (architect refine to OOSH object.verb, no flags, camelCase):
- `ossh host.hostname <sshConfigHost>`  → physical hostname
- `ossh host.config <hostName>`         → matching ssh-config Host alias(es)

## Design notes (architect decides)
- Reuse existing config parsing (`ossh config.get`, `private.ossh.config.complete.hosts`, `private.get.sshDir`). Respect `CURRENT_SSH_DIR` (test override) — do NOT hardcode `~/.ssh`.
- Resolution strategy is the architect's call, document the tradeoff:
  - **config-only** (parse HostName, no network) — fast, offline, but can't get the real `hostname` if config only has an IP/alias.
  - **live probe** (`ossh exec <host> hostname`) — authoritative real hostname, but needs connectivity. Consider a cached/config-only default with an explicit live-resolve path (flagless — e.g. a separate method, NOT a `--flag`).
- vice-versa: iterate `~/.ssh/config` Host entries, resolve each, match the target hostname; return all aliases (a hostname can have several).
- Edge cases (tester): unknown host, host with only IP (no resolvable name), multiple aliases → one hostname, unreachable host (live mode), missing/empty ssh config, `CURRENT_SSH_DIR` override.

## Constraints (OOSH first principles — PO guards)
- **No flags** (Death to Flags). If a live-vs-config-only choice is needed, use a positional param or a separate object.verb method — never `--flag`.
- object.verb naming, camelCase params, self-documenting `# <param> # desc` doc comments.
- A `.completion.<param>()` for every completable param (host aliases / hostnames).
- Human-readable errors (no EPERM/line-numbers leaking).
- DRY — one resolution helper, both public methods build on it.

## Owners (WODA.prod ooshTeam, dev branch)
| Role | Owns |
|------|------|
| oosh-architect (0.1) | Design: final method names, resolution strategy (config-only vs live), edge-case contract. Write design into this file. |
| oosh-expert (0.2) | Implement in `ossh` on **dev** after design approved. DRY helper + 2 public methods + completions. |
| oosh-tester (0.3) | `T-HOSTRESOLVE-*` in `test/test.ossh` — both directions + all edge cases. Mock ssh config via `CURRENT_SSH_DIR`. |
| oosh-po (0.0) | Drive + QA: verify both directions live (`ossh host.hostname WODA.prod` → `v60211`; `ossh host.config v60211` → `WODA.prod`), tests green, OOSH-compliant. |

## Acceptance
- [ ] `ossh host.hostname WODA.prod` → `v60211` (config-host → real hostname)
- [ ] `ossh host.config v60211` → `WODA.prod` (hostname → config-host, all aliases)
- [ ] Tab completion both directions
- [ ] `T-HOSTRESOLVE-*` green incl. edge cases (unknown/IP-only/multi-alias/unreachable/empty-config/CURRENT_SSH_DIR)
- [ ] Zero flags; OOSH-compliant; human-readable errors
- [ ] Committed + pushed on **dev**

## Report-back (owner edits + commits + pushes — git mailbox)
- oosh-architect:
- oosh-expert:
- oosh-tester:
- oosh-po (QA):
