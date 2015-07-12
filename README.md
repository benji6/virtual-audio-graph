# virtual-audio-graph

[![Build Status](https://api.travis-ci.org/benji6/virtual-audio-graph.svg?branch=master)](https://travis-ci.org/benji6/virtual-audio-graph)
[![npm version](https://badge.fury.io/js/virtual-audio-graph.svg)](http://badge.fury.io/js/virtual-audio-graph)
[![dependencies](https://david-dm.org/benji6/virtual-audio-graph.svg)](https://david-dm.org/benji6/virtual-audio-graph.svg)

## Status

Project is in early stages of development and API may change.

## Overview

Library for manipulating the Web Audio API.

Abstracts away the pain of directly manipulating the audio graph in a similar fashion to the way in which react and virtual-dom do for the DOM.

virtual-audio-graph aims to manage the state of the audio graph so this does not have to be done manually.

Simply pass a data structure representing the desired audio graph and virtual-audio-graph takes care of the rest.

## Installation

```bash
$ npm install --save virtual-audio-graph
```

## API

### Instantiating a new virtual-audio-graph

```javascript

const VirtualAudioGraph = require('virtual-audio-graph');

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

### Updating the Audio Graph

Create two oscillators, put them through a gain node and attach the gain node to the destination:

```javascript

const virtualNodeParams = [
  {
    id: 0,
    node: 'gain',
    output: 'output',
    params: {
      gain: 0.2,
    },
  },
  {
    id: 1,
    node: 'oscillator',
    output: 0,
    params: {
      type: 'square',
      frequency: 440,
    },
  },
  {
    id: 2,
    node: 'oscillator',
    output: 0,
    params: {
      type: 'sawtooth',
      frequency: 220,
      detune: 4,
    },
  },
];

virtualAudioGraph.update(virtualNodeParams);

```

`virtualAudioGraph.update` takes an array of virtual audio node parameters, then internally it creates a virtual audio graph which it compares to any previous updates and updates the actual audio graph accordingly.

In the example above we create a single oscillatorNode, which is connected to a single gainNode which in turn is connected to the virtualAudioGraph output. Below is an explanation of properties for virtualAudioNode parameter objects:

- `node` - name of the node we are creating.

- `id` - each virtual node needs an id for efficient diffing and allowing the relationships between nodes to be described. ```'output'``` is a reserved id which represents the ```virtualAudioGraph``` destination property.

- `output` - an id or array of ids for nodes this node connects to. ```'output'``` connects this node to the virtualAudioGraph output. You can also connect a node to a valid AudioParam using an object with an `id` property corresponding to the destination virtual-node id and a `destination` property with a string value specifying the AudioParam destination. See below:

```javascript

virtualAudioGraph.update([
  {
    id: 0,
    node: 'oscillator',
    output: 'output', // reserved id for virtual-audio-graph destination
  },
  {
    id: 1,
    node: 'gain',
    // below we are connecting to the frequency AudioParam of the oscillator above
    output: {id: 0, destination: 'frequency'},
    params: {
      gain: 10,
    },
  },
  {
    id: 2,
    node: 'oscillator',
    output: 1, // connect to node id 1 (gain node above)
    params: {
      type: 'triangle',
      frequency: 1,
    },
  },
]);

```

- `params` - is an object representing any properties to alter on the audio node created.

Calling `virtualAudioGraph.update` subsequently will diff the new state against the old state and make appropriate changes to the audio graph.

### Defining Custom Virtual Nodes

The virtual audio graph is composed of standard virtual audio nodes (see below) and custom virtual audio nodes which in their simplest form are built out of standard audio nodes.

`virtualAudioGraph.defineNode` allows you to define your own custom nodes, it takes two arguments, the first is a function which returns an array of virtual audio node parameters and the second is the name of the custom node. The function can optionally take an object as an argument with properties corresponding to varaible parameters for the node (see below)

When defining virtual audio node parameters include a property `input` and value `'input'` which specifies the input points of the custom virtual node:

```javascript

const pingPongDelayParamsFactory = (params = {}) => {
  let {decay, delayTime, maxDelayTime} = params;
  decay = decay !== undefined ? decay : 1 / 3;
  delayTime = delayTime !== undefined ? delayTime : 1 / 3;
  maxDelayTime = maxDelayTime !== undefined ? maxDelayTime : 1 / 3;

  return [
    {
      id: 0,
      node: 'stereoPanner',
      output: 'output',
      params: {
        pan: -1,
      },
    },
    {
      id: 1,
      node: 'stereoPanner',
      output: 'output',
      params: {
        pan: 1,
      },
    },
    {
      id: 2,
      node: 'delay',
      output: [1, 5],
      params: {
        maxDelayTime,
        delayTime,
      },
    },
    {
      id: 3,
      node: 'gain',
      output: 2,
      params: {
        gain: decay,
      },
    },
    {
      id: 4,
      node: 'delay',
      output: [0, 3],
      params: {
        maxDelayTime,
        delayTime,
      },
    },
    {
      id: 5,
      input: 'input',
      node: 'gain',
      output: 4,
      params: {
        gain: decay,
      },
    },
  ];
};

//define a custom node like this:
virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

//and now this instance of virtual-audio-graph will recognize it as a valid node:
virtualAudioGraph.update([
  {
    id: 0,
    node: 'pingPongDelay',
    output: 'output',
    //with custom parameters as defined in above factory
    params: {
      decay: 1 / 4,
      delayTime: 1 / 3,
      maxDelayTime: 1,
    },
  },
  {
    id: 1,
    node: 'gain',
    output: [0, 'output'],
    params: {
      gain: 1 / 4,
    },
  },
  {
    id: 2,
    node: 'oscillator',
    output: 1,
    params: {
      frequency: 440,
      type: 'square',
    },
  },
]);

```

### Standard Virtual Audio Nodes

Here is a list of standard virutal audio nodes implemented in virtual-audio-graph and the params you can provide them with. You can build custom virtual audio nodes out of these as above. For more info check out https://developer.mozilla.org/en-US/docs/Web/API/AudioNode.

```javascript
{
  node: 'oscillator',
  params: {
    type,
    frequency,
    detune,
  }
}
```

```javascript
{
  node: 'gain',
  params: {
    gain,
  }
}
```

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

```javascript
{
  node: 'delay',
  params: {
    delayTime,
    maxDelayTime, //special parameter which must be set when node is first created, it cannot be altered thereafter
  },
}
```

```javascript
{
  node: 'stereoPanner',
  params: {
    pan,
  },
}
```

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
