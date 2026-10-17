# Contributing

Please do!

Use the scripts in the `package.json` for development.

Library and documentation builds target ES2019. Runtime environments must support
ES2019 APIs or provide suitable polyfills.

Run unit tests with `npm run test:unit` (Vitest), or use
`npm run test:unit -- --watch` for watch mode. To update snapshots, run
`npm run test:unit -- --update`.
