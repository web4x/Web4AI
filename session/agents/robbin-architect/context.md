# robbin-architect Context (Save 2026-06-28 — Sprint 21 architecture delivered)

## STATUS: Sprint 21 architecture DONE + PO-VERIFIED. Standing by for PDCA Check on expert impl.
Pane: robbinTeam2:0.3 on WODA.prod
Model: Opus 4.6 (1M)

## REPOS (MEASURED — host changed to WODA.prod)
- **ACTIVE repo:** `/var/dev/Workspaces/2cuGitHub/Web4RawBin`  ← sprint-21 lives here, commit here
- Other clone (web4x) lacks sprint-21 — do NOT use it.
- Session repo (context/learnings): `/var/dev/Workspaces/AI/Claude`

## DELIVERED THIS CYCLE — commit 48b2e612b
Sprint 21 "Contact Identity & Enrichment" (9 reqs R21.1–R21.9, one sprint per Tron answer #3):
1. `scrum.pmo/sprints/sprint-21-contact-identity/architecture.md`
2. `scrum.pmo/sprints/sprint-21-contact-identity/diagrams/sprint-21.puml` (object graph + device-link + async-verify)
3. 27 scenario units minted: 9 UC (refined from req placeholders, FIXED uuids) + 9 Class + 9 Method (fresh v4). Forward-only. Chain verify 9/9 Req→UC→Class→Method PASS.

## CHAIN MAP (req → UC uuid → Class → Method)
- R21.1 efd1acb6 → 9cd5cc65 profile.dropVCard → Profile.dropVCard
- R21.2 4f099ef2 → dbfacb7f lobby.renderName → RoomBrowser.renderNameOnConnect
- R21.3 144d1332 → 97015dcc phone.indexAsSymlink → PhoneIndex.registerSymlink
- R21.4 04dff687 → ff91e891 identity.deviceLinkOnKnownKey → IdentityResolver.resolveOrEnroll
- R21.5 a8be009e → c59356f7 email.mintAndLink → Email.mintAndLink
- R21.6 3bd63ae7 → 4242f9be phone.mintAndLink → Phone.mintAndLink
- R21.7 5d3b5e6e → fab88cb9 address.mintAndVerifyAsync → Address.mintAndVerifyAsync
- R21.8 bf6a0433 → a62c6e37 company.mintOrReuseShared → Company.mintOrReuseShared
- R21.9 21e792e0 → 5826ca42 fileDetail.renderActionsFirst → RbFileDetail.renderActionsFirst
- Mint script (re-runnable): scratchpad `mint-sprint21-chain.mjs`

## KEY DESIGN DECISIONS (measured grounding)
- **Object graph:** Profile.phones[]/emails[]/addresses[]/companies[] forward IOR arrays (Class→Method shape). Phone/Email/Address ownerIor→Profile; Company ownerIor=null (SHARED, dedup by nameKey).
- **Alt-UUID index:** REUSE `ScenarioIndex.unitLinks[]` + `ensureSymlinkDisk()` (src/ts/scenario/index-store.ts:115-131). New `scenario/alt/{phone,email,company}/<key>.scenario.json` symlink → canonical Profile/Company unit. Normalize phone `+CC<digits>`, email lowercased.
- **Device-link (R21.4):** server.ts IDENTIFY (1757) mints on unknown token; DEVICE_ENROLL_REQUEST (1968-1985) already validates secretCode. R21.4 adds `resolveKeyToProfile` BEFORE mint → KNOWN_KEY_CHALLENGE → reuse enroll. No new user on known key.
- **Address async (Tron #2):** save immediately verified:false; bg worker hits Nominatim; on hit set verified+osmLink+gmapsLink. Never blocks.
- **Lobby race (R21.2) DIAGNOSED:** RoomBrowser.ts:27 paints `localStorage/random` fallback at show()/render() BEFORE WELCOME→IDENTIFY→PROFILE returns; line 95 only patches input value, no re-render → "default until 2nd reload." Fix: re-render name+avatar block on PROFILE event (one-shot guard for duplicate PROFILE_UPDATED).
- **File detail (R21.9):** rb-file-detail.ts reorder actions→preview(75vh pan/zoom)→metadata.

## OPEN / HANDOFF
- **R21.6 Tron-phone seed `+4915253844085`** NOT minted — needs MEASURED WODA.prod profile uuid; left for expert impl (did not assume fake data).
- PO is creating task files from this design for expert dispatch. MY NEXT: PDCA Check the expert's impl when it lands — verify impl markers wire to the 9 design-ahead Method UUIDs and shipped code matches architecture.

## PROCESS REMINDERS (this host)
- Bash `cd X && ...` / `find` thrash the guardrail → got rejected repeatedly. Use single bare commands; `grep -rl` (auto-allowed) not `find`; Read tool for files. Glob tool is NOT available here.
- Node18: `/root/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/node`
- otmux send to robbinTeam2:0.0 to report. NEVER assume — always measure. Close the loop.
