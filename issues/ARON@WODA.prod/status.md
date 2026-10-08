# Agent → Folder + Checkout Status (fleet-wide)

**Measured by:** ARON (keeper) · **on:** 2026-10-08 · **host:** WODA.prod (`v60211.1blu.de`)
**Measured from:** `/var/dev/Workspaces/AI/Claude` @ `7c746666` (in sync with origin, clean)
**Checkout column verified by:** `readlink /proc/<claude_pid>/cwd` — the process's real working directory, not a config or a claim.

> ## ✅ RESOLVED 2026-10-08 — THE SECOND CHECKOUT IS GONE; THERE IS NOW ONE REPO
> **`/var/dev/Workspaces/web4x/Web4AI` is now a SYMLINK → `/var/dev/Workspaces/AI/Claude`** (TRON's order). Both paths are the same live repo; every old reference keeps resolving, and nothing can be inspected "stale" any more.
>
> **What it was:** a separate checkout **5811 commits behind** — HEAD `c78aae74`, **2026-07-19**, ~3 months old. **It is what made the trainer's home look wrong** and generated the original question:
>
> | dir | as seen in the OLD stale tree | truth in the live repo |
> |---|---|---|
> | `session/agents/agent-trainer/` | **12** files (looked live) | 16 (**legacy**, banner-marked) |
> | `session/agents/agent-trainer@WODA.prod/` | **1** file (looked abandoned) | **16** (**the live home**) |
>
> **Verified safe before deletion (irreversible, so measured first):** no uncommitted tracked changes · **not ahead of origin** (zero unpushed commits) · no stashes · only `main` · the **only** untracked content was this `issues/` folder (20K, moved first) · **no process cwd inside it and zero open file handles** · all 19 agents already ran in the live checkout. Siblings `Web4MDA`, `Web4RawBin`, `Web4RawBin.old`, `rekey-backup` and the `.tgz` backup were **untouched** (re-verified healthy after).
>
> `git -C /var/dev/Workspaces/web4x/Web4AI` now reports the live HEAD, in sync with origin.

---

## ⛔⛔ DEFECT #0 — THE ROSTER CONTAINS A PHANTOM. `diamonds:0.1` IS **NOT** AN OOSH AGENT. DO NOT DRIVE IT.

| | measured |
|---|---|
| `scrumMaster pulse` says | `oosh-expert`, 76% (762k) — *identical numbers to `ooshTeam:0.3`* |
| `claudeCode session.current diamonds:0.1` says | `a43c1b23-…` — **the real oosh-expert's uuid** |
| **The process actually is** | `claude --model claude-opus-4-8[1m]` — **NO `--resume`, no session name** (pid 2473913) |
| **Its true session uuid** | **`3f5eb079-34a9-487c-b558-ebc35700caf5`** (from its own scratchpad path) |
| **Its actual content** | a creative project — *"zahra-meridian"*: papyrus sheet, walking figure, a diamond with refraction, published claude.ai artifacts |

**Mechanism:** `claudeCode session.current <pane>` **FABRICATES a plausible uuid** for a process started without `--resume` instead of reporting unknown — and **`scrumMaster pulse` inherits that lie**, rendering a *second* "oosh-expert" with copied numbers.

**Why this is the top defect:** a drive order naming **"oosh-expert"** could be executed against **`diamonds:0.1`** — rewinding a non-agent creative session. By-label and the landing-map would not catch it: both instruments agree on the wrong identity.

**Guards until fixed:**
1. **Never resolve an agent by pulse name or by `session.current` alone.** Confirm with **`ps -o args=`** (is there a `--resume <uuid>`?) **and by pane CONTENT**.
2. An agent with **no `--resume`** is **not a roster agent** — treat it as out of scope, never a rewind target.
3. This is `13a-ζ` inverted: the dead-instrument law says *name the failure, never fake the check* — here **the instrument itself fakes it.** Worse than dead.

---

## Live agents → folder + **VERIFIED CHECKOUT**

| Agent (pulse name) | Pane | Folder it writes | **Checkout (verified by `/proc/<pid>/cwd`)** | Files | Last write | Status |
|---|---|---|---|---|---|---|
| **ARON** | `Temple:0.0` | `session/agents/ARON/` | ✅ `/var/dev/Workspaces/AI/Claude` | 57 | 10-08 | ✅ clean |
| **agent-trainer** | `baseTeam:0.0` | `session/agents/agent-trainer@WODA.prod/` | ✅ `/var/dev/Workspaces/AI/Claude` | 16 | 10-08 | ✅ **CONSOLIDATED** (`16cd3c1d`) |
| **oopExpert** | `oopTeam:0.0` | `session/agents/oopExpert@WODA.prod/` | ✅ `/var/dev/Workspaces/AI/Claude` | 22 | 10-08 | ✅ clean |
| **oopBashExpert** | `oopTeam:1.0` | `session/agents/oopBashExpert@WODA.prod/` | ✅ `/var/dev/Workspaces/AI/Claude` | 4 | 10-08 | ✅ clean |
| **oopPO** | `oopTeam:2.0` | `session/agents/oopPO@WODA.prod/` | ✅ `/var/dev/Workspaces/AI/Claude` | 4 | 10-08 | ✅ clean |
| **oopTester** | `oopTeam:3.0` | `session/agents/oopTester@WODA.prod/` | ✅ `/var/dev/Workspaces/AI/Claude` | 60 | 10-08 | ✅ clean |
| **scrum-master@WODA.prod** | `oopTeam:4.0` | `session/agents/scrum-master/` ← **plain** | ✅ `/var/dev/Workspaces/AI/Claude` | 9 | 10-08 | ⚠️ **name ≠ folder** |
| **oosh-po** | `ooshTeam:0.0` | `session/agents/oosh-po@WODA.prod/` | ✅ `/var/dev/Workspaces/AI/Claude` | 7 | 10-01 | ⛔ **3 host twins** |
| **oosh-architect** | `ooshTeam:0.2` | `session/agents/oosh-architect/` | ✅ `/var/dev/Workspaces/AI/Claude` | 3 | 09-28 | ⚠️ stale `@MacStudio` twin |
| **oosh-expert** | `ooshTeam:0.3` **(the only one)** | `session/agents/oosh-expert/` | ✅ `/var/dev/Workspaces/AI/Claude` | 6 | 10-02 | ⚠️ twin; **rate-limited, 764k** |
| **oosh-tester** | `ooshTeam:0.4` | `session/agents/oosh-tester/` | ✅ `/var/dev/Workspaces/AI/Claude` | 5 | 10-01 | ⚠️ stale `@MacStudio` twin |
| **robbin-po** | `robbinTeam2:0.0` | `session/agents/robbin-po/` | ✅ `/var/dev/Workspaces/AI/Claude` | 37 | 09-30 | ✅ clean |
| **robbin-expert** | `robbinTeam2:0.1` | `session/agents/robbin-expert/` | ✅ `/var/dev/Workspaces/AI/Claude` | 4 | 09-30 | ✅ clean |
| **robbin-skill-expert** | `robbinTeam2:0.2` | `session/agents/robbin-skill-expert/` | ✅ `/var/dev/Workspaces/AI/Claude` | 3 | 09-13 | ✅ clean |
| **robbin-architect** | `robbinTeam2:0.3` | `session/agents/robbin-architect/` | ✅ `/var/dev/Workspaces/AI/Claude` | 7 | 09-30 | ✅ clean |
| **robbin-req** | `robbinTeam2:0.4` | `session/agents/robbin-req/` | ✅ `/var/dev/Workspaces/AI/Claude` | 5 | 09-28 | ✅ clean |
| **robbin-tester** | `robbinTeam2:0.5` | `session/agents/robbin-tester/` | ✅ `/var/dev/Workspaces/AI/Claude` | 11 | 09-30 | ✅ clean |
| **robbin-planner** | `robbinTeam2:0.6` | `session/agents/robbin-planner/` | ✅ `/var/dev/Workspaces/AI/Claude` | 3 | 09-28 | ✅ clean |
| ⛔ **`diamonds:0.1`** | `diamonds:0.1` | **none — not an agent** | ✅ `/var/dev/Workspaces/AI/Claude` | — | — | ⛔ **PHANTOM — see Defect #0. DO NOT DRIVE.** |

**Checkout verdict: 19/19 processes run in the LIVE checkout `/var/dev/Workspaces/AI/Claude`. Zero in the stale tree.**

*(~100 further `session/agents/*` dirs are Feb–Jun legacy templates with no live agent.)*

## Three incompatible naming conventions are running at once

| Convention | Agents |
|---|---|
| plain `name/` | ARON · robbin-×7 · scrum-master · oosh-architect/expert/tester |
| `name@WODA.prod/` only | oopExpert · oopBashExpert · oopPO · oopTester |
| **both / multi-host** | **agent-trainer** (fixed 10-08) · **oosh-po** (3 host dirs, no plain) |

## Open defects, ranked

| # | Defect | Detail | Owner |
|---|---|---|---|
| **0** | **PHANTOM in the roster** | `diamonds:0.1` reported as `oosh-expert` by both pulse and `session.current`; it is an unnamed creative session (`3f5eb079`). **Mis-drive risk.** | oopPO + TRON |
| 1 | **`oosh-po` — 3 host dirs, no plain** | live = `@WODA.prod` (7 files, 10-01); also `@MacStudio` (4) and **`@prototype` (30 — the LARGEST is NOT live)**. | oosh-po + oopPO |
| 2 | **`scrum-master` name ≠ folder** | agent `scrum-master@WODA.prod`, folder plain `scrum-master/`. Invites a trainer-style split. | SM + oopPO |
| 3 | **stale `@MacStudio` twins** | `oosh-architect` · `oosh-expert` · `oosh-tester`. Inert today, ghost-bait tomorrow. | ooshTeam |
| 4 | **fleet tool in a private agent dir** | `agent-rewind.md` 13a-ο references `session/agents/agent-trainer/tools/landing-map.py`; ARON **and** SM run it. Two copies exist — **neither may be edited until the reference moves** (`65ec4bfa`). Fix = fleet location + canon update in the SAME commit. | oopPO + TRON |
| ~~5~~ | ~~two checkouts of one repo~~ **RESOLVED 2026-10-08** | the stale checkout (−5811, HEAD 2026-07-19) was verified work-free, its `issues/` moved, then **deleted and replaced by a symlink → `/var/dev/Workspaces/AI/Claude`**. One repo, both paths resolve, nothing stale to inspect. | ✅ TRON/ARON |
| 6 | **`oosh-expert` rate-limited** | `ooshTeam:0.3` shows *"API Error: Server is temporarily limiting requests"* at 764.1k. | oopPO |

## Fix #1 — `agent-trainer`, DONE 2026-10-08

- `16cd3c1d` — 15 missing files copied into `@WODA.prod` via `cp -n`; **live `context.md` hash `336456c5` unchanged before/after** (the old dir's `context.md` is the 2026-07-03 ghost, deliberately **not** copied); dead `SKILL.md` symlink (`/Users/Shared/…`, broken since June) replaced with a working relative link; `.claude/agents/agent-trainer/{context,learnings,backlog}.md` repointed off the deprecated ghost.
- `5b639723` (trainer) — copied `ESSENCE.md` pointer `../agent-trainer/MEMORY.md` re-based; it resolved **back into the legacy dir**.
- `0110965e` — legacy dir banner-marked (`context`/`ESSENCE`/`boot` + one `_LEGACY-DIR.md`); new canon: **a copy moves the file but not its frame of reference** · **a preserved trace that is not marked is a trap**.

---

## This file is a MEASUREMENT, not a document

True only as of its timestamp. **Regenerate rather than cite.** From the live checkout:

```bash
cd /var/dev/Workspaces/AI/Claude
scrumMaster pulse                      # roster + panes (⚠ can mislabel — see Defect #0)
# folder, file count, last write per agent dir
for d in $(git ls-files session/agents/ | sed -n 's|^session/agents/\([^/]*\)/.*|\1|p' | sort -u); do
  printf "%-34s files=%-3s last=%s\n" "$d" \
    "$(git ls-files "session/agents/$d/" | wc -l)" \
    "$(git log -1 --format='%ad' --date=format:'%m-%d %H:%M' -- "session/agents/$d/")"
done
# VERIFIED checkout + real identity per pane (the authoritative check)
for P in <panes>; do
  pp=$(tmux display-message -p -t $P "#{pane_pid}")
  sess=$(ps -o sess= -p "$pp" | tr -d ' ')
  cpid=$(ps -o pid=,args= -s "$sess" | grep -E "claude (--resume|--fork|-)" | sed -n '1s/^ *\([0-9]*\).*/\1/p')
  printf "%-18s cwd=%s\n" "$P" "$(readlink /proc/$cpid/cwd)"
  ps -o args= -p "$cpid"               # ← NO --resume means NOT a roster agent
done
```

Per `process-canon` §4 (enumeration ownership): **the owner of this list is the repo + the live processes — this file is only a rendering of them.**
