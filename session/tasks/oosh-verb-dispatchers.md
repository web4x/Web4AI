# Task: OOSH generic verb dispatchers (get, set, list)

**Priority**: HIGH — framework-level feature
**Assigned**: oosh-expert (implementation), oosh-tester (tests)
**Date**: 2026-03-27

## Well done team!

Great delivery on ossh object.verb naming, sender prefix, team.pull, stdin fix, and UUID DRY. Solid work.

## New Feature: Generic Verb Dispatchers

### The Pattern

OOSH scripts that have multiple `object.verb` methods (e.g. `config.identityFile.get`, `config.user.get`, `config.port.get`) should also provide convenience dispatchers for common verbs:

```bash
# Instead of remembering the full method:
ossh config.identityFile.get myHost

# You can also call:
ossh get identityFile myHost
# which dispatches to: ossh.config.identityFile.get myHost

# Same for set:
ossh set identityFile myHost /path/to/key
# dispatches to: ossh.config.identityFile.set myHost /path/to/key
```

### Method Signatures

```bash
scriptname.get() # <object> <?args...> # dispatches to scriptname.object.get
{
  local object="$1"
  shift
  local method="${BASH_SOURCE[0]##*/}.${object}.get"
  if type -t "$method" &>/dev/null; then
    "$method" "$@"
  else
    error.log "no get method for '$object'"
    return 1
  fi
}

scriptname.list() # <?objectFilter> # list available objects that have get/set/list methods
{
  local filter="${1:-}"
  local scriptBase="${BASH_SOURCE[0]##*/}"
  # Find all methods matching scriptname.*.get or scriptname.*.list
  compgen -A function "${scriptBase}." | grep -E '\.(get|set|list)$' | \
    sed "s/^${scriptBase}\.\(.*\)\.\(get\|set\|list\)$/\1/" | sort -u | \
    { [ -n "$filter" ] && grep -i "$filter" || cat; }
}

scriptname.set() # <object> <args...> # dispatches to scriptname.object.set
{
  local object="$1"
  shift
  local method="${BASH_SOURCE[0]##*/}.${object}.set"
  if type -t "$method" &>/dev/null; then
    "$method" "$@"
  else
    error.log "no set method for '$object'"
    return 1
  fi
}
```

### Tab Completion

```bash
scriptname.get.completion.object() {
  # List all objects that have a .get method
  local scriptBase="${BASH_SOURCE[0]##*/}"
  compgen -A function "${scriptBase}." | grep '\.get$' | \
    sed "s/^${scriptBase}\.\(.*\)\.get$/\1/"
}

scriptname.set.completion.object() {
  local scriptBase="${BASH_SOURCE[0]##*/}"
  compgen -A function "${scriptBase}." | grep '\.set$' | \
    sed "s/^${scriptBase}\.\(.*\)\.set$/\1/"
}

scriptname.list.completion.objectFilter() {
  scriptname.get.completion.object
}
```

### Which Scripts Get This

Any script that already has `object.get` / `object.set` patterns:
- **ossh** — config.identityFile.get/set, config.user.get/set, config.port.get/set etc.
- **config** — already has get/set but could benefit from list
- **hiveMind** — registry.set, registry.get, team.list etc.

### Implementation Plan

1. **Expert**: Add `get`, `set`, `list` dispatchers to `ossh` first (it has the most object.get/set methods)
2. **Expert**: Verify pattern works, then add to `hiveMind` and `config` if applicable
3. **Expert**: Consider if this should be a template in `oo new` for new scripts
4. **Tester**: Write tests — `get <object>` dispatches correctly, `list` shows all objects, completion works, unknown object returns error
5. **Both**: Update `docs/oosh-architecture.md` with the verb dispatcher pattern as an OOSH principle

### OOSH Principle Addition

Add to `docs/oosh-architecture.md` under Method Structure:

> **Generic Verb Dispatchers**: Scripts with multiple `object.verb` methods SHOULD provide
> convenience dispatchers: `script.get <object>`, `script.set <object> <value>`,
> `script.list <?filter>`. These dispatch to `script.object.get/set/list` automatically.
> Tab completion for the object parameter is auto-derived from available methods.

### Acceptance Criteria

- [ ] `ossh get identityFile myHost` dispatches to `ossh.config.identityFile.get myHost`
- [ ] `ossh set user myHost root` dispatches to `ossh.config.user.set myHost root`
- [ ] `ossh list` shows all objects with get/set methods
- [ ] `ossh list identity` filters to matching objects
- [ ] Tab completion works: `ossh get <TAB>` shows available objects
- [ ] Unknown object returns clear error
- [ ] `docs/oosh-architecture.md` updated with the pattern
- [ ] Tests pass
