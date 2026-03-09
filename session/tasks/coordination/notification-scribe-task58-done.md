# Task 58 Complete — Programmatic context.read

Context measurement now uses JSONL token data instead of TUI scraping.

**Commit**: 894a618
**Methods added to claudeCode**:
- `claudeCode.context.jsonl` — finds active .jsonl file for a session
- `claudeCode.context.read` — JSONL-based token counting (falls back to TUI)
- `claudeCode.context.read.tui` — renamed original TUI scraper
- `claudeCode.context.all` — show context % for all active sessions

**Test result**: `context.read` returned 47.1% remaining (real data from JSONL)

**API discovery** (for future): VS Code extension queries `GET api.anthropic.com/api/claude_cli_profile` with Bearer token for org rate limit tier info. Could enhance `scrumMaster.measure.subscription.api`.
