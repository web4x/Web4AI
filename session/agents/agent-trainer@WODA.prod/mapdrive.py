# mapdrive.py <target.jsonl> <N> : map rewind-picker entries to landing size. Prints the last N user prompts on the LIVE parentUuid chain, newest first, with the jsonl usage (input+cache_read+cache_creation+output) of the assistant turn before each = the panel MESSAGES line after landing there (panel total = that + ~57k overhead). Validated 2026-10-14 on oopPO: 459.5k predicted vs 459.8k measured.
import json,sys
p=sys.argv[1]; N=int(sys.argv[2])
E={};order=[]
for l in open(p):
    try:d=json.loads(l)
    except:continue
    u=d.get('uuid')
    if u: E[u]=d; order.append(u)
leaf=order[-1]; chain=[]; u=leaf
while u in E: chain.append(E[u]); u=E[u].get('parentUuid')
chain.reverse()
def ctx(d):
    us=d.get('message',{}).get('usage') or {}
    return (us.get('input_tokens',0)+us.get('cache_read_input_tokens',0)+us.get('cache_creation_input_tokens',0)+us.get('output_tokens',0))
last=0; rows=[]
for d in chain:
    if d.get('type')=='assistant':
        c=ctx(d); last=c if c else last
    elif d.get('type')=='user' and not d.get('isMeta'):
        c=d.get('message',{}).get('content')
        if isinstance(c,list):
            if any(isinstance(x,dict) and x.get('type')=='tool_result' for x in c): continue
            c=' '.join(x.get('text','') for x in c if isinstance(x,dict))
        if not isinstance(c,str) or not c.strip() or c.startswith('<command') or c.startswith('<local-command'): continue
        rows.append((last,d.get('timestamp','')[11:19],c.strip().replace('\n',' ')[:75]))
print('chain len',len(chain),'leaf ctx',last)
for i,(k,t,txt) in enumerate(reversed(rows[-N:]),1): print(f'{i:3} {k/1000:6.1f}k {t} {txt}')
