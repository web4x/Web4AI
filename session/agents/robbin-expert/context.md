# robbin-expert Context — Save Point 2026-05-24 (post Sprint 8 + avatar hotfix)

**Role**: Web4RawBin Implementation Authority
**Status**: v0.3.15 deployed — avatar fix shipped. Queue empty, standing by.
**Machine**: Mac Studio
**Pane**: robbinTeam:0.2

## Project
**Web4RawBin** v0.3.15 — Collaborative rooms + Monaco editor + encrypted storage + PWA
- Repo: `/Users/Shared/Workspaces/2cuGitHub/Web4RawBin`
- Live: https://home.donges.it:4444/app
- Editor: https://home.donges.it:4444/edit/<path>
- Commit: ed1ad01 (main)

## What Just Shipped (v0.3.15)
**Avatar fix** — two Tron-reported bugs:
1. **Lobby semicircle**: `flex-shrink: 0` on `:host`, `display: block` on `.circle` and img, removed `transform:scale` from crop
2. **Overlay showing initial "R" instead of photo**: Added `getAvatarUrl()` method that falls back to `/api/avatar/<token>` when `src` attribute empty but `token` is set — per Tron directive, component always tries encrypted avatar endpoint

## Code Summary (8 sprints + hotfixes, ~75 tasks)

### Server (src/ts/server/)
- `server.ts` — HTTPS+WS+routes (~1300 lines)
- `Room.ts` — rooms with members/spectators/chat/persistence
- `UserKeys.ts` (192) — RSA-2048 keypairs, device enrollment, challenge-response
- `UserCrypto.ts` (112) — AES-256-GCM + RSA envelope encrypted file storage
- `FileApi.ts` (95) — readDir/readFile/writeFile with sanitization + auth

### Client Components (src/public/ts/components/ — 13 total)
- rb-update-banner, rb-header, rb-chat-sheet, rb-overlay, rb-member-badge, rb-member-list, rb-qr-popup, rb-avatar
- Sprint 8: rb-editor-layout, rb-file-tree, rb-code-editor, rb-preview, rb-editor-toolbar

### Client Pages
- `app.ts` (91) — room app with gate/enrollment/browser/roomview
- `edit.ts` (110) — Monaco editor with file tree, preview, save

### Build & Deploy
```bash
npm run build       # → app-[HASH].js + edit-[HASH].js + rb-update-banner-[HASH].js
npm run dev         # tsx watch
npm run test        # 631 vitest (13 files)
npm run test:e2e    # 15 Playwright (6 app + 9 editor)
```
Deploy: bump version → `npm run build` → `git push` → restart iphone:0.1

### Key Routes
- `/app` — room app (PWA)
- `/edit/<path>` — Monaco editor
- `/api/files/<path>/` — readDir, `/api/files/<path>` — readFile, PUT writeFile
- `/api/puml-render` — POST PlantUML → SVG
- `/api/avatar/<token>` — encrypted avatar serving (GET decrypts, POST encrypts+stores)
- `/api/health`, `/api/config`, `/md/`, `/docs/`

### Avatar Pipeline (Tron directive)
- POST /api/avatar: accepts {playerToken, data, mimeType} → encryptFile → profile.avatar = /api/avatar/<token>
- GET /api/avatar/<token>: decryptFile → serves with Content-Type from meta, ETag+304
- rb-avatar component: `getAvatarUrl()` falls back to `/api/avatar/<token>` from token attr
- Global refresh: window 'rb-avatar-updated' event with {token, url, crop}
- 26 users have encrypted avatars in data/users/<token>/files/avatar.enc

### Test Baselines
- vitest: 631/631 (13 files)
- Playwright app: 6/6
- Playwright editor: 9/9
