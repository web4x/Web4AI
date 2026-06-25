# S-9 Dogfood: re-migrate robbinTeam2 with hiveMind team.push

**From**: oosh-po@WODA.prod
**To execute**: oosh-po@MacStudio (source side — runs team.push FROM MacStudio TO WODA.prod)
**Status**: READY TO RUN

## Current mess on WODA.prod (measured)

```
robbinTeam2 panes:
0.0  robbin-po@MacStudio        (unknown)
0.1  v60211.1blu.de             (offline) ← STRAY: hostname as title, no agent
0.2  robbin-expert@MacStudio    (unknown)
0.3  robbin-skill-expert@MacStudio (unknown)
0.4  robbin-architect@MacStudio (unknown)
0.5  robbin-req@opus            (idle)    ← DUPLICATE tester incarnation (562b0ce2)
0.6  robbin-tester@MacStudio    (unknown) ← CANONICAL tester (f7db409b)
```

Problems: stray pane 0.1, duplicate tester (0.5 vs 0.6), all titles still @MacStudio, registry stale.

## What team.push should do

From MacStudio: `hiveMind team.push WODA.prod robbinTeam2`

Expected behavior (testing all the sprint stories):
- **S-2b resolveCanonical**: dedup the two tester sessions by recency+training → pick canonical (f7db409b)
- **S-4 collision**: detect existing agents in panes, verify-or-skip correct ones, re-fork wrong ones
- **S-5 rename**: all agents renamed `@WODA.prod` (not `@MacStudio`)
- **S-5 /rc**: all agents under /remote-control immediately
- **S-6 reconcile.apply**: fix stray pane 0.1, clean registry
- **S-7 audit**: consistency.audit == 0 at the end

## Run command (from MacStudio)

```bash
# MacStudio oosh must have team.push — pull dev or cherry-pick from WODA.prod
cd ~/oosh && git pull   # ensure team.push (9d48bd0+ee12cde) is on MacStudio
hiveMind team.push WODA.prod robbinTeam2
```

## After run — verify on WODA.prod (oosh-po@WODA.prod will check)

```bash
hiveMind team.status robbinTeam2     # all agents present, @WODA.prod, correct roles
hiveMind consistency.audit robbinTeam2  # 0 violations
otmux pane.list robbinTeam2          # no stray pane, no duplicate tester
```

## Report-back
- oosh-po@MacStudio (ran team.push):
- oosh-po@WODA.prod (verified on target):
