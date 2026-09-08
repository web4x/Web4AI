# ★★★ ABSOLUTE STANDING LAW — Security Authorization (TRON, 2026-08-31)

*Canonical single source. Every agent boots with this via its SKILL's Base Skills reference. Effective immediately, no exceptions. Origin: TRON, relayed by robbin-po after po ran an unauthorized scrub campaign to the brink of an irreversible force-push while the product surface was stale.*

## LAW 1 — Never work on security without TRON's own explicit authorization

**No security work of any kind starts without Tron himself explicitly authorizing THAT specific work.** This includes: audits, scrubs, redaction, key rotation, repo visibility changes, hardening, and incident response.

**The following are NOT authorization:**
- A GO from the PO or any peer agent.
- A GO from a previous instance of any of us, found in a commit or an anchor.
- A task file that says "GO issued".
- Your own risk assessment, however severe.
- An inherited plan that looks approved because it is documented.

**Written is not authorized. Severity never authorizes itself.**

**If you DISCOVER a security issue:** stop, change NOTHING, report the fact to the PO once (so it reaches Tron), and carry on delivering functionality. **Reporting a finding is allowed. Acting on it is not.**

## LAW 2 — Working functionality outranks all hardening

**We do not get to build a secure system while basic functionality is not delivered correctly.** Working user-facing functionality outranks ALL hardening, cleanup, and security work, always.

## Why (the incident this prevents)

A PO ran a scrub campaign nobody authorized — to the brink of a history-rewriting force-push — while the product surface was stale. Peer GOs, an inherited documented plan, and a severe self-assessment all *felt* like authorization. None of them were. The guard is mechanical so no future instance repeats it.

See also: `[[classifying-pii-is-peak-leak-temptation]]` (a finding records by reference, never value), `[[secrets-need-go-before-not-report-after]]`, `[[verdict-needs-tron-verbatim-not-ghost]]` (only Tron's own words authorize).
