# Done: Fix oo use <branch> <command> completion
**Agent**: oosh-expert
**Task**: expert-fix-oo-use-command-completion-v2.md
**Result**: PASS
**Summary**: Fixed oo.use.completion.command() to read PARAM_branch from current.method.env instead of $1 (which is $cur in completion context). Also fixed c2 to pass $class instead of $script to private.call.custom.completion.
**Commit**: ddca28d
**Next**: Tester should verify in interactive shell: `oo use dev <TAB>` shows scripts (config, log, oo, this...) not branches
