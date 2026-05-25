# D5 — tronMonitor stale read-only client cleanup

**Sprint**: 1 (state correctness)
**Priority**: P1 CRITICAL
**Predecessors**: B6 (otmux.client.cleanup, d860bec), B8 (size floor), SC-D.2 (scrumMaster.cycle, cef6e8f), SC-B events

## Problem

`window-size=largest` (B4.2) means tmux sizes each session to the LARGEST attached client. tronMonitor.setup creates GNU screen windows that attach read-only tmux clients (`TMUX= tmux attach -r`). When screen dies or terminal is resized tiny, these clients survive as zombie 1×3 attachments. Real clients detach → 1×3 zombies remain → ALL panes crush to 1×3.

Manual `client.cleanup read-only + floor.apply` fixes temporarily but doesn't prevent recurrence. Bug recurred 2026-05-14 (20 zombies idle 50h).

## Fix

**New surgical detach primitive in otmux** (replaces bulk):

```
otmux.client.cleanup.stale <?idleMin:30> <?maxSize:0> <?filter:read-only>
```

Detaches clients matching `<filter>` that are idle ≥`<idleMin>` minutes. Optional `<maxSize>` (when >0) also requires client width AND height ≤ maxSize — surgical "tiny zombie" filter. Idempotent. Single `refresh-client -S` at end re-syncs survivor sizes.

**Targeted helper in tronMonitor**:

```
private.tronMonitor.clients.detach.session.readonly <teamSession>
```

Detaches only read-only clients attached to specific session — used when removing a single team (no need to bulk-sweep all monitors).

**Wired at 5 sites**:

| Site | Action | Rationale |
|------|--------|-----------|
| tronMonitor.setup | `client.cleanup read-only` BEFORE screen create | clear stale remnants from prior runs |
| tronMonitor.reset | `client.cleanup read-only` AFTER kill screen | orphan clients of destroyed screen |
| tronMonitor.remove | targeted-session detach AFTER kill window | surgical — don't touch other teams |
| tronMonitor.sync | `client.cleanup.stale 60 10 read-only` at end | conservative: 1h idle AND <10×10 |
| scrumMaster.cycle | `otmux client.cleanup.stale 30 0 read-only` after reconcile | broad: 30min idle, any size, periodic safety net |

## Why not emit SC-B `client.cleaned` event?

Scope creep. New event type requires handler registration + handler implementations + tester coverage. Cleanup is observable via `info.log` and reconcile counters — sufficient for D5. Event-emit can be a follow-up if SM needs reactive monitoring.

## Acceptance

- `bash -n` clean for otmux, tronMonitor, scrumMaster
- `otmux.client.cleanup.stale` defined; idempotent on zero clients
- All 4 tronMonitor sites + 1 scrumMaster site call the appropriate primitive
- Manual smoke: kill tronMon screen → run `scrumMaster.cycle` → orphan read-only clients detached, sessions return to full size

## Commit

`hiveMind+otmux+tronMonitor+scrumMaster: D5 stale read-only client cleanup (ref: d5-tronmonitor-client-cleanup.md)`

Wait — single bundle but spans 3 files. SM rule allows logical bundle. Use:
`tronMonitor+otmux+scrumMaster: D5 stale read-only client cleanup (ref: d5-tronmonitor-client-cleanup.md)`
