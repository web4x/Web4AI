# robbin-architect Context (Save 2026-06-11, 32% ctx)

## ACTIVE — standing by for next dispatch
Pane: robbinTeam2:0.4
Team: 0.0=po | 0.1=planner | 0.2=expert | 0.3=skill-expert | 0.4=ME | 0.5=req | 0.6=tester | 0.7=shell

## OVERNIGHT DRIVE STATUS (2026-06-11)
Top-of-chain ALL ZERO:
  reqNoUC: 0 (132 active + 34 orphan-by-design)
  ucNoClass: 0 (47 UCs synced class→classes[])
  ucNoMethod: 0
  classNoMethod: 0
  methodNoImpl: 0 (65 real impls, all with [impl:uuid:] markers)
  
Tool (po-chain-follow-up.ts):
  open architect (non-orphan): 0
  open architect (orphan-by-design): 18 (tool doesn't skip orphanByDesign flag)

Impl integrity: 65/65 with real source + markers. 0 stubs. 0 design-stage-only.

## CHAINS DESIGNED THIS SESSION
R19.35 room.persistMembers → Room.persistMembers (members[] IOR refs on Room model)
R19.36 dropZone.uploadFile → DropDispatcher.uploadFile (DnD file upload)
R19.37 dropZone.dispatchUnknown → DropDispatcher.routeUnknown (unknown format → chat)
R19.38 message.persistAsUnit → Message.createMessageUnit (chat as scenario units, doubly-linked)
R19.38 chat.lazyLoad → Message.lazyLoadChain (GET /api/room/<rid>/messages?before=&limit=5)
R19.39 user.ensureSystemOwner → User.ensureRawBinUser (RawBin system user 00000000-...)
R19.40 chat lazy-load → wired to chat.lazyLoad UC
R19.41 server.leveledLog → Logger.logAtLevel (error/warn/info/debug/trace, LOG_LEVEL env)
R19.42-44 dropZone.feedbackCycle → DropDispatcher.feedbackCycle (progress statusbar + system messages)
R19.45 offlinePage.flushCache → ServiceWorker.flushAndReload (red button, nuclear cache clear)
T-persistent-retention → Room.retainOrPrune (mode-aware disconnect)
T-persistent-dedup → addMember match-by-playerToken
T-remove-room-sizes → Room.stripSizeLimits
T-remove-spectator → Room.stripSpectator
T-room-editor → room.editConfig → RbRoomDetail.editOpen
T-room-symlink → room.symlinkCanonical → Room.persistAsSymlink
T-room-link-affordance → room.linkToScenario → RbRoomDetail.scenarioLinkRender

## DIAGNOSES THIS SESSION
- Persistent member retention: removeMember called unconditionally, markDisconnected is dead code
- Persistent dedup: addMember keys by clientId not playerToken → duplicate on rejoin
- rb-tree false reuse: components/rb-tree.ts is 75-line fake, not /trace rb-object-item
- rb-object-item blank in room: white-on-white (white text on white bg)
- Members/Files headers: black-on-black after dark bg fix
- Badge=0 on /trace: TRACE_FWD uses singular 'method'/'implementation' but units have plural 'methods[]'/'implementations[]'
- Share-link offline: SW cacheFirst matches full URL incl query, /app?join=... misses cache
- Edit pen 404: Room unit sourceFile points to per-user path, not canonical
- Room link 404: likely stale SW-cached 404
- R19.27 collapse broken: flex:1 overrides width:40px, min-width:120px fights it
- FileUnit unitLinks: syncLinks resolves scenario/-relative (correct), room-FS link needs separate symlink

## DESIGN CONVENTIONS (from Tron this session)
- Skills = thin CLI dispatch to typed Class.method (OOSH Object.verb)
- Logic lives in the method, skill is the veneer
- Same model as scenario chains → skills become traceable UC→Class→Method units

## STANDING RULES
- Wait for PO assignment. Never self-assign.
- NEVER /compact. Only /rewind via agent-trainer.
- NEVER ASSUME — ALWAYS MEASURE.
- Architect ships scenario units (real v4 UUIDs only).
- UC.class + UC.classes[] both populated (tool reads plural).
- No placeholder UUIDs (0000-padded) — always real v4.
