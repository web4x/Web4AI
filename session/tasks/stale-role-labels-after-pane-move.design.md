# DESIGN: stale role labels + send-by-name misroute after a pane move (oosh-architect, 2026-10-28)

**From**: oosh-po (Tron bug). **Scope**: DESIGN → oosh-tester (ooshTeam:0.3) owns acceptance → oosh-expert implements → PO gates.
**Measured live (read-only, via otmux + grep)** after the 10-28 pane move.

## Measured
| pane | LIVE title (truth) | `hivemind.roles.env` (stale) |
|---|---|---|
| ooshTeam:0.1 | `✳ oosh-architect@WODA.prod` | scrum-master |
| ooshTeam:0.2 | `✳ oosh-expert@WODA.prod` | oosh-architect |
| ooshTeam:0.3 | `✳ oosh-tester@WODA.prod` | oosh-expert |
| ooshTeam:0.4 | `v60211.1blu.de` (**a bare shell**) | oosh-tester |
| baseTeam:0.0 | `✳ scrum-master@WODA.prod` | agent-trainer |
| baseTeam:1.0 | `✳ agent-trainer@WODA.prod` | *(no row)* |

The registry is the PRE-MOVE layout, keyed `session:idx`. ctx% is right (it comes from the JSONL, not the registry). Only role labels are wrong, and so is name-routing: a send "to oosh-tester" by name resolves to ooshTeam:0.4, **which is now a bare shell**, so the text goes into a shell prompt.

**Cause, owned:** in the swipe design (041721c8f) I ruled role = registry-first so swipe would match pulse's `registry_role`. Registry-first reads a cache keyed by pane address, and a pane move invalidates every address in that cache. The live pane title moves with the agent. The rule had it the wrong way round.
Also measured: `hiveMind.registry.fix` (hiveMind:6433) only removes raw `%NNN` ids. **Nothing reconciles the registry from live titles**, so after a move it stays wrong until someone hand-edits it.

## Rule 1 — role = LIVE pane title; registry only as fallback (swipe.role AND pulse, identical)
`role(sess, idx, title)`:
1. **Title first.** Strip leading spinner/status glyphs (any leading run of non-alphanumeric characters: `✳`, braille spinners `⠁…⣿`, `⏵⏵`, whitespace), then take the first whitespace-delimited token.
2. **Accept it only if it has the naming-convention shape `role@host`** (Option C: pane title = `role@hostname`), matched by `^[A-Za-z][A-Za-z0-9._-]*@[A-Za-z0-9._-]+$`. Then **strip `@host`** → bare role (`oosh-architect`). The output column stays bare-role, same as today's registry values, so layout and padding don't change.
3. **Otherwise fall back to the registry** row `sess:idx|role` (e.g. an agent that hasn't been `/rename`d yet still shows `Claude Code` or a task title).
4. Otherwise `?`.

Notes:
- The old title fallback `title.split()[-1]` kept `@host` (`oosh-architect@WODA.prod`) and would have widened the column. The new rule strips it.
- Shell panes never reach `role()`. They are already rendered as shell rows by the subtree check, so a hostname title like `v60211.1blu.de` can't be mistaken for a role. The `role@host` shape check is a second guard against that.
- **Parity holds by construction:** pulse's `registry_role`-first line (scrumMaster:743) and `private.scrumMaster.swipe.role` (scrumMaster:852) change to the same rule. `test.swipe-parity` must stay green.
- **Still hiveMind-free:** the title comes from the `tmux list-panes … #{pane_title}` call swipe and pulse already make. The registry stays a data-file fallback. No hiveMind script call is added.

## Rule 2 — send-by-name (hiveMind.resolve, hiveMind:2048): resolve from LIVE titles, refuse if ambiguous
Blast radius: `hivemind.roles.env` is read in many places (scrumMaster 547/559/1091/1604/2106 plus hiveMind's own registry.get/find). Rewriting the store's semantics everywhere is load-bearing and risky. So the fix is narrow:
1. **`hiveMind.resolve <name>` resolves from live pane titles first**, using the same `role@host` parse as Rule 1. Scan live panes, collect those whose parsed role == name.
2. **Exactly 1 match** → that pane.
   **0 matches** → fall back to the registry, **but verify before trusting it:** the registry's pane must currently be running claude (subtree check) **and** its live title must not parse to a *different* role. If either check fails, **refuse loudly**: `resolve: registry says <name> → <pane>, but that pane is now <live title/shell> — registry is stale; refusing to route`.
   **>1 matches** (two panes titled the same role) → keep today's disambiguation (caller session, else error on ambiguity). Never guess.
3. **Never deliver to a shell by name.** A name must resolve to a pane with a live claude process. This alone would have stopped today's misroute: 0.4 is a shell.
4. **Registry reconcile = write-through, not a migration.** When `resolve` finds the title disagrees with the registry for a pane, it **rewrites that one row** (`registry.set <pane> <live-role>`) and drops rows whose pane now holds a shell. After a move, the registry heals on the next resolve or the next sweep. No bulk rewrite of the file.

## Rule 3 — sender prefix self-identity (PO add, 2026-10-28): own role from OWN live title
Third symptom: my message reached the PO headed `[@scrum-master ooshTeam:0.1]`.
Measured `private.otmux.send.prefix` (otmux:1936): the **pane** is already right — it comes from `otmux.pane.self target` (the G1 PID-walk, never `$TMUX_PANE`). The **role** is the stale part: `grep "^${myPane}|" hivemind.roles.env`. Correct pane plus stale role is exactly the observed tag.
**Fix:** take `myRole` from the sender's **own live pane title** (`otmux pane.get <myPane> '#{pane_title}'`), parsed with the Rule 1 `role@host` rule (strip glyph + `@host`). Fall back to the registry row only if the title doesn't have the `role@host` shape. If neither gives a role, **emit no prefix**, the same as today when nothing resolves. A missing tag is better than a wrong one.
Stays inside otmux's MVC boundary: it reads its own pane title (View data) and the registry *file*. No hiveMind call.

### Where the `role@host` parse lives
- **One definition in otmux:** a pure string function, e.g. `private.otmux.pane.role.parse <title>` → bare role or empty. The otmux prefix (Rule 3) and `hiveMind.resolve` (Rule 2) both call it. hiveMind already depends on otmux, so this adds no new dependency.
- **swipe/pulse keep their own copy** (Rule 1) on purpose. Tron's SM-monitor doctrine is decoupling over DRY: the watcher must not depend on the scripts it watches. To keep the copies from drifting, **one shared fixture table** of titles → expected role is run against BOTH implementations (acceptance case 9).

## Rule 4 — ACTIVE that survives a narrow pane (PO addendum, 2026-10-28; swipe AND pulse classify)
**Measured false IDLE:** ooshTeam:0.3 (tester) is working, but swipe reports IDLE. Its live chrome:
```
✻ Forging… (34m 0s · ↓ 108.8k tokens)        ← working line, 4 lines above the input box
  ⎿  Tip: Use /clear to start fresh when …      ← Tip block + update notice push it up
        ✔ Update installed · Restart to update
──────────────────────── oosh-tester@WODA.prod ─
❯
────────────────────────────────────────────────
  ⏵⏵ auto mode on (shift+tab to cycle) · esc …  ← bar TRUNCATED: "esc to interrupt" → "esc …"
```
Classify reads only the last 6 lines and matches the full `esc to int`. The bar is truncated and the working line is outside the window, so the match falls through to the auto-mode bar → IDLE. Whether this happens depends on pane width. The same classify is used in swipe and pulse.
**Idle panes, measured for contrast** (0.2 expert, baseTeam:1.0 trainer): bar = `⏵⏵ auto mode on (shift+tab to cycle)` with **no `esc` segment**. The finished line reads `✻ Brewed for 5m 16s · done 11:32 AM` (past tense, `for`, no `…`, no `(`).

**ACTIVE if ANY of these holds** (still checked first, before ON-WALL):
1. `esc to int` anywhere in the last-6-line chrome (today's check, kept).
2. **Truncation-proof bar:** the status-bar line (the last line containing `⏵⏵` or `auto mode`) contains a `· esc` segment: regex `·[[:space:]]*esc([[:space:]]|…|$)`. A full or truncated "esc to interrupt" only appears while the agent is working; the idle bar has no `esc` at all.
3. **Anchored working line:** find the input box's upper separator (the `─…` line directly above the `❯` line). From there, walk UP at most 8 lines, skipping only trailer chrome: blank lines, `⎿` Tip/continuation lines, `✔`/notice lines, and indented continuation. The first non-trailer line must match the working-line shape `^<spinner-glyph>[[:space:]]+[A-Z][a-z]+…[[:space:]]+\(([0-9]+h[[:space:]]+)?([0-9]+m[[:space:]]+)?[0-9]+s`. Spinner glyphs: `· ✢ ✳ ✶ ✻ ✽ *`. The elapsed part may carry `· thinking` or `· ↓ N tokens`; don't key on those words.

**Why this doesn't bring back the message-body false positive:**
- Signal 2 is tied to the status-bar line.
- Signal 3 is tied to the input box and only crosses trailer chrome. It stops at the first real line. A body line that says "thinking" or "Forging…" without the `glyph + Verb… + (elapsed` shape doesn't match, and neither does one sitting above real output.
- The finished line (`Brewed for …`) fails the `…(` shape, so a done agent stays IDLE.

**Capture:** keep capturing the last 15 lines (pulse already does). Only signal 3 reads above the 6-line tail, and only through the anchor. All other rules still read the 6-line tail.

**Follow-up (hiveMind, not this branch):** `sweep.detect` / the `pane.live` recognizer uses the same `esc to int` check and will have the same narrow-pane false IDLE. Apply the same three signals in the hiveMind pass.

## Interim, until Rules 1–2 land (operational, not code)
- **Send by pane ADDRESS, not by name** (`otmux send ooshTeam:0.3 …`), and check the live title before sending (`otmux pane.list <session>`).
- A one-time manual reconcile of the stale rows via `hiveMind registry.set <pane> <role>` is safe **only after re-measuring live titles at that moment**. Panes may have moved again. `roles.env` is a shared file, so edit only the stale rows.

## Acceptance — owned by oosh-tester (ooshTeam:0.3), scenario-first, RED before impl
1. **Labels after a move:** registry fixture deliberately shifted by one versus the live titles. `swipe` and `pulse` both print the live-title roles (bare, `@host` stripped). Header/rows otherwise byte-identical to today's format.
2. **Fallback:** an agent pane whose title isn't `role@host` (e.g. `Claude Code`) → the registry role is used. No row anywhere → `?`.
3. **Shell guard:** a shell pane whose title is a hostname is never labelled with a role.
4. **Parity:** `test.swipe-parity` stays green (pulse and swipe changed identically). Use a frozen fixture, per the parity-gate lesson.
5. **Send-by-name:** with the shifted registry, `hiveMind.resolve oosh-tester` returns the pane whose live title is `oosh-tester@…`, not the shell at the stale address. With the title removed and only a stale registry row pointing at a shell → **refuse loudly, deliver nothing** (check the shell's input line: nothing typed).
6. **Write-through:** after one resolve on a drifted row, that registry row now holds the live role. Unrelated rows are unchanged (diff the file).
7. **hiveMind-free:** `grep hiveMind` over the swipe methods is still 0.
8. **Sender prefix (Rule 3):** shifted-registry fixture. Send from a pane whose live title is `oosh-architect@…`; the receiver's transcript shows `[@oosh-architect <that pane>]`, not the registry's stale role. Pane part still comes from the PID walk. Title not `role@host` → registry role. Neither → no prefix at all (never a wrong one). Include a `$TMUX_PANE`-poisoned case so the pane part stays proven.
10. **Narrow-pane ACTIVE (Rule 4):** frozen fixtures, each run through swipe AND pulse classify. (a) The measured 0.3 chrome (truncated `· esc …` bar, working line 4 lines up behind a Tip + notice) → ACTIVE. (b) Same, but only the working line, with a full idle bar → ACTIVE (signal 3 alone). (c) Truncated bar alone, working line scrolled off → ACTIVE (signal 2 alone).
11. **No false ACTIVE:** (a) idle bar + finished `✻ Brewed for 5m 16s · done …` → IDLE. (b) Body text containing `thinking` / `Forging…` / `(32m 25s · thinking)` mid-message, ABOVE real output, with an idle bar → IDLE. (c) A working-line-shaped string more than 8 lines above the separator, or above a non-trailer line → IDLE.
12. **Width independence:** the same agent state captured at two pane widths (one with the full `esc to interrupt`, one truncated) classifies the same.
9. **One parse rule, two copies:** a shared fixture table (`✳ oosh-architect@WODA.prod` → `oosh-architect`, braille-spinner title, `⏵⏵` title, `Claude Code` → empty, `v60211.1blu.de` → empty, `@host` with dots) run against the otmux parse function AND the swipe/pulse copy. Both must give identical results.

## Handoff
Expert: Rule 1 in `private.scrumMaster.swipe.role` + pulse `registry_role` (scrumMaster only). Rule 2 in `hiveMind.resolve` + write-through via `registry.set`. Two separate commits, since they're in different scripts with different blast radii. Tester writes the RED first. PO gates deployed-green.
