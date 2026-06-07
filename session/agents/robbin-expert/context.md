# robbin-expert Context — Save Point 2026-06-07

**Role**: Web4RawBin Implementation Authority
**Status**: v0.5.104 deployed. B1+B2 narrowing fixed. R18.13-15 next.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.104. 876/876 tests pass.

## Key architecture
- LOCKED 7-step chain: Req → Task → UC → Class → Method → Impl → Test
- Two tree modes: ?mode=trace (narrowed) vs ?mode=scenario (fan-out)
- chainMethod hint: server returns UC.method alongside Class child in trace mode
- Sprint→Task nav roots via /api/trace/sprints
- Cycle guard: per-branch ancestors Set; one-layer lazy-load
- Forward-only at server (/api/trace) + client (forwardOnly())
- STATIC_SHELL auto-injected by build.mjs
- Let's Encrypt auto-detect with self-signed fallback

## Standing rules
- Version bump #66; STATIC_SHELL #67 (auto); implementing [x]; report to 0.0
- No clients.claim in SW; parser: one + line = one method

## NEXT: R18.13-15
