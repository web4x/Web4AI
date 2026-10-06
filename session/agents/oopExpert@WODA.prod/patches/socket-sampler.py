import time, sys, os
out = sys.argv[1]; stop = sys.argv[2]
def table():
    return {l.split()[7] for l in open('/proc/net/unix').read().split('\n')[1:] if len(l.split()) >= 8}
base = table(); seen = set(); n = 0
while not os.path.exists(stop):
    for p in table() - base:
        if (p.startswith('/var/dev/Workspaces') or p.startswith('/tmp/tsx')) and p not in seen: seen.add(p)
    n += 1; time.sleep(0.2)
open(out, 'w').write(f'samples={n}\n' + '\n'.join(sorted(seen)) + '\n')
