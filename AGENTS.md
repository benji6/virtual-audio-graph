# Agent guide

## Scope and layout

Keep the runtime dependency-free and preserve the public factory API.

- `src/index.ts`, `src/nodeFactories.ts`, `src/createNode.ts`, and
  `src/createWorkletNode.ts`: public entry point and factories.
- `src/VirtualAudioGraph.ts` and `src/updateVirtualNodeGraph.ts`: graph ownership
  and reconciliation.
- `src/connectAudioNodes.ts`: routing, including AudioParam and custom-node inputs.
- `src/VirtualAudioNodes/`: standard, custom, and worklet node lifecycle.
- `test/`: Vitest tests and snapshots; `test/utils/` contains reusable node fixtures.
- `vitest/setup.ts`: installs and configures the `web-audio-test-api` globals.
- `docsSrc/main.ts`: interactive guide examples; `docs/standard-nodes.md`: factory
  reference; `docs/index.html`: guide content.

## Setup and validation

Use the Node version in `.nvmrc` and install dependencies with `npm ci`.
See [CONTRIBUTING.md](CONTRIBUTING.md) for the complete workflow.

- Focused tests: `npm run test:unit -- test/update/scheduling.ts` (substitute the
  relevant test paths; multiple paths can be passed together).
- All unit tests: `npm run test:unit`.
- Library types: `npm run test:types` (does not type-check tests or examples).
- Formatting: `npm run test:fmt`; format only changed files with
  `npm exec prettier -- --write <paths>`.
- Library builds: `npm run build`.
- Documentation/examples: `npm run docs`.
- CI test command: `npm test`; this also runs the network-dependent dependency
  audit. Report audit failures separately from code/test failures.

Use focused tests while iterating. Before handing off code changes, run the unit
suite, type check, formatting check, and library build; build docs when changing
examples or their dependencies. Documentation-only edits need a formatting check.

## Behavioral invariants and tests

These are correctness requirements, not a claim that every edge case is already
implemented. Add regression tests when fixing violations.

- Equivalent updates preserve existing native nodes and do not replay automation.
- Replaced nodes regain affected incoming and outgoing connections, including
  AudioParam modulation and custom-node boundaries.
- Preserve channel index zero and support fan-out, `NO_OUTPUT`, and feedback
  graphs. Do not assume the graph is acyclic.
- Preserve source start/stop scheduling and the distinction between graph output
  (`OUTPUT`) and custom-node input (`INPUT`).
- Create fresh contexts/graphs per test. Keep successive updates within one test
  when testing reconciliation.
- Prefer `getAudioNodeById` over private runtime state. For loop-driven assertions,
  use known IDs and `expect.assertions(...)` so an empty iteration fails.
- Assert behavior and connection arguments directly; snapshots alone do not prove
  scheduling or channel routing. Inspect snapshot diffs rather than blindly
  regenerating them.
- The mock exposes nonstandard helpers such as `toJSON` and `$stateAtTime`; it is
  not a substitute for browser verification, especially for worklets.

## Generated files and releases

Do not hand-edit or commit generated `dist/`, `esm/`, or `docs/main.js`.
`docsSrc/esm/` is temporary documentation compiler output, removed by a successful
docs build. Keep changes to source files and intentional test snapshots.

Releases are automated with semantic-release after CI on `master`. Do not publish
or change package versions manually. `CHANGELOG.md` is historical; current release
notes live in GitHub releases.
