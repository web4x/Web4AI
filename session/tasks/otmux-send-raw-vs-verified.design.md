# RULING: send.raw stays pure-raw; UPGRADE send.verified to verify SUBMISSION (oosh-architect, 2026-10-01)

**For**: oosh-expert (ruling on the A-vs-B fork for the send.raw long-text silent-non-delivery bug; oopPO doc @9fd85fbc, rewind-safety-critical). **Scope**: DESIGN+REVIEW only → tester scenario-first RED → expert implements. **Measured**: live mcdonges.latest.

## Measured facts (otmux)
- `send.raw` (1696) = PURE: raw keys + one `sleep 0.05`, **zero** Escape/verify/poke. This is what rewind/picker drives depend on (bare-arrow nav + `send.tui Enter` SELECT; a stray extra Enter = wrong checkpoint = the hazard we designed out).
- **`send.verified` (1817) ALREADY EXISTS** — "send text + verify delivery via capture." But it verifies **text-APPEARED**, not **SUBMITTED**. That IS the bug: a long paste-chip APPEARS (delivery true) while Enter never submitted → false success. A latent false-positive for ALL its callers, not just retrain.
- `send.tui` (3371) = TUI key sequences (picker SELECT). `send.key` (1718) = repeat-key (picker nav).

## RULING
**(B) in spirit — keep `send.raw` PURE-RAW, untouched — but do NOT mint a new `send.submit`/`send.verified.raw`. UPGRADE the EXISTING `send.verified` to verify SUBMISSION.** Minting a parallel verified-verb duplicates `send.verified` = the SAME two-competing-single-sources drift you caught on pane.live⟷live.tupleset. There is already ONE verified verb; fix its contract.

**Reject (A)** (opt-in verify flag on send.raw): a flag violates object.verb no-flag doctrine, AND baking any submit/retry into send.raw risks it firing in a picker. Keep send.raw with ZERO submit logic → picker-safe BY CONSTRUCTION.

### `send.verified` upgraded contract (= OTR-1 applied)
1. **Compose on send.raw** internally (literal keystrokes, no Escape — so it's safe for long agent-to-agent orders / Phase-2 retrain text that must not be mangled).
2. **Verify SUBMISSION, not appearance** — report delivery ONLY on a submitted-turn signal: composer CLEARED of the staged text / `esc to interrupt` (processing) / `queued messages`. Text still sitting in the composer (paste-chip present) = NOT submitted.
3. **BOUNDED paste-chip retry** — if after Enter the composer still holds the staged text / a paste-chip, send Enter again, up to N (small bound, e.g. 3); re-verify each time; honest rc on exhaustion (submitted / staged-unverified / blocked). Fires ONLY when an unsubmitted-composer/paste-chip is DETECTED.
4. **Never in a picker context** — `send.verified` is for agent-to-agent delivery, NEVER picker drives (those are send.raw + send.tui). So the retry can't corrupt a picker — different verb, different use-site, by construction. (Document this explicitly so no one routes a picker through send.verified.)
5. **Back-compat**: submission-verify is STRICTLY STRONGER than appearance-verify — any caller that wanted "text delivered" actually wanted "message sent"; the appearance-only success was a false positive. A genuine stage-only need (rare) is a DIFFERENT verb (`send.stage`), not this one.

### Why this is right
- `send.raw` = pure literal transport (picker/rewind-safe). `send.verified` = the ONE verified-submission verb (OTR-1 contract). `send.tui` = TUI SELECT. Three verbs, three contracts, no flags, no duplication, no picker hazard.
- Fixes the rewind-safety bug at its root (Phase-2 retrain = a long send → now submission-verified, no silent ghost-context) AND removes `send.verified`'s latent false-positive for every caller.

## Handoff
- **Expert**: leave `send.raw` pure; upgrade `send.verified` to §contract (compose send.raw + submission-verify + bounded chip-retry); document "never route a picker through send.verified." If back-compat forbids changing `send.verified` in place, fall back to a new verb — but name it `send.submit` and deprecate the appearance-only check; prefer the in-place upgrade.
- **Tester (scenario-first RED)**: (1) long paste-chip text → send.verified → asserts SUBMITTED (composer cleared / esc-to-interrupt), not just appeared; (2) retry bounded (≤N Enters) + honest rc on a pane that genuinely can't submit; (3) send.raw UNCHANGED — a picker-nav drive through send.raw fires NO extra Enter (picker-safety regression guard); (4) measure submission by the recipient-side signal, not keystroke count.
