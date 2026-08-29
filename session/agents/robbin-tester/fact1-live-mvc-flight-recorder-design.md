# fact-1 live-MVC Flight Recorder — DESIGN (report-to-PO, do NOT ship unilaterally)

**Problem.** Tron's acting iOS device: after make-current the pin/current updates only after a RELOAD.
NOT headless-reproducible (incl real-WebKit). His reload-fixes-it clue points hard at a client-side
subscription that silently died. We must discriminate **stale-subscription** vs **iOS ws/render**
WITHOUT asking him to test — make the app record what happened during ordinary use.

## The four discriminators → exact existing seams (measured, current HEAD 8312041b4 / 0.8.143)
1. **socket connected at the moment of action** → `RawBinClient` `connected` flag + `ws.readyState`
   (onopen `RawBinClient.ts:77`, onclose `:85`, scheduleReconnect `:152`).
2. **broadcast frame ARRIVED at the client** → `RawBinClient.ws.onmessage` (`:95`) — every unit-changed
   frame passes here → `ViewBus.notify(viewBusKey({type,uuid}))` (`:100`).
3. **subscription still held / gone stale** → `ViewBus.count(ref)` ALREADY EXISTS (`trace/ViewBus.ts:39-41`,
   returns `subs.get(ref)?.size`). At notify time, count==0 ⇒ the subscription died.
4. **re-render fired-but-no-change vs never-fired** → `ViewBus.notify` (`trace/ViewBus.ts:32-36`) iterates the
   listener set + calls each cb. Record cb-count + any throw.

## Shape: a bounded in-memory ring buffer + reload-triggered beacon flush
- **Ring buffer**: last ~200 events, in memory only. No storage growth, no periodic network.
- **Event kinds** (compact, technical-only — timestamps, ref keys `type:uuid`, socket state, counts; NO content/PII):
  - `socket`   `{t, state: open|close|reconnecting|reconnected, readyState}`
  - `frame`    `{t, ref, readyState, listenerCount: ViewBus.count(ref)}`  ← the core row
  - `render`   `{t, ref, cbCount, threw:bool}`  (from inside notify)
  - `sub`/`unsub` `{t, ref}`  (pin subscribe/unsubscribe in rb-trace-tree — the stale-sub timeline)
- **Flush = his fix-reload IS the trigger.** `navigator.sendBeacon('/api/diag/live-mvc', buffer)` on
  `pagehide` (also `visibilitychange`→hidden for iOS backgrounding). The reload he already performs to
  heal the symptom ships us the recording of the seconds before it. Zero extra action from him.
- Server: append the beacon to `data/logs/live-mvc-diag-<date>.log` (like addLog). Read-only diag sink.

## Discrimination table (ONE recording answers it)
| recording pattern | verdict |
|---|---|
| `frame` present · listenerCount>0 · render cbCount>0 · he saw no change | **iOS render** (re-render fired, DOM didn't reflect) |
| `frame` present · **listenerCount==0** | **stale/dead subscription** (frame arrived, nobody listening; reload re-subscribes) ← reload-fixes-it signature, PO's lead |
| **no `frame`** near the action · last `socket`=close with no `reconnected` | **transport**: iOS suspended the socket (backgrounded tab) — readyState≠OPEN at action time |
| `frame` present · listenerCount>0 · render `threw:true` | re-render EXCEPTION (a third, findable cause) |

## Constraints honored
- **PASSIVE / behavior-neutral**: only READS state that already exists (`ws.readyState`, `ViewBus.count`)
  at points code already runs (notify, onopen/onclose, sub/unsub). Adds a push to a bounded buffer +
  a sendBeacon on unload. No visible change, no prompt, no action he wouldn't take.
- **Needs a small deploy → rides the next one** (PO-permitted). The hooks are tiny + additive; ships DORMANT.
- **His device = his call**: gate activation behind an opt-in (config `LIVE_MVC_DIAG=1` OR `?diag=live-mvc`),
  so the code rides the deploy inert and records ONLY once Tron authorizes. No unilateral activation.
- **No PII**: refs are unit ids (type:uuid), not personal; no content, no keystrokes, no tokens.

## Not-in-scope / honesty
- This does not FIX anything — it closes OUR capability gap so the next ordinary use produces evidence.
- It cannot run headless-usefully (the whole point is his real iOS); the design is validated by CODE
  review of the seams, not a headless green. I will NOT claim a green from it.

## Status
DESIGNED. Reported shape to PO. Awaiting: PO/Tron go on (a) shipping dormant on the next deploy + (b) opt-in
activation on his device. Meanwhile HOLDING r-next-slot-check.mjs ready to re-gate fact-2 RED→GREEN + stub-must-fail
the moment the NEXT-derivation fix lands.
