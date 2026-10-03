import re, sys
p = sys.argv[1]
L = open(p).read().split('\n')
i = next(k for k, l in enumerate(L) if len(re.findall(r"'[^']*'", l)) > 10)
q = re.findall(r"'[^']*'", L[i])
L[i] = L[i].replace(q[0] + ', ' + q[1], q[1] + ', ' + q[0], 1)
open(p, 'w').write('\n'.join(L))
print('seed 1 unsorted the in-line list on line', i + 1)
