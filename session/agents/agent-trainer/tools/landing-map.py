#!/usr/bin/env python3
# landing-map: exact rewind landing % per checkpoint, read from the target's LIVE transcript chain.
# usage: landing-map.py <session-uuid>   (uuid via: claudeCode session.current <pane>)
# Walks parentUuid from the newest entry (skips abandoned rewind branches), prints for each user
# prompt the context size just before it = where "restore to the point before" that prompt lands.
# Picker hides <task-notification> prompts; 'vis' = position counted among visible picker entries.
import json, sys, os
f = os.path.expanduser(f"~/.claude/projects/-var-dev-Workspaces-AI-Claude/{sys.argv[1]}.jsonl")
ents, order = {}, []
for line in open(f):
    try: e = json.loads(line)
    except: continue
    if e.get("uuid"): ents[e["uuid"]] = e; order.append(e["uuid"])
cur, chain = order[-1], []
while cur in ents: chain.append(ents[cur]); cur = ents[cur].get("parentUuid")
chain.reverse(); last = 0; rows = []
for e in chain:
    if e.get("type") == "assistant":
        u = (e.get("message") or {}).get("usage") or {}
        t = u.get("input_tokens",0)+u.get("cache_read_input_tokens",0)+u.get("cache_creation_input_tokens",0)
        if t: last = t
    elif e.get("type") == "user" and not e.get("isMeta"):
        c = (e.get("message") or {}).get("content")
        if isinstance(c, list):
            if any(isinstance(x,dict) and x.get("type")=="tool_result" for x in c): continue
            c = " ".join(x.get("text","") for x in c if isinstance(x,dict))
        c = str(c)
        if not c.strip() or c.startswith("<command") or c.startswith("<local"): continue
        rows.append((e.get("timestamp","")[:16], last, c.replace("\n"," ")[:70]))
print(f"final ctx {last}  (must equal the target's panel - else STOP, instrument invalid)")
vis = 0
for ts, ctx, txt in reversed(rows):
    if not txt.startswith("<task-notification"): vis += 1
    print(f"vis{vis:3d} {ts} land~{ctx/10000:5.1f}% {txt}")
