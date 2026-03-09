# Task 29 — Fix Subscription Measurement (Specification Correction for Task.27)

**Created**: 2026-02-04T13:23Z
**Status**: Done (commit 2c7cf52, validated by Tester)
**Priority**: High — prevents rate-limit cascades
**Requested by**: Product Owner (via claudeWoda session, woda-writer)
**Assigned to**: oosh-expert, oosh-tester
**Depends on**: Task.27 (steps 1-8 done, existing pane-scraping stays)

## Original Directive (verbatim)

> Task.27 (ScrumMaster Measurement Capabilities) was a **specification failure**. The woda-writer specified pane-scraping metrics — extracting token counts from `tmux capture-pane` output with regex. The expert implemented it perfectly: 14/14 tests pass, proper OOSH methods, Tab completions. But it measures the **wrong thing**. When we hit 93% subscription limit, `scrumMaster measure.subscription` reported "4,300 tokens combined." Because it only sees what's in the last 20 lines of each pane's TUI output — not actual subscription consumption.
>
> An **OAuth usage API** already exists. One HTTP call returns exact subscription utilization percentages.

## Problem

`scrumMaster measure.subscription` (Task.27) scrapes pane output for token counts — this does NOT measure actual subscription consumption. The Anthropic OAuth usage API at `GET https://api.anthropic.com/api/oauth/usage` returns exact utilization percentages (five_hour, seven_day, per-model) in one call. Task.27's existing pane-scraping methods remain useful for per-agent activity metrics but are NOT subscription monitors.

## API Details

- **Endpoint**: `GET https://api.anthropic.com/api/oauth/usage`
- **Auth**: OAuth token from macOS Keychain (`security find-generic-password -s 'Claude Code-credentials' -w`)
- **Headers**: `Authorization: Bearer $TOKEN`, `anthropic-beta: oauth-2025-04-20`, `Accept: application/json`
- **Returns**: `five_hour.utilization`, `seven_day.utilization`, `seven_day_opus`, `seven_day_sonnet`, `extra_usage` — all as percentages with `resets_at` timestamps

Full spec with working curl example: `session/tasks/Task.29.subscription-measurement-fix.md`

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | oosh-expert | Implement `scrumMaster.measure.subscription.api` — calls OAuth endpoint, parses JSON, returns utilization percentages. Private methods: `private.measure.subscription.api.auth()` (Keychain token extraction), `private.measure.subscription.api.parse()` (JSON parsing). OOSH conventions: Tab completion, no flags. |
| 2 | oosh-expert | Add alerting thresholds: `five_hour.utilization > 80` → warning via `console.log`, `> 90` → error via `error.log`. Store results to `~/config/metrics/subscription.<timestamp>.env`. |
| 3 | oosh-expert | Document existing pane-scraping methods (Task.27's `measure.pane`, `measure.team`) as **agent activity metrics**, not subscription monitors. No removal — they serve a different purpose. |
| 4 | oosh-tester | Test API call with real credentials — verify utilization percentages returned |
| 5 | oosh-tester | Test alert thresholds (mock utilization at 80%, 90%, 95%) |
| 6 | oosh-tester | Test graceful fallback when Keychain unavailable or API returns malformed response |

## Public API (clean OOSH)

```bash
./scrumMaster measure.subscription.api          # Real subscription utilization from OAuth API
./scrumMaster measure.subscription.api --detail  # Per-model breakdown (if needed)
```

## Private Methods

```bash
private.measure.subscription.api.auth()   # Extract OAuth token from macOS Keychain
private.measure.subscription.api.parse()  # Parse JSON response into metrics
```

## Acceptance Criteria

- [ ] `scrumMaster measure.subscription.api` calls OAuth endpoint and returns utilization percentages
- [ ] OAuth token extracted from macOS Keychain (`Claude Code-credentials`)
- [ ] Response parsed: `five_hour.utilization`, `seven_day.utilization`, per-model breakdowns
- [ ] Alert at >80% utilization (warning), >90% (error via `error.log`)
- [ ] Metrics persisted to `~/config/metrics/subscription.<timestamp>.env`
- [ ] JSON parsing and auth in `private.` methods (hidden from completion)
- [ ] Graceful fallback when Keychain unavailable
- [ ] Graceful handling of malformed API responses
- [ ] Existing Task.27 pane-scraping methods (`measure.pane`, `measure.team`) unchanged — documented as agent activity metrics
- [ ] Tab completion for `measure.subscription.api`
- [ ] Tests validate real API call, thresholds, and error handling

## Future: Scrum-Master Periodic Monitoring (Step 3 from spec)

Not in scope for this task, but noted: the scrum-master agent should call `scrumMaster measure.subscription.api` periodically (after every PDCA cycle). This is the CMM4 feedback loop: measure → detect → alert → throttle. Requires Agent Trainer SKILL.md update (separate task).
