#!/usr/bin/env bash
# T-NP-GOLDENS — replay the no-python GOLDENS (oosh-expert/no-python-goldens @e60ed228, batch 2, R1/R2 applied)
# against a tree: each golden's EXACT recorder invocation (record-goldens.sh call()), on the ORIGINAL fixture,
# byte-compared to the committed golden. NOT the recorder itself: its amend.r1 recomputes R1 cells from the
# tree under test on a zero-stripped twin, which would mask an R1 regression in the candidate.
# Usage: t-np-goldens.sh <tree> <goldens-worktree>
# Differences vs recorder call(): PATH/OOSH_DIR pinned to the TREE (step 3 sites now CALL `claudeCode
# jsonl.usage` as a command — unpinned it would resolve to the deployed /root/oosh), and the sandbox config
# seeds OOSH_PM=false (fresh config -> debug trap -> sudo apt-get update otherwise).
# Scope = step 3 families. velocity.calculate (step 4) is reported INFO-only.
TREE="$(cd "$1" && pwd -P)"; G="$(cd "$2" && pwd -P)/test/fixtures/no-python"; IN="$G/inputs"; GOLD="$G/golden"
. "$G/fixture-lib.sh"
SBX="$TREE/test/gen/t-no-python-goldens"; rm -rf "$SBX"; mkdir -p "$SBX/config" "$SBX/.claude/projects"
printf 'export OOSH_PM="false"\nexport OOSH_PM_UPDATED="seeded-by-test"\n' > "$SBX/config/user.env"
trap 'np.sweep; rm -rf "$SBX"' EXIT
export TZ=UTC
echo "=== tree: $TREE @ $(git -C "$TREE" rev-parse --short HEAD)   goldens: $(git -C "$G" rev-parse --short HEAD)"
call(){
  local s="$1" fn="$2"; shift 2
  ( export HOME="$SBX" CONFIG_PATH="$SBX/config" HIVEMIND_REGISTRY="$SBX/config/hivemind.roles.env" LOG_DEVICE=/dev/null
    export PATH="$TREE:$PATH" OOSH_DIR="$TREE"
    unset CLAUDE_MAX_TOKENS_DEFAULT
    source "$TREE/$s" >/dev/null 2>&1
    "$fn" "$@" 2>/dev/null; echo "rc=$?" ) | sed "s|$SBX|<SBX>|g"
}
declare -A P F; BADL=""; NOVAL=0
chk(){ # <family> <rel> <script> <fn> <args...>
  local fam="$1" rel="$2"; shift 2
  local want got; want=$(cat "$GOLD/$rel" 2>/dev/null); got=$(call "$@")
  echo "$got" | tail -1 | grep -q '^rc=[0-9]' || NOVAL=$((NOVAL+1))
  if [ "$got" = "$want" ]; then P[$fam]=$(( ${P[$fam]:-0}+1 )); else F[$fam]=$(( ${F[$fam]:-0}+1 ))
    BADL="${BADL}    $rel: want[$(printf '%s' "$want" | tr '\n' ' ')] got[$(printf '%s' "$got" | tr '\n' ' ')]"$'\n'; fi
}
for f in "$IN"/jsonl/*.jsonl; do
  touch "$f"; n=$(basename "$f" .jsonl)
  chk swipe.ctx            "swipe.ctx/$n.200.out"          scrumMaster private.scrumMaster.swipe.ctx "$f" 200
  chk swipe.ctx            "swipe.ctx/$n.1000.out"         scrumMaster private.scrumMaster.swipe.ctx "$f" 1000
  chk max.tokens.for.jsonl "max.tokens.for.jsonl/$n.out"   claudeCode  private.claudeCode.max.tokens.for.jsonl "$f"
  chk context.from.jsonl   "context.from.jsonl/$n.out"     claudeCode  private.claudeCode.context.from.jsonl "$f"
  chk INFO-velocity-step4 "velocity.calculate/$n.out"     claudeCode  private.claudeCode.velocity.calculate "$f"
done
np.build.projects "$SBX"; np.plant.panes "$SBX"
for p in 0.0 0.1 0.2 0.3; do
  chk context.live.jsonl         "context.live.jsonl/pane$p.out"         hiveMind private.hiveMind.context.live.jsonl "$NP_SESS:$p"
  chk context.denom.for.target   "context.denom.for.target/pane$p.out"   hiveMind private.hiveMind.context.denom.for.target "$NP_SESS:$p"
  chk context.from.jsonl.reading "context.from.jsonl.reading/pane$p.out" hiveMind private.hiveMind.context.from.jsonl.reading "$NP_SESS:$p"
done
np.sweep
TP=0; TF=0
for fam in swipe.ctx max.tokens.for.jsonl context.from.jsonl context.live.jsonl context.denom.for.target context.from.jsonl.reading INFO-velocity-step4; do
  p=${P[$fam]:-0}; f=${F[$fam]:-0}; printf '  %-28s %3d/%d\n' "$fam" "$p" "$((p+f))"
  case "$fam" in INFO-*) ;; *) TP=$((TP+p)); TF=$((TF+f));; esac
done
[ -n "$BADL" ] && { echo "  --- mismatches ---"; printf '%s' "$BADL" | head -40; }
echo "  instrument: $NOVAL replay(s) without rc= line (source died / fn undefined)"
echo "=== T-NP-GOLDENS step-3 scope: $TP/$((TP+TF)) ==="
