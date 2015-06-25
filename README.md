# virtual-audio-graph

## Status
Project is in early stages of development and API is very likely to change.

## Overview

Library for manipulating the Web Audio API.

Abstracts away the pain of directly manipulating the Audio Graph in a similar fashion to the way in which react and virtual-dom abstract away DOM manipulation pain.

Create and update an Audio Graph by generating a virtual audio graph with a JSON-compatible array of objects representing the nodes to be constructed and their relationships to each other.

## API

### Instantiating a new virtual-audio-graph

```javascript

var VirtualAudioGraph = require('virtual-audio-graph');

var audioContext = new AudioContext();

var virtualAudioGraph = new VirtualAudioGraph({
  audioContext: audioContext,
  output: audioContext.destination,
});

```

The `VirtualAudioGraph` constructor takes an object with two optional properties:

- `audioContext` - an instance of AudioContext. If not provided then virtual-audio-graph will create its own instance of AudioContext. However, if you already have an instance of AudioContext it is best to pass it here here because the number of instances which can be created is limited.

- `output` - a valid AudioNode destination (e.g. `audioContext.destination` or `audioContext.createGain()`). If not provided then the audioContext destination will be used.

### Updating the Audio Graph

Create two oscillators, put them through a gain node and attach the gain node to the destination:

```javascript

var virtualNodeParams = [
  {
    output: 'output',
    id: 1,
    node: 'gain',
    params: {
      gain: 0.2,
    },
  },
  {
    output: 1,
    id: 2,
    node: 'oscillator',
    params: {
      type: 'square',
      frequency: 440,
    },
  },
  {
    output: 1,
    id: 3,
    node: 'oscillator',
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

- `output` - an id or array of ids for nodes this node connects to. ```'output'``` connects this node to the virtualAudioGraph output.

- `params` - is an object representing any properties which we would like to alter on the audio node created.

Calling `virtualAudioGraph.update` subsequently will diff the new state against the old state and make appropriate changes to the audio graph.

### Defining Custom Virtual Nodes

The virtual audio graph is composed of standard virtual audio nodes (see below) and custom virtual audio nodes which in their simplest form are built out of standard audio nodes.

`virtualAudioGraph.defineNode` allows you to define your own custom nodes, it takes two arguments the, first is an array of virtual audio node parameters and the second is the name of the custom node.

When defining virtual audio node parameters include a property `input` and value `'input'` which specifies the input points of the custom virtual node:

```javascript

const pingPongDelayParams = [
  {
    id: 0,
    node: 'stereoPanner',
    output: 'output',
    params: {
      pan: -1,
    }
  },
  {
    id: 1,
    node: 'stereoPanner',
    output: 'output',
    params: {
      pan: 1,
    }
  },
  {
    id: 2,
    node: 'delay',
    output: [1, 5],
    params: {
      maxDelayTime: 1 / 3,
      delayTime: 1 / 3
    },
  },
  {
    id: 3,
    node: 'gain',
    output: 2,
    params: {
      gain: 1 / 3,
    }
  },
  {
    id: 4,
    node: 'delay',
    output: [0, 3],
    params: {
      maxDelayTime: 1 / 3,
      delayTime: 1 / 3
    },
  },
  {
    id: 5,
    input: 'input',
    node: 'gain',
    output: 4,
    params: {
      gain: 1 / 3,
    }
  },
];

//define a custom node like this:
virtualAudioGraph.defineNode(pingPongDelayParams, 'pingPongDelay');

//and now this instance of virtual-audio-graph will recognize it as a valid node:
virtualAudioGraph.update([
  {
    id: 0,
    node: 'pingPongDelay',
    output: 'output',
  },
  {
    id: 1,
    node: 'gain',
    output: [0, 'output'],
    params: {
      gain: 1 / 4,
    }
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
