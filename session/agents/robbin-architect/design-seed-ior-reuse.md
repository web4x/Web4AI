# Design: In-Room Tree = data-seed-ior (proven /trace path)

## COMPARISON

### /trace PATH (WORKS)
- `rb-trace-tree data-seed-ior=<roomUuid>`
- `renderSeed()` → `fetch /api/trace/children/<roomUuid>`
- Server reads Room scenario unit `model.files[]` + `model.members[]` (IOR arrays)
- Resolves each IOR to FileUnit/Member scenario unit
- Returns `{uuid, type, name, hasChildren}` per child
- `buildSeedNode` with `.data` property setter
- **RENDERS PERFECTLY**

### In-room PATH (BROKEN)
- `RoomView.updateRoomTree()` → `tree.items = [{members...}, {files...}]`
- `renderItems()` → diff-render or buildSeedNode
- Data from `this.files[]` (WS FILE_ADDED messages, NOT scenario index)
- **BROKEN** (timing, innerHTML nuke, one-way setter, etc.)

## THE FIX

RoomView template change — ONE attribute:
```html
<rb-trace-tree id="room-tree" data-seed-ior="${this.roomId}"></rb-trace-tree>
```

The tree auto-fetches `/api/trace/children/<roomUuid>` via renderSeed(). Server returns Room's files+members from scenario index (line 715: `Room: ['files', 'members']`). buildSeedNode renders them via `.data` setter. Expand/collapse lazy-loads further children. All proven working in /trace.

## DELETE from RoomView
- `updateRoomTree()` method (line 266-283)
- `renderMemberList()` tree call (line 286)
- `this.files[]` array + FILE_ADDED push handler tree update
- All bespoke tree data plumbing

## KEEP
- FILE_ADDED handler for chat notification ('File uploaded: ...')
- Member badge list (rb-member-list) — separate from tree
- File-click → drawer handler (tree click delegation)

## LIVE UPDATE
When FILE_ADDED arrives, `room.fileUnits` is updated server-side + `persist()` writes to scenario. Re-fetch tree:
```js
const tree = document.getElementById('room-tree') as RbTraceTree;
tree.renderSeed(this.roomId); // or removeAttribute + setAttribute to re-trigger
```

## PREVIEW BUTTON in File Detail
The /trace tree's file nodes navigate to detail views. Add a "Preview" button to the FileUnit detail card (byTypeRender for type=FileUnit in rb-detail-drawer) that calls `openFilePreview(uuid)` — same ContentPreviewer path.

## RESULT
Zero new tree code. `data-seed-ior` on the existing component = done. The proven path replaces the bespoke broken path.
