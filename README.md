# virtual-audio-graph

[![npm version](https://badge.fury.io/js/virtual-audio-graph.svg)](http://badge.fury.io/js/virtual-audio-graph)
[![Build Status](https://api.travis-ci.org/benji6/virtual-audio-graph.svg?branch=master)](https://travis-ci.org/benji6/virtual-audio-graph)
[![dependencies](https://david-dm.org/benji6/virtual-audio-graph.svg)](https://david-dm.org/benji6/virtual-audio-graph.svg)
[![Code Climate](https://codeclimate.com/github/benji6/virtual-audio-graph/badges/gpa.svg)](https://codeclimate.com/github/benji6/virtual-audio-graph)

## Overview

Library for declaratively manipulating the Web Audio API.

virtual-audio-graph manages the state of the audio graph so this does not have to be done manually. Simply declare what you would like the audio graph to look like and virtual-audio-graph takes care of the rest.

## Status

Project is in development and API is not yet stable. See [Changelog](/CHANGELOG.md) if upgrading from a previous version.

## Installation

```bash
npm i -S virtual-audio-graph
```

## API

### Instantiating a new virtual-audio-graph

```javascript

import VirtualAudioGraph from 'virtual-audio-graph';

const audioContext = new AudioContext();

const virtualAudioGraph = new VirtualAudioGraph({
  audioContext: audioContext,
  output: audioContext.destination,
});

```

The `VirtualAudioGraph` constructor takes an object with two optional properties:

- `audioContext` - an instance of AudioContext. If not provided then virtual-audio-graph will create its own instance of AudioContext. Note that the number of instances of AudioContext is limited so if you have one it may be best to provide it here.

- `output` - a valid AudioNode destination (e.g. `audioContext.destination` or `audioContext.createGain()`). If not provided then the audioContext destination will be used.

### Public Interface
- `virtualAudioGraph.currentTime` returns the currentTime of the audioContext instance which was either provided during construction or created internally.

- `virtual-audio-graph.update` method described below.

- `virtual-audio-graph.defineNode` method described below.

- `virtual-audio-graph.getAudioNodeById` takes an id and returns the audioNode relating to that id or undefined if no such audioNode exists. This is useful if the node has methods (e.g. `AnalyserNode.getFloatFrequencyData` & `OscillatorNode.setPeriodicWave`). If you adjust any properties on nodes retrieved using this method virtual-audio-graph will not know so be careful!

### Updating the Audio Graph

Create two oscillators, schedule their start and stop times, put them through a gain node and attach the gain node to the destination:

```javascript

const {currentTime} = virtualAudioGraph;

const virtualNodeParams = {
  0: {
    node: 'gain',
    output: 'output',
    params: {
      gain: 0.2,
    },
  },
  1: {
    node: 'oscillator',
    output: 0,
    params: {
      type: 'square',
      frequency: 440,
      startTime: currentTime + 1,
      stopTime: currentTime + 2,
    },
  },
  2: {
    node: 'oscillator',
    output: 0,
    params: {
      type: 'sawtooth',
      frequency: 660,
      detune: 4,
      startTime: currentTime + 1.5,
      stopTime: currentTime + 2.5,
    },
  },
};

virtualAudioGraph.update(virtualNodeParams);

```

`virtualAudioGraph.update` takes an array of virtual audio node parameters, then internally it creates a virtual audio graph which it compares to any previous updates and updates the actual audio graph accordingly.

In the example above we create a single oscillatorNode, which is connected to a single gainNode which in turn is connected to the virtualAudioGraph output. Below is an explanation of properties for virtualAudioNode parameter objects:

- `node` - name of the node we are creating.

- `output` - an key or array of keys for nodes this node connects to. ```'output'``` connects this node to the virtualAudioGraph output. You can also connect a node to a valid AudioParam using an object with a `key` property corresponding to the destination virtual-node key and a `destination` property with a string value specifying the AudioParam destination. See below:

```javascript

virtualAudioGraph.update({
  0: {
    node: 'oscillator',
    output: 'output', // reserved value for virtual-audio-graph destination
  },
  1: {
    node: 'gain',
    // below we are connecting to the frequency AudioParam of the oscillator above
    output: {key: 0, destination: 'frequency'},
    params: {
      gain: 10,
    },
  },
  2: {
    node: 'oscillator',
    output: 1, // connect to node key 1 (gain node above)
    params: {
      type: 'triangle',
      frequency: 1,
    },
  },
});

```

- `params` - is an object representing any properties to alter on the audio node created.

Calling `virtualAudioGraph.update` subsequently will diff the new state against the old state and make appropriate changes to the audio graph.

### Defining Custom Virtual Nodes

The virtual audio graph is composed of standard virtual audio nodes (see below) and custom virtual audio nodes which in their simplest form are built out of standard audio nodes.

`virtualAudioGraph.defineNode` allows you to define your own custom nodes, it takes two arguments, the first is a function which returns an array of virtual audio node parameters and the second is the name of the custom node. The function can optionally take an object as an argument with properties corresponding to varaible parameters for the node (see below)

When defining virtual audio node parameters include a property `input` and value `'input'` which specifies the input points of the custom virtual node:

```javascript

const pingPongDelayParamsFactory = ({
  decay = 1 / 3,
  delayTime = 1 / 3,
  maxDelayTime = 1 / 3,
} = {}) => ({
  zero: {
    node: 'stereoPanner',
    output: 'output',
    params: {pan: -1},
  },
  1: {
    node: 'stereoPanner',
    output: 'output',
    params: {pan: 1},
  },
  2: {
    node: 'delay',
    output: [1, 'five'],
    params: {
      maxDelayTime,
      delayTime,
    },
  },
  3: {
    node: 'gain',
    output: 2,
    params: {gain: decay},
  },
  4: {
    node: 'delay',
    output: ['zero', 3],
    params: {
      maxDelayTime,
      delayTime,
    },
  },
  five: {
    input: 'input',
    node: 'gain',
    output: 4,
    params: {gain: decay},
  },
});

//define a custom node like this:
virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

//and now this instance of virtual-audio-graph will recognize it as a valid node:
virtualAudioGraph.update({
  0: {
    node: 'pingPongDelay',
    output: 'output',
    //with custom parameters as defined in above factory
    params: {
      decay: 1 / 4,
      delayTime: 1 / 3,
      maxDelayTime: 1,
    },
  },
  1: {
    node: 'gain',
    output: [0, 'output'],
    params: {
      gain: 1 / 4,
    },
  },
  2: {
    node: 'oscillator',
    output: 1,
    params: {
      frequency: 440,
      type: 'square',
    },
  },
});

```

### Standard Virtual Audio Nodes

Here is a list of standard virtual audio nodes implemented in virtual-audio-graph and the params you can provide them with. You can build custom virtual audio nodes out of these as above.

#### [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode)

```javascript
{
  node: 'analyser',
  params: {
    fftSize,
    minDecibels,
    maxDecibels,
    smoothingTimeConstant,
  },
  output: 'output',
}
```
___

#### [AudioBufferSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode)

```javascript
const {audioContext, audioContext: {sampleRate}} = virtualAudioGraph;
const buffer = audioContext.createBuffer(2, sampleRate * 2, sampleRate);
{
  node: 'bufferSource',
  params: {
    buffer,
    loop,
    loopEnd,
    loopStart,
    onended,
    playbackRate,
    startTime, // time in seconds since virtualAudioGraph.currentTime was 0, if not provided then node starts immediately
    stopTime, // if not provided then stop is not called on node until it is disconnected
  },
  output: 'output',
}
```
___

#### [BiquadFilterNode](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode)

```javascript
{
  node: 'biquadFilter',
  params: {
    type,
    frequency,
    detune,
    Q,
  },
}
```
___
#### [ConvolverNode](https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode)

```javascript
{
  node: 'convolver',
  params: {
    buffer,
    normalize,
  },
}
```
___

#### [DelayNode](https://developer.mozilla.org/en-US/docs/Web/API/DelayNode)

```javascript
{
  node: 'delay',
  params: {
    delayTime,
    maxDelayTime, //special parameter which must be set when node is first created, it cannot be altered thereafter
  },
}
```
___

#### [DynamicsCompressorNode](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode)

```javascript
{
  node: 'dynamicsCompressor',
  params: {
    attack,
    knee,
    ratio,
    reduction,
    release,
    threshold,
  },
}
```
___

#### [GainNode](https://developer.mozilla.org/en-US/docs/Web/API/GainNode)

```javascript
{
  node: 'gain',
  params: {
    gain,
  }
}
```
___
#### [MediaStreamAudioSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode)

```javascript
{
  node: 'mediaElementSource',
  params: {
    // both these params can only be set once and only one should be set:
    mediaElement, // EITHER set this if constructing from an HTMLMediaElement
    mediaStream, // OR set this if constructing from a MediaStream
  }
}
```
___

#### [OscillatorNode](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode)

```javascript
{
  node: 'oscillator',
  params: {
    type,
    frequency,
    detune,
    startTime, // time in seconds since virtualAudioGraph.currentTime was 0, if not provided then node starts immediately
    stopTime, // if not provided then stop is not called on node until it is disconnected
  }
}
```
___

#### [PannerNode](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode)

```javascript
{
  node: 'panner',
  params: {
    coneInnerAngle,
    coneOuterAngle,
    coneOuterGain,
    distanceModel,
    orientation, // applies an array of arguments with the corresponding AudioNode setter
    panningModel,
    position, // applies an array of arguments with the corresponding AudioNode setter
    maxDistance,
    refDistance,
    rolloffFactor,
  },
  output: 'output',
}
```
___

#### [StereoPannerNode](https://developer.mozilla.org/en-US/docs/Web/API/StereoPannerNode)

```javascript
{
  node: 'stereoPanner',
  params: {
    pan,
  },
}
```
___

#### [WaveShaperNode](https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode)

```javascript
{
  node: 'waveShaper',
  params: {
    curve,
    oversample,
  },
}
```
