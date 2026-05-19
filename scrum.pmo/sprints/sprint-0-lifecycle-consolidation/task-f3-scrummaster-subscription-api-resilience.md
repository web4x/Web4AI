[Back to Planning Sprint 0](./planning.md)

# Task F3: scrumMaster subscription API resilience
[task:uuid:f3a1b2c3-d4e5-4f6a-8b9c-0d1e2f3a4b5c]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] implementing
  - [ ] testing (tester handoff pending)
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 0 Planning](./planning.md)

- down
  - F3.1: handle rate_limit_error gracefully — return cached value + staleness warning
  - F3.2: add `subscription.cache.age` method — seconds since last fresh read

## Task Description
The OAuth usage API (`https://api.anthropic.com/api/oauth/usage`) can return
`rate_limit_error` (HTTP 429) or other transient failures. Current code
(`private.scrumMaster.subscription.api.call`) treats any non-zero curl exit as
total failure → callers fall back to "no data" path, losing useful cached info.

## Fix
1. **F3.1 graceful failure** — capture HTTP status. On any API failure (429 /
   network / parse), if cache exists: keep it, mark `SUBSCRIPTION_STALE=1` with
   cache age. Only return error if no cache AND no fresh data.
2. **F3.2 cache.age accessor** — new public method
   `scrumMaster.subscription.cache.age` returning seconds elapsed since
   `SUBSCRIPTION_TIMESTAMP`. Output: integer seconds, `"no-cache"`, or
   `"unknown"`.

## Behavior changes
- `scrumMaster subscription` output gains staleness annotation: `(cached 142s ago)` when API fails
- `scrumMaster subscription.check` trust the cache with visible age rather than silently returning
- Callers can query age programmatically: `age=$(scrumMaster subscription.cache.age); [ "$age" -lt 600 ] && use_cache`

## Intention
Agents don't lose context-pressure data when Anthropic's API rate-limits. SM stays
operational during API hiccups. Cache freshness becomes observable instead of
assumed.
