# Migration Learnings → requirements for `hiveMind team.push` (from 2 live manual migrations)

**From**: oosh-po@MacStudio (lived ooshTeam + robbinTeam2 manual migrations, 2026-06-24)
**To**: WODA.prod ooshTeam (oosh-po@WODA.prod + architect + expert + tester) — fold into the team.push sprint
**Why**: each pain below is a controller requirement + a test. Two migrations done by hand; here's what bit, so the tool never repeats it.

## Identity (the biggest lesson)

1. **`claudeCode session.name <uuid>` is the ONE source of truth for role.** Everything else lied:
   - `claudeCode list` role labels were **stale/shifted** (labeled a session "tester" whose real title was "req").
   - `hiveMind team.status` live-discovery was **buggy** — it hallucinated a "robbin-planner" that doesn't exist and mislabeled tester→req.
   - pane titles and registry can be wrong/stale.
   → **Controller rule**: resolve every role via `session.name`, never from list/team.status/pane-title. Test: T-IDENTITY-TRUTH — mapping comes from session.name only.

2. **Duplicate / ambiguous identities are real.** Two sessions both had customTitle `robbin-tester@MacStudio` (562b0ce2 Jun10 vs f7db409b Jun16). → Controller must **dedup by recency + training size** (mtime, line-count) and surface duplicates for confirmation; pick the newest-trained as canonical. Test: T-DEDUP.

3. **Dead ≠ skip.** The *canonical* tester (f7db409b) was **DEAD** in `claudeCode list`; the live one (562b0ce2) was an older incarnation. Migrating only the "green/live" panes misses the real agent. → Resolve canonical by identity+recency, fork even if dead (JSONL is resumable). Test: T-DEAD-CANONICAL.

## Placement & fork

4. **JSONL → TARGET project-hash dir**, computed from the target workspace path (`/var/dev/Workspaces/AI/Claude` → `-var-dev-Workspaces-AI-Claude`), NOT the source hash. Verified: once in the target hash, `claudeCode list` on the target surfaces it. (#7) Test: T-PUSH-HASH.

5. **`claudeCode fork` needs the FULL uuid** (8-4-4-4-12); short form is rejected. Normalize short→full in the controller.

6. **`cd` to the TARGET workspace before fork** (must match the JSONL's hash), not a source-derived path.

## Choreography hazards (where the manual way broke)

7. **Batched renames over the double-hop FAIL.** `/rename` + double-Enter sent in a loop (MacStudio→ssh→otmux→pane) didn't apply — names stayed bare. → **Per-pane, verify each**: after `/rename`, capture and assert "Session renamed to role@host". Same for `/remote-control` (capture the /rc URL). Test: T-RENAME-VERIFY, T-RC-VERIFY.

8. **`otmux new` ATTACHES when the caller isn't already in tmux.** Creating robbinTeam2 from a plain ssh shell attached my control shell (nested tmux); had to `C-b d` to recover. → Controller must create sessions **detached without attaching the driver** (and its `-x/-y` args got swallowed as the session command — mind otmux.new's signature `<?name> <?command>`). Bug to fix in otmux.new or use a safe create path.

9. **`consistency.fix` is interactive (y/N) and aborts with no input** → no mutations. The non-interactive path `consistency.reconcile --apply` uses a **flag** (OOSH "death to flags" violation, see #5 flag-audit). → Controller needs a **flagless non-interactive reconcile** to apply MVC fixes in an automated push. Test: T-RECONCILE-NONINTERACTIVE.

10. **MVC stores drift independently.** registry, pane title, session customTitle, sessions.env disagreed (audit: 12 violations after a manual migration). → Reconcile to `session.name` truth **at each step**, not just at the end; final `consistency.audit` must be 0. Test: T-PUSH-PARITY.

11. **Per-pane PDCA, NOT batch-then-hope.** Firing 6 forks at once and trusting is exactly where the identity confusion hid. Verify each agent (session.name + state) before the next.

## Workspace replication

12. **Clone the agents' work-repo AND replicate its symlinks.** robbinTeam2 needed Web4RawBin cloned to WODA.prod **and** symlinked into `Claude/workspaces/Web4RawBin` (agents reach their repo via that link from their CWD). The controller's repo-sync step must replicate workspace symlinks, not just the session repo. Test: T-PUSH-WORKSPACE-LINKS.

## Process anti-patterns (for the drivers, not the tool)

13. Avoid in any driver/script: **until-loops for polling**, **`2>/dev/null` / `2>&1` suppression**, **`| tail`/`| head`/`| grep` on shown output**. They aggregate background tasks, burn context, and hide the truth you need. Capture the pane raw; act on real output.

## Net for the sprint
The controller's spine: **session.name = truth → dedup+canonical (recency) → place in target hash → fork full-uuid (cd target) → per-pane verify → rename role@host (verified) → /rc (verified) → reconcile non-interactively → consistency.audit == 0**, with workspace repo+symlinks synced. Every step verify-or-fail.

## Report-back (WODA.prod ooshTeam — edit here)
- oosh-po@WODA.prod (folded into sprint stories/tests):
- architect / expert / tester:
