# virtual-audio-graph

[![npm version](https://badge.fury.io/js/virtual-audio-graph.svg)](http://badge.fury.io/js/virtual-audio-graph)
[![Build Status](https://api.travis-ci.org/benji6/virtual-audio-graph.svg?branch=master)](https://travis-ci.org/benji6/virtual-audio-graph)
[![dependencies](https://david-dm.org/benji6/virtual-audio-graph.svg)](https://david-dm.org/benji6/virtual-audio-graph)

## Overview

Small and dependency-free library for declaratively manipulating the Web Audio API.

virtual-audio-graph manages the state of the audio graph so this does not have to be done manually. Simply declare what you would like the audio graph to look like and virtual-audio-graph takes care of the rest.

Inspired by [virtual-dom](https://github.com/Matt-Esch/virtual-dom) and [React](https://github.com/facebook/react).

## Installation

```bash
npm i -S virtual-audio-graph
```

virtual-audio-graph is distributed as a bundled CJS module by default, however, there is also a `module` property in its `package.json` so tools like [Rollup](https://github.com/rollup/rollup) and [Webpack](https://github.com/webpack/webpack) can consume an ES modules build.

## Size

virtual-audio-graph is designed to be small and weighs in at 7.5kB minified (2.4kB minified & gzipped) according to [bundlephobia](https://bundlephobia.com) (https://bundlephobia.com/result?p=virtual-audio-graph@1.0.2).

## Docs

First check out [the virtual-audio-graph guide](https://virtual-audio-graph.netlify.com) for working examples and to understand how the library works.

Then see the [API docs for all supported virtual audio node factory functions](docs/standard-nodes.md).

For an example of virtual-audio-graph working in a real application you can take a look at [Andromeda](https://github.com/benji6/andromeda) which is one of my other projects.
