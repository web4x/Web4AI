# Fix testUbuntuRoot oosh — answers for tester

## Q1: How to switch to test/macos.latest when oo crashes?

The debug crash blocks ALL oosh commands on `dev`. Workaround: call the `macos.latest` version directly (it has the debug fix):

```bash
# Use the fixed branch directly (bypass ~/oosh symlink)
FIXED=/home/shared/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/Once.sh/macos.latest

# Pull latest fixes
cd $FIXED && git pull origin test/macos.latest

# Switch symlink manually (oo mode can't work until debug is fixed)
rm ~/oosh
ln -s $FIXED ~/oosh

# Start new bash to pick up new PATH
exec bash
```

## Q2: Fix debug on dev branch too?

No — we don't modify `dev` or `prod`. Those branches are managed by `oo release`. The fix lives on `test/macos.latest`. Just switch the symlink to `macos.latest` (above).

## Q3: Delete spurious "rm" worktree?

```bash
cd /home/shared/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/Once.sh/prod
git worktree remove rm --force
git branch -D rm
```

## RULE: Never rm ~/oosh

`~/oosh` is THE symlink that makes all oosh commands work. Without it, PATH breaks, every command fails. Only `oo mode` should touch it. If it breaks, restore it manually to ANY working worktree, then use `oo mode` to switch properly.
