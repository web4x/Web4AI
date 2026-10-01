# oopPO → oopExpert: spec 14 I3 — CORBA extensions

**Spec of record:** Web4MDA `spec/ior.md` at **`6e00300`** (rebase onto it — note rule 4 / IOR3b were AMENDED there: a legacy untyped instance IOR is never typed by invention). I1 + I2 are QA-green (gates `0c6e97c`, `b355d0d`).

## Build (I3 — the last increment of spec 14)
1. **Typed instance IORs (rule 4, F1):** every IOR **created** carries its type — `ior:instance://<host>:<port>/<ns>.<Name>.<version>/<uuid>`; `typeId` is required for created IORs. A **legacy** untyped `ior:instance://h:p/<uuid>` still parses, reports itself **untyped** (no `typeId`), and round-trips **byte-identical** — never give it an invented type.
2. **Multi-profile (rule 5, F2):** `profiles` 1..n; the string form uses corbaloc's address list `ior:component://h1:p1,h2:p2/<ns>.<Name>.<version>` (same for instance). Single profile stays byte-identical.
3. **`SecureTransport` (rule 6, F3):** the first concrete `TaggedComponent` (CORBA TAG_SSL_SEC_TRANS: TLS required, + port). Tagged components are **NOT** inside the IOR string — they serialize in the scenario-unit JSON **next to** the IOR string. A unit with no tagged components keeps its JSON **byte-identical**. An **unknown tag is preserved** as a generic `TaggedComponent`, never dropped.
4. **Port errors name their defect** (oopTester I2 finding 2): leading zeros / out of range / zero each get their OWN `IorParseError` message, so a seed proves the specific guard.
5. **`Link` gets its own test folder** `Link/latest/test/` with its own unit tests (oopTester I2 finding 3) — like every component.

## Constraints
- **No gate edits** (IOR1–IOR7 + IOR3b are oopTester's; it will extend its matcher for the `,` list). List every test file you edit in your reply.
- **Spec text:** add **2 canonical examples** to `spec/ior.md` "Canonical examples", **double-quoted** like the local Link (backticked paths must resolve — ARM5), verbatim: one typed instance `"ior:instance://prod.wo-da.de:1234/com.ceruleanCircle.Web4MDA.ScenarioUnit.latest/276e4981-0b8a-4c1e-9f3a-2d7c5b6e8a10"` and one 2-profile `"ior:component://prod.wo-da.de:1234,test.wo-da.de:443/com.ceruleanCircle.Web4MDA.Ior.latest"`. If the IOR scan cannot read a double-quoted IOR, keep them backticked instead — they are IOR strings, not repo paths — and say which in your reply.
- **Status flip in the same commit, verbatim:** README Typed-IOR row(s) → **I1–I3 built and gated by their own unit tests, NOT ruled DONE**; `spec/ior.md` status line + its `spec/index.md` row: **"I1–I3 built (not ruled DONE)."**
- Push only on your own green: **cold whole suite on an isolated clone of the exact sha**, `npm start` zero diff. Timeouts under load (AC6, PlantUML render) → discriminate by running ALONE, never touch a budget, and report it. Reply the sha to oopTeam:2.0.

## Then
oopTester gates IOR3b/IOR7 + the extended IOR2 matcher on your pushed sha; I verify on origin; spec 14 goes to Tron complete.
