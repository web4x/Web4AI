[Back to Sprint 1 Design](./sprint-1-design.md)

# Task SC-F: Snapshot integrity + format versioning
[task:uuid:9b0eca40-2fa7-44a8-8270-7bb75bfcde20]

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up: [Sprint 1 Design](./sprint-1-design.md)
- down:
  - [SC-F.1 expert — snapshot format version field](./task-sc-f.1-expert-snapshot-version.md)
  - [SC-F.2 expert — teams.save validates each line](./task-sc-f.2-expert-save-validates.md)
  - [SC-F.3 expert — teams.restore validates each line](./task-sc-f.3-expert-restore-validates.md)
  - [SC-F.4 tester — corrupt + version-skew reject](./task-sc-f.4-tester-corrupt-reject.md)

## Description
Prevent the next teams.env-garbage incident at its actual source: the snapshot
file. Add format-version header, validate per-line on both save and restore.

## Depends on
SC-E (re-uses regex validation primitives).

*Sprint 1 · Epic SC-F*
