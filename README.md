# virtual-audio-graph

**In Development - API very likely to change**

## Overview

Library for manipulating the Web Audio API.

Create and update an Audio Graph by generating a virtual audio graph with a JSON-compatible array of objects representing the nodes to be constructed and their relationships to each other.

Should reduce pain of creating and updating the Audio Graph as this is abstracted away in a similar fashion to the way in which react and virtual-dom abstract away DOM manipulation pain.

## Example

### Create new virtualAudioGraph
```javascript

const audioContext = new AudioContext();
const virtualAudioGraph = new VirtualAudioGraph({
  audioContext: audioContext,
  destination: audioContext.destination,
});

```

### Create new audio graph

```javascript

var updateParams = [
  {
    connections: [0],
    id: 1,
    name: 'gain',
    params: {
      gain: 0.2,
    },
  },
  {
    connections: [1],
    id: 2,
    name: 'oscillator',
    params: {
      type: 'square',
      frequency: 440,
    },
  },
  {
    connections: [1],
    id: 3,
    name: 'oscillator',
    params: {
      type: 'sawtooth',
      frequency: 220,
      detune: 4,
    },
  },
];

virtualAudioGraph.update(updateParams);

```

## API

### Instantiating a new virtual-audio-graph

The constructor takes an object with two properties:
- `audioContext`: an instance of AudioContext, if not provided then a new AudioContext will be created, this is best avoided as the number which can be created is limited
- `destination`: a valid AudioNode destination e.g. audioContext.destination or audioContext.createGain(), if not provided then the audioContext destination will be used

### virtualAudioGraph.update

Here we pass in an array of virtual audio node paramaters. Properties follow:

- `name`: name of the node we are creating.

- `id`: each virtual node needs an id, this is for describing the relationships between nodes. recommended that ids be integers starting at 1 as 0 is reserved and represents the final destination as specified when VirtualAudioGraph was instantiated.

- `connections`: an array of integers (or a single integer) representing ids of the nodes this node is connecting to. 0 is reserved for the final destination specified when VirtualAudioGraph was instantiated.

- `params`: is an object representing any properties which we would like to alter on the audio node created.

### Virtual audio nodes

Here is a list of virutal audio names and the params you can provide them with. For more info check out (https://developer.mozilla.org/en-US/docs/Web/API/AudioNode)

```javascript
{
  name: 'oscillator',
  params: {
    type,
    frequency,
    detune,
  }
}
```

```javascript
{
  name: 'gain',
  params: {
    gain,
  }
}
```

```javascript
{
  name: 'biquadFilter',
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
  name: 'delay',
  params: {
    delayTime,
    maxDelayTime, //special parameter which must be set when node is first created, it cannot be altered thereafter
  },
}
```

```javascript
{
  name: 'stereoPanner',
  params: {
    pan,
  },
}
```
