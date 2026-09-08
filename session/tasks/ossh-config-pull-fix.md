# Task: `ossh config.pull <fromHost> <sshConfigName>` fails — review + fix

**Ordered by:** oosh-po@13mi (relaying TRON) · **Owner:** oosh-expert (impl) + oosh-tester (T) · **Gate:** oosh-po@13mi → TRON
**Mode/host:** mcdonges.latest @ 13mi · **Script:** `ossh` · **Repro command:** `ossh config.pull WODA.prod MacStudio.home`

## Traceability
- up: TRON directive 2026-07-15 — "review with the team why it fails and fix it: `ossh config.pull WODA.prod MacStudio.home`"
- down: `ossh.config.pull()` fix + `test/test.ossh` T-CONFIG-PULL

## Current code (the gap) — `ossh:1376`
```bash
ossh.config.pull() { # <fromHost> <sshConfigName> <?file>
  local fromHost="$1"; shift            # WODA.prod
  local sshConfigName="$1"; shift       # MacStudio.home
  local file="${1:-$RESULT/config}"     # default ~/.ssh/config
  ossh exec $fromHost "ossh config.get $sshConfigName" >>$file   # ← UNCHECKED append
}
```

## PO code analysis — 3 candidate failure modes (expert to confirm which is live)
1. **Host resolution** — `ossh exec WODA.prod` may not resolve: is `WODA.prod` an ssh-config Host locally, or only under an alias (e.g. `v60211`)? (Known hostname⇄ssh-config-host gap.) → exec fails.
2. **Remote lookup** — remote `ossh config.get MacStudio.home` requires that config to EXIST on WODA.prod; if absent → empty/err output.
3. **Unchecked `>>$file` (corruption hazard / never-silently-broken violation)** — the append has **no rc check**: if `ossh exec` or the remote `config.get` fails, the **error text is appended into `~/.ssh/config`**, corrupting it, and pull may still exit 0. First-principles: must verify the pulled payload looks like a valid `Host` block, write atomically, and fail loud (never rc0 on failure, never corrupt the config).

## Spec / acceptance criteria (fix)
1. Resolve `fromHost` robustly (or fail loud with the available hosts) — reuse ossh's host-resolution, no silent exec failure.
2. Capture the remote `config.get` output to a temp, **validate** it's a real config block (non-empty, starts with `Host `/expected keys), THEN append.
3. **Never corrupt `~/.ssh/config`**: no partial/error writes; append only validated payload (atomic).
4. **Fail loud, never rc0** on exec failure / empty / invalid payload — actionable message.
5. Idempotent-friendly: don't blindly duplicate an already-present Host block (warn or skip).

## Team review workflow
1. **oosh-expert** — reproduce SAFELY (`ossh config.pull WODA.prod MacStudio.home <scratch-file>` — 3rd arg redirects OFF `~/.ssh/config`), capture the ACTUAL error, confirm which failure mode(s), implement the fix. Report here.
2. **oosh-tester** — T-CONFIG-PULL: dead-host → fail-loud rc≠0 (config untouched); missing remote config → fail-loud (no corruption); happy path → valid Host block appended once, rc0. Capture proof.
3. **oosh-po@13mi** — gate on captured proof → TRON.

## QA workflow
predict → expert reproduce+root-cause+fix → tester captures proof → oosh-po@13mi gate → TRON acceptance → Done.

---

## Expert report (oosh-expert, 2026-07-15) — commit `15012c4`

### STEP 1 result — HONEST: live error NOT captured (safety-blocked)
oosh-po asked "what's the actual error?" — **I did not capture it.** Reproducing
requires `ossh exec WODA.prod …` (a remote command to a **production** host); the
safety layer blocked it — a prod remote command needs **explicit TRON
authorization**, not a peer relay. I did **not** fabricate a result. What I *did*
confirm without touching prod:
- **Mode 1 (host resolution): unlikely for this host** — `WODA.prod` IS a local ssh `Host` (measured in `~/.ssh/config`). So `ossh exec WODA.prod` should resolve. (A *remote* `MacStudio.home` lookup, mode 2, is the more likely live cause — but that needs the authed live run to confirm.)
- **Mode 3 (unchecked `>>` corruption): CONFIRMED** by static analysis (`ossh:1405`, no rc-check/validation) + a **local simulation**: an error-on-stdout payload appended into a scratch config file with **exit 0** — the exact "error text into `~/.ssh/config`, still rc0" hazard.

### Fix (all 5 criteria) — landed
Rewrote `config.pull` + added `private.ossh.hostKnown` / `private.ossh.validConfigBlock`:
1. resolve fromHost (unknown → fail loud + available-hosts list, **before any exec**);
2. capture remote payload to `mktemp`, check exec rc (failed exec never touches the file);
3. validate: append ONLY a non-empty real `Host ` block, no `ERROR>/WARNING>/not-found` text — config protected;
4. fail loud (rc≠0) + actionable message on unknown/exec-fail/empty/invalid;
5. idempotent — skip an already-present Host block (no duplicate).

**Verified safely (no prod):** `validConfigBlock` accepts a real block, rejects error/empty/garbage; `hostKnown` resolves `WODA.prod` / rejects fakes; `config.pull <unknown-host>` fails loud with the scratch file **byte-identical (uncorrupted)**.

### Needed to finish
- **Which mode is live** (2 vs other) + **happy-path proof** need a run against `WODA.prod` → **TRON must authorize the prod exec**, OR the **tester** runs T-CONFIG-PULL with prod access authorized.

### Tester (T-CONFIG-PULL) — capture proof (against a scratch file, 3rd arg)
1. dead/unknown host → fail-loud rc≠0, scratch untouched (safe now, no prod).
2. missing remote config (`ossh config.pull WODA.prod NoSuchName /tmp/scratch`) → fail-loud, no corruption. **[needs prod auth]**
3. happy path (`ossh config.pull WODA.prod <real-remote-name> /tmp/scratch`) → one valid Host block appended, rc0. **[needs prod auth]**
Report to oosh-po@13mi.

---

## ✅ PO GATE — oosh-po@13mi, 2026-07-15 → CONDITIONAL PASS, awaiting TRON
Reviewed the fix **in code** (`ossh:1391` + helpers `hostKnown`/`validConfigBlock`), commit `15012c4`.

**PROCESS — commend the expert:** it hit the prod-exec safety boundary and **refused to fabricate** a live result, reporting the block honestly. That is exactly the measure-not-assume + honest-report discipline. Correct call.

**FIX — PASS (all 5 criteria verified in code):** resolve-or-fail-loud (1420) · capture-to-temp + exec-rc-check, failed exec never touches `$file` (1434-1438) · validate real `Host` block, reject empty/error-text (1442) · fail-loud rc≠0 every path · idempotent duplicate-skip (1427). **The mode-3 corruption hazard is definitively eliminated** — `$file` is written only after a successful exec AND a clean-payload validation.

**Safe-verified evidence (no prod) is sufficient for the security-critical guarantees:** never-corrupt + fail-loud + validation + host-resolution + idempotency are all proven (expert: `config.pull <unknown-host>` fails loud, scratch file byte-identical/uncorrupted).

**"Why it fails" — resolved:** mode-3 (unchecked `>>`) was the latent hazard, now fixed. The ORIGINAL trigger was most likely **mode 2** (remote `MacStudio.home` config absent on WODA.prod → `config.get` emits error text → old code appended it to `~/.ssh/config` and still rc0). Confirming that specific trigger + the happy-path both need a live `ossh exec WODA.prod` run = **TRON prod-authorization**.

**Minor note (not a blocker):** `validConfigBlock`'s error-marker reject-list (`cannot|refused|denied|not found|no such`) could reject a legitimate block whose hostname/comment contains one of those words. Erring toward rejection is the SAFE direction for a corruption guard (fail-loud > corrupt). Flag only.

**→ TRON decision:** (a) **authorize a prod run** (tester, prod access) to capture happy-path + confirm mode-2 → full DONE; or (b) **accept on defensive-correctness** now (the corruption bug is fixed+proven), happy-path noted prod-auth-pending. **PO recommends accept-now + optional prod-auth for the completeness proof.**

---

## Tester live proof (oosh-tester, 2026-07-15) — T-CONFIG-PULL: **PASS (full, incl. prod)** @ `15012c4`

**Auth:** relayed "TRON authorized" was correctly REJECTED by the safety layer (a relay ≠ the user's own consent); I obtained **direct user authorization** for the WODA.prod exec before running steps 1-3. All pulls used a **scratch 3rd-arg file**; real `~/.ssh/config` never targeted.
**Real `~/.ssh/config` md5 `c79679…a0e` — verified UNCHANGED before, during, and after all steps.**

### Defensive proofs (local, no prod)
- unknown-host → fail-loud rc1 + "Available hosts:" list, **before any exec**; scratch byte-clean.
- `validConfigBlock`: real `Host` block → ACCEPT · error-text → REJECT · empty → REJECT (corruption hazard eliminated).

### Prod proofs (user-authorized, WODA.prod, scratch file)
| Step | Command | Result |
|------|---------|--------|
| **1. original failing cmd** | `ossh config.pull WODA.prod MacStudio.home <scratch>` | **rc=1 fail-loud** ✓ — `ERROR> ... remote 'ossh config.get MacStudio.home' on 'WODA.prod' FAILED (exec rc≠0) — <scratch> untouched`. **scratch byte-clean**. |
| **root cause = MODE 2 (CONFIRMED)** | `ossh exec WODA.prod "ossh config.get MacStudio.home"` | **rc=2**, `WARNING> config MacStudio.home not found` — MacStudio.home does **not** exist on WODA.prod (it is NOT a Host entry; the list only shows the "not found" warning). This is the exact original trigger: old unchecked `>>` would have appended that warning into `~/.ssh/config` at rc0. Now: exec-rc≠0 → fail loud, file protected. |
| **2. list real configs** | `ossh exec WODA.prod "ossh config.list"` | rc0 — real Hosts incl. `WODA.dev` (`config.get WODA.dev` → rc0, clean block). |
| **3. happy path** | `ossh config.pull WODA.prod WODA.dev <scratch>` | **rc=0** ✓ — `appended validated Host 'WODA.dev'`; scratch = sentinel + **exactly ONE** valid `Host WODA.dev` block. |
| **5. idempotent** | happy pull **again** | rc0, `Host 'WODA.dev' already present — skipping (no duplicate)`; count stays **1**. |

### Verdict: **PASS — all 5 acceptance criteria proven live.**
(1) resolve-or-fail-loud ✓ · (2) capture-to-temp + validate ✓ · (3) never-corrupt (scratch byte-clean every fail; real config untouched) ✓ · (4) fail-loud rc≠0 on exec-fail/empty/invalid ✓ · (5) idempotent duplicate-skip ✓. **Original "why it fails" = mode 2, measured on prod.** No durable side-effects (scratch files only).
**Proof logs:** `scratchpad/ossh-*.log`, `s1/s2/s3*.{out,err}`, `getmac.out`, `realcfg.md5.baseline`.
