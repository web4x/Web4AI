#!/bin/bash
# Step A state matrix for the SC8 modifier extension — isolated clone only; nothing here touches the live tree.
W=/tmp/oopTester-sc8/w; O=/tmp/oopTester-sc8; cd "$W" || exit 1
export PATH=/opt/node22/bin:$PATH
G=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/ThinglishGrammar/latest
SPEC=/var/dev/Workspaces/AI/Claude/session/tasks/oopPO-thinglish-grammar-spec-c41c2a8.patch
[ -f $O/sc8-gate.patch ] || git diff -- $G/test/ThinglishGrammar.test.ts > $O/sc8-gate.patch
run() { # $1 label
  npx vitest run $G/test/ThinglishGrammar.test.ts > $O/$1.log 2>&1
  local sum; sum=$(sed 's/\x1b\[[0-9;]*m//g' $O/$1.log | grep -E "^ +Tests " | sed 's/^ *//')
  echo "== $1: ${sum:-NO SUMMARY}"
  sed 's/\x1b\[[0-9;]*m//g' $O/$1.log | grep -E "^ +×" | sed -E 's/^ +× //; s/ [0-9]+ms$//' | cut -c1-120 | sed 's/^/   x /'
}
reset() { git checkout -q -- . ; }
model() { # simulate oopExpert's model: ebnf = the patched spec block (one source), + modifiers record + getter
  python3 - "$1" <<'PY'
import re, sys
W='/tmp/oopTester-sc8/w'; G=f'{W}/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/ThinglishGrammar/latest'
spec=open(f'{W}/spec/thinglish.md').read()
ebnf=re.search(r'^```ebnf\n([\s\S]*?)\n```$', spec, re.M).group(1)
mods={'abstract':['M3Class.isAbstract','M3Method.isAbstract'],'entry':['M3Class.isEntry'],'static':['M3Attribute.isStatic','M3Method.isStatic'],
      'private':['M3Attribute.visibility','M3Method.visibility'],'protected':['M3Attribute.visibility','M3Method.visibility'],
      'override':['M3Attribute.isOverride','M3Method.isOverride'],'async':['M3Method.isAsync'],'redefines':['M3Relationship.redefines']}
seed=sys.argv[1]
if seed=='no-async': mods.pop('async')
if seed=='invented-private': mods['private']=['M3Method.isPrivate']
p=f'{G}/src/ts/EAM/layer3/ThinglishGrammarModel.ts'; s=open(p).read()
s=re.sub(r'ebnf = `[\s\S]*?`;', lambda m: 'ebnf = `'+ebnf.replace('\\','\\\\').replace('`','\\`')+'`;', s, count=1)
lit='{ '+', '.join(f"{k}: [{', '.join(repr(x) for x in v)}]" for k,v in mods.items())+' }'
s=s.replace("  held: Record<string, string> = {};", "  held: Record<string, string> = {};\n  modifiers: Record<string, string[]> = "+lit+";",1)
if seed=='abstract-as-element': s=s.replace("elements: Record<string, string> = { ", "elements: Record<string, string> = { abstract: 'M3Class', ",1)
open(p,'w').write(s)
p=f'{G}/src/ts/EAM/layer2/ThinglishGrammar.ts'; s=open(p).read()
s=s.replace("  get held(): Record<string, string> {", "  get modifiers(): Record<string, string[]> {\n    return this.model.modifiers ?? {};\n  }\n\n  get held(): Record<string, string> {",1)
open(p,'w').write(s)
PY
}
reset; git apply $O/sc8-gate.patch;                              run S0-gate-only
reset; git apply $SPEC;                                          run S1-spec-alone
reset; git apply $SPEC; git apply $O/sc8-gate.patch;             run S2-spec+gate-no-model
reset; git apply $SPEC; git apply $O/sc8-gate.patch; model ok;   run S3-spec+gate+correct-model
reset; git apply $SPEC; git apply $O/sc8-gate.patch; model no-async;            run S3a-seed-async-missing
reset; git apply $SPEC; git apply $O/sc8-gate.patch; model abstract-as-element; run S3b-seed-abstract-as-element
reset; git apply $SPEC; git apply $O/sc8-gate.patch; model invented-private;    run S3c-seed-private-invented
reset; echo "residual: $(git status --porcelain -uno | wc -l)"
