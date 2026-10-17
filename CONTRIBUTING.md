# Contributing

## Getting started

Use the Node version in `.nvmrc` (with nvm, run `nvm use`), then install the locked
dependencies:

```sh
npm ci
```

Library and documentation builds target ES2022. Runtime environments must support
ES2022 syntax and APIs, including `Object.hasOwn`, or transpile the output and
provide suitable polyfills.

See [AGENTS.md](AGENTS.md) for the source map and behavioral invariants.

## Development

Use the scripts in `package.json`:

| Command                                          | Purpose                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| `npm run test:unit`                              | Run all Vitest unit tests                                           |
| `npm run test:unit -- test/update/scheduling.ts` | Run a specific test file; multiple paths are supported              |
| `npm run test:unit -- --watch`                   | Run tests in watch mode                                             |
| `npm run test:types`                             | Type-check library source (not tests or docs examples)              |
| `npm run test:fmt`                               | Check repository formatting                                         |
| `npm exec prettier -- --write <paths>`           | Format selected files                                               |
| `npm run build`                                  | Compile CJS, ESM, and declaration files into `dist/` and `esm/`     |
| `npm run docs`                                   | Compile examples and bundle the guide into `docs/main.js`           |
| `npm test`                                       | Run unit, type, formatting, and dependency-audit checks in parallel |

Before submitting code changes, run the unit suite, type check, formatting check,
and library build. Run the docs build when changing examples or code they depend
on. Documentation-only changes need a formatting check.

`npm run test:audit` requires registry access and checks installed dependencies.
Report audit/network failures separately from failures in the deterministic checks.

## Tests and snapshots

Tests use `web-audio-test-api`, configured in `vitest/setup.ts`. Its `toJSON` and
`$stateAtTime` methods are mock-only helpers, not browser APIs.

Create a fresh audio context and graph for each test; put related updates in the
same test. Assert scheduling and routing behavior explicitly. When assertions
run in a loop, use known node IDs and an assertion count so an empty loop cannot
pass silently.

To update snapshots for an intentional behavior change, scope the command:

```sh
npm run test:unit -- test/update/expectedBehavior.ts --update
```

Review every snapshot diff. Do not update snapshots merely to make a failure pass.

## Documentation and generated output

Edit guide content in `docs/index.html`, examples in `docsSrc/main.ts`, and factory
reference material in `docs/standard-nodes.md`. After `npm run docs`, serve `docs/`
over HTTP with a local static server to exercise the examples in a browser.

Do not commit generated `dist/`, `esm/`, or `docs/main.js`. The documentation build
also creates temporary `docsSrc/esm/` output and removes it on success.

## Releases

The GitHub Actions workflow runs `npm test` on pushes. After successful checks on
`master`, it builds the library and runs semantic-release.

Use Conventional Commit messages, such as `fix: correct channel routing` or
`feat: add a node factory`, so semantic-release can determine the release type.
Mark breaking changes explicitly with a `BREAKING CHANGE:` footer. Do not bump
versions or publish packages manually.

`CHANGELOG.md` is historical and no longer maintained; current release notes are
published in GitHub releases.
