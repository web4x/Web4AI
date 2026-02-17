# OOSH Parameter Naming Rule

## Rule

OOSH parameter names MUST be valid bash identifiers:
- Letters, numbers, underscores only
- Cannot start with a number
- No dashes, no special characters

## Why

OOSH converts method signature parameters (e.g., `# <myParam>`) into bash variables (`PARAM_myParam`). If the parameter name contains invalid characters (like dashes), bash crashes when trying to assign the variable.

## Examples

| BAD | WHY | GOOD |
|-----|-----|------|
| `<name-or-pane>` | `PARAM_name-or-pane` is invalid bash | `<target>` or `<nameOrPane>` |
| `<ssh-dir>` | `PARAM_ssh-dir` is invalid bash | `<sshDir>` or `<ssh_dir>` |
| `<3letter>` | Can't start with number | `<threeLetterCode>` |

## Applies to

ALL method signatures in ALL OOSH scripts. This is a framework-level constraint, not a style preference.

## Detection

```bash
# Find violations in a script
grep -E '# <[a-zA-Z0-9]*-' /Users/donges/oosh/scriptname
```
