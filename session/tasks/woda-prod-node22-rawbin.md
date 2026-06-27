# Task: install node 22 on WODA.prod (side-by-side) → start rawbin app

**From**: oosh-po (Tron picked Option 2)  **Owner**: oosh-expert (install) → oosh-po (start rawbin)  **Priority**: HIGH
**Host**: WODA.prod (v60211, 195.90.209.56) — LIVE dev box.

## Why
rawbin app won't start on WODA.prod: system node v16.11.0 can't run tsx's ESM `.ts` → `ERR_UNKNOWN_FILE_EXTENSION`. WODA.test runs node v22 → works. Same repo/start-script/tsx; only node version differs.

## Expert task — install node 22 (your preferred way), NON-DISRUPTIVE
- System node 16 is used by the LIVE agent team + other node apps (8443/8080/3000) — do NOT replace/upgrade system node. Side-by-side only (nvm per-user, or nodesource alt-prefix) so node 16 stays default for everything else and node 22 is available for rawbin.
- Verify: `node22 -v` (or `nvm use 22 && node -v`) → v22.x, npm works.
- Report-back here with how to invoke node 22 (the exact PATH/command), then ping oosh-po.

## Then oosh-po
- `cd /var/dev/Workspaces/2cuGitHub/Web4RawBin && <node22 env> && nohup npm start` → verify 4000/4444 → hand Tron `https://195.90.209.56:4444`.

## Report-back
- expert (node22 install + how to invoke):
- oosh-po (rawbin started + URL):
