# Release Notes

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
