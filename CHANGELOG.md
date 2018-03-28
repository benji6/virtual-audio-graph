# Release Notes

## __This Changelog is no longer in use, please see GitHub releases for changes made since 0.19.x.__

## 0.19.x

### Added

`bufferSource` now supports `offsetTime`

## 0.18.x

virtual-audio-graph no longer has any external dependencies

## 0.17.x

Breaking API change - `defineNodes` removed. `virtual-audio-graph` no longer internally remembers the custom node creator functions and these must be passed directly. This is more inline with how virtual-dom libraries handle component abstractions and keeps `virtual-audio-graph`'s internal state management to the audio graph alone

```javascript
// old API
virtualAudioGraph.defineNodes({coolCustomNode})
virtualAudioGraph.update({0: ['coolCustomNode', 'output', {someParams}]})
```

```javascript
// new API
virtualAudioGraph.update({0: [coolCustomNode, 'output', {someParams}]})
```

## 0.16.x

Using [Rollup](https://github.com/rollup/rollup) for bundling ES5 dist.

Added `jsnext:main` ([more info](https://github.com/rollup/rollup/wiki/jsnext:main)) to package.json

## 0.15.x

Breaking API change - `defineNode` replaced by `defineNodes`:

```javascript
// old API
virtualAudioGraph.defineNode(coolEffect, 'coolEffect');
virtualAudioGraph.defineNode(someOscillators, 'someOscillators');
```

```javascript
// new API
virtualAudioGraph.defineNodes({coolEffect, someOscillators});
```

## 0.14.x

Added support for AudioParam methods

## 0.13.x

`virtual-audio-graph` now exports a factory instead of a constructor


```javascript
// pre 0.13.x
import VirtualAudioGraph from 'virtual-audio-graph';
const virtualAudioGraph = new VirtualAudioGraph();
```


```javascript
// 0.13.x
import createVirtualAudioGraph from 'virtual-audio-graph';
const virtualAudioGraph = createVirtualAudioGraph();
```

Because of the way the new operator works this is not a breaking change

## 0.12.x

Breaking API change:

```javascript
const newAPI = {
  0: ['oscillator', 'output'],
  1: ['gain', {key: 0, destination: 'detune'}, {gain: 0.5}, 'input'],
  2: ['oscillator', 1, {frequency: 110}],
};
```

```javascript
const oldAPI = {
  0: {
    node: 'oscillator',
    output: 'output',
  },
  1: {
    input: 'input',
    node: 'gain',
    output: {key: 0, destination: 'detune'},
    params: {
      gain: 0.5,
    },
  },
  2: {
    node: 'oscillator',
    output: 1,
    params: {
      frequency: 110,
    },
  },
}
```

___

## 0.11.x

- Added support for:
  - ChannelMergerNode
  - ChannelSplitterNode

___

## 0.10.x

- Added support for:
  - MediaStreamAudioDestinationNode
  - MediaStreamAudioSourceNode

___

## 0.9.x

- Added support for:
  - ConvolverNode
  - DynamicsCompressorNode
  - WaveShaperNode

___

## 0.8.x

- Added getAudioNodeById method to virtualAudioGraph

- Added support for:
  - AnalyserNode
  - AudioBufferSourceNode

___

## 0.7.x

Prior to version 0.7.x virtual-audio-graph parameters were an array of objects with id properties representing nodes like this:

```javascript
[
  {
    id: 0,
    node: 'oscillator',
    output: 'output',
    params: {
      frequency: 220,
    },
  },
  {
    id: 1,
    node: 'oscillator',
    output: {id: 0, destination: 'detune'},
    params: {
      frequency: 110,
    },
  },
]
```

Now the parameters are a single object with keys which represent the node ids:

```javascript
{
  0: {
    node: 'oscillator',
    output: 'output',
    params: {
      frequency: 220,
    },
  },
  1: {
    node: 'oscillator',
    output: {key: 0, destination: 'detune'}, // NB. "key" property used to be "id"
    params: {
      frequency: 110,
    },
  },
}
```

The new notation automatically ensures the id of each node exists and is unique. It is also more concise and allows for greater performance.
