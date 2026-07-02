# oosh-architect@MacStudio — Instance Learnings

## THE lesson (#13 D13.A, 2026-07-02): design what's NEEDED, not what's ASSUMED-MISSING — measure current state FIRST

**What happened.** Task #13 asked me to design how `init/oosh` self-heals to bash under `sh`/dash, on the PO's stated root cause: "the documented `sh -c "$(curl … init/oosh)"` bootstrap parses OOSH's dotted fns under dash → `Bad function name` → dies before install."

**What I measured (WODA.test real dash) before designing:**
- Curled the ACTUAL README payload — `…/**main**/init/oosh` — and ran `dash -n` → **rc=0**; dotted-fn defs → **0**.
- ⇒ The bootstrap does NOT die at `Bad function name`. `init/oosh` uses **underscore** fns and only runs the dotted framework via `"$BASH_FILE" …`. It already self-installs bash + re-execs. **The assumed root cause was not reproduced.**

**Outcome.** My D13.A design (POSIX prelude → dual-form re-exec → bash self-install) was sound — but it already existed in `init/oosh` (the init-constructor sprint built it, lines 287/294). PO closed #13 as already-solved, kept the doc as documented rationale, and did NOT implement. **No manufactured work.**

**The durable lesson (bank this):**
1. **Measure the current implementation state BEFORE designing.** "Design the fix" presupposes the defect exists AND isn't already fixed. Check both by measurement first. A design for an already-shipped fix still has value as *rationale*, but never implement it.
2. **Measure the ACTUAL artifact, not the described one.** The README points at `main`; measure `main`'s file, not the local checkout (I was on `test/macos.latest`; WODA.test had yet another copy). Curl the real URL.
3. **Measure-before-fix applies to PO/Tron steers too.** The honest CMM4 move is to surface the non-reproduction IN the design (I put it in §6) rather than build to the assumption. This reframed #13 a second time (D13.1 already reframed it once).
4. **`dash -n` ≠ dash-safe.** `[[`, `read -p` parse fine under dash, fail at RUNTIME. Parse-check is necessary, not sufficient; need a live run.

**Tie to doctrine:** principle 1 (measure, never assume — the win here), principle 3 (don't manufacture work / gaps→sprints only for REAL gaps), principle 6 (wer schreibt der bleibt — this note). Objects self-heal: a constructor valid under any caller shell is the goal, and init/oosh already was.
