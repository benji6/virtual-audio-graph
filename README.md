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

virtual-audio-graph is by default distributed as ES5, however, it also has a `jsnext:main` property in its package.json ([more info](https://github.com/rollup/rollup/wiki/jsnext:main)) so it may also be consumed as an ES2015 module by tools like [Rollup](https://github.com/rollup/rollup).

## Upgrading

See [changelog](/CHANGELOG.md).

## API

### Creating a new virtual-audio-graph

```javascript

import createVirtualAudioGraph from 'virtual-audio-graph'

const audioContext = new AudioContext()

const virtualAudioGraph = createVirtualAudioGraph({
  audioContext,
  output: audioContext.destination,
})

```

The `createVirtualAudioGraph` factory takes an object with two optional properties:

- `audioContext` - an instance of AudioContext. If not provided then virtual-audio-graph will create its own instance of AudioContext. Note that the number of instances of AudioContext is limited so if you have one it may be best to provide it here.

- `output` - a valid AudioNode destination (e.g. `audioContext.destination` or a gain node). If not provided then the audioContext destination will be used.

### Public Interface
- `virtualAudioGraph.currentTime` - getter implemented in the same manner as the currentTime getter on an `AudioContext` instance - gets the currentTime of `virtualAudioGraph`'s audioContext instance.

- `virtualAudioGraph.update` - method described [below](#updating-the-audio-graph).

- `virtualAudioGraph.getAudioNodeById` method which takes an id and returns the audioNode relating to that id or undefined if no such audioNode exists. This is useful if the node has methods (e.g. `AnalyserNode.getFloatFrequencyData` & `OscillatorNode.setPeriodicWave`). If you adjust any properties on nodes retrieved using this method virtual-audio-graph will not know so be careful!

### Updating the Audio Graph

`virtualAudioGraph.update` takes an object representing the desired audio graph, then internally compares this against any previous updates and efficiently modifies the audio-graph to exactly what was specified.

Here we create two oscillators, schedule their start and stop times, put them through a gain node and attach the gain node to the destination:

```javascript

const {currentTime} = virtualAudioGraph

const graph = {
  0: ['gain', 'output', {gain: 0.2}],
  1: ['oscillator', 0, {
    type: 'square',
    frequency: 440,
    startTime: currentTime + 1,
    stopTime: currentTime + 2
  }],
  2: ['oscillator', 0, {
    type: 'sawtooth',
    frequency: 660,
    detune: 4,
    startTime: currentTime + 1.5,
    stopTime: currentTime + 2.5
  }],
}

virtualAudioGraph.update(graph)

```

OK, so what's going on here?

`update` takes a graph object. Each key in the graph object represents the id of a node and each node is represented by an array with between 2 to 4 elements in it.

In the above example the first element in the array is the name of the AudioNode to be instantiated, the second element is the id of the node that it should connect to (with the special string `'output'` representing the `virtualAudioGraph` output specified at construction) and if you are already familiar with the Web Audio API the third element should be recognizable as an object specifying the node's parameters.

The above information should be enough to get started creating very simple audio graphs like the one above, but if you are still with me here is a more detailed overview about how this node array works broken down by element:

- `0` - `String | Function` - required - as a string this is the name of the node we are creating (e.g. `'oscillator'` or `'gain'`). See the section on [Custom Nodes](#custom-nodes) for what happens when a function is provided instead.

- `1` - `String | Number | Object | [String | Number | Object]` - required - value specifying where this node should be connected. This could be:
 - the reserved string `'output'` which connects to virtualAudioGraph's destination.
 - a string or number corresponding to a key for another node.
 - an object with a `key` property corresponding to the destination node key and a `destination` property with a string value specifying the AudioParam destination for connecting to a valid AudioParam.
 - an array comprised by one or more of the above for specifying multiple outputs

 Here are some examples:

  ```javascript
  virtualAudioGraph.update({
    // output is a reserved value for virtual-audio-graph destination
    0: ['oscillator', 'output'],
    // connecting to the frequency AudioParam of the oscillator above
    1: ['gain', {key: 0, destination: 'frequency'}, {gain: 10}],
    // connect to node key 1 (gain node above) and output
    2: ['oscillator', [1, 'output'], {type: 'triangle', frequency: 1}],
  })
  ```

- `2` - `Object | null | undefined` - optional object representing any properties to set/alter on the audio node created (details on properties available to audioNodes [here](#standard-nodes)). If the property you are setting is an AudioParam you may either assign it a value, or you can use AudioParam methods to specify behaviour of the parameter over time. To do so specify an array where the first element is the method name and the remaining elements are the arguments for that method. If scheduling multiple values specify an array of these arrays. [See here for more info on AudioParam methods](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam). Here are examples of all supported methods:
  - specify an ordinary value
  ```javascript
  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: 0.5}],
  })
  ```
  - specify setValueAtTime
  ```javascript
  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: ['setValueAtTime', 0.5, 1]}],
  })
  ```
  - specify setValueAtTime multiple times
  ```javascript
  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: [
      ['setValueAtTime', 0, 0],
      ['setValueAtTime', 1, 1],
      ['setValueAtTime', 0.5, 2],
    ]}],
  })
  ```
  - linearRampToValueAtTime
  ```javascript
  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: [
      ['setValueAtTime', 0, 0],
      ['linearRampToValueAtTime', 1, 1],
    ]}],
  })
  ```
  - exponentialRampToValueAtTime
  ```javascript
  virtualAudioGraph.update({
    0: ['oscillator', 'output', {frequency: [
      ['setValueAtTime', 440, 0],
      ['exponentialRampToValueAtTime', 880, 1],
    ]}],
  })
  ```
  - setTargetAtTime
  ```javascript
  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: [
      ['setValueAtTime', 0, 0],
      ['setTargetAtTime', 1, 1, 0.5],
    ]}],
  })
  ```
  - setValueCurveAtTime
  ```javascript
  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: [
      ['setValueAtTime', 0, 0],
      ['setValueCurveAtTime', Float32Array.of(0.5, 0.75, 0.25, 1), 1, 1],
    ]}],
  })
  ```

- `3` - `String | undefined` - optionally specify this element as an input of a custom node by assigning `'input'` at this index. Only valid when defining nodes (see [below](#custom-nodes)).

### Custom Nodes

The virtual audio graph is composed of standard nodes (see [below](#standard-nodes)) and custom nodes which may be built out of standard nodes and other custom nodes.

Specify the node input destination using the string `'input'` as the 4th element in the node array as below:

```javascript

const pingPongDelay = ({
  decay = 1 / 3,
  delayTime = 1 / 3,
  maxDelayTime = 1 / 3,
} = {}) => ({
  zero: ['stereoPanner', 'output', {pan: -1}],
  1: ['stereoPanner', 'output', {pan: 1}],
  2: ['delay', [1, 'five'], {delayTime, maxDelayTime}],
  3: ['gain', 2, {gain: decay}],
  4: ['delay', ['zero', 3], {delayTime, maxDelayTime}],
  five: ['gain', 4, {gain: decay}, 'input'] // note this is the destination for nodes which connect to pingPongDelay
})

// and now virtual-audio-graph will recognize it as a valid node:
virtualAudioGraph.update({
  0: [pingPongDelay,
      'output',
      // the below parameters are passed into the pingPongDelay function declared above
      {decay: 1 / 4, delayTime: 1 / 3, maxDelayTime: 1}],
  1: ['gain', [0, 'output'], {gain: 1 / 4}],
  2: ['oscillator', 1, {frequency: 440, type: 'square'}],
})

```

If an `'input'` node has no parameters specify `null` like this:

```javascript
  five: ['gain', 4, null, 'input']
```

### Standard Nodes

Here is a list of standard nodes implemented in virtual-audio-graph and the params you can provide them with. You can build custom nodes out of these as above.

#### [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode)

```javascript
['analyser', output, {fftSize,
                      minDecibels,
                      maxDecibels,
                      smoothingTimeConstant}]
```
___

#### [AudioBufferSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode)

```javascript
const {audioContext, audioContext: {sampleRate}} = virtualAudioGraph
const buffer = audioContext.createBuffer(2, sampleRate * 2, sampleRate)
['bufferSource', output, {
  buffer,
  loop,
  loopEnd,
  loopStart,
  // The offset parameter, which defaults to 0
  // and defines where the playback will start
  offsetTime,
  onended,
  playbackRate,
  // time in seconds since virtualAudioGraph.currentTime
  // was 0, if not provided then node starts immediately
  startTime,
  // if not provided then stop is not called on node
  // until it is disconnected
  stopTime
}]
```
___

#### [BiquadFilterNode](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode)

```javascript
['biquadFilter', output, {type, frequency, detune, Q}]
```
___
#### [ChannelMergerNode](https://developer.mozilla.org/en-US/docs/Web/API/ChannelMergerNode)

```javascript
['channelMerger', output, {numberOfOutputs}]
```
___
#### [ChannelSplitterNode](https://developer.mozilla.org/en-US/docs/Web/API/ChannelSplitterNode)

NB ChannelSplitter has it's own syntax for the output parameter. Because the channel is split it means each node can have multiple outputs. Each output is indexed and the outputs property should be an array of these indices. Then the inputs property should be an array of indices corresponding to the inputs of the destination node. Check out the spec and the link above for more info.

```javascript
['channelSplitter', {key, outputs, inputs}, {numberOfOutputs}]
```
___
#### [ConvolverNode](https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode)

```javascript
['convolver', output, {buffer, normalize}]
```
___

#### [DelayNode](https://developer.mozilla.org/en-US/docs/Web/API/DelayNode)
NB maxDelayTime must be set when node is first created but cannot be updated. A new node will have to be inserted if a different maxDelayTime is required.

```javascript
['delay', output, {delayTime, maxDelayTime}]
```
___

#### [DynamicsCompressorNode](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode)

```javascript
['dynamicsCompressor', output, {attack,
                                knee,
                                ratio,
                                reduction,
                                release,
                                threshold}]
```
___

#### [GainNode](https://developer.mozilla.org/en-US/docs/Web/API/GainNode)

```javascript
['gain', output, {gain}]
```
___
#### [MediaStreamAudioDestinationNode](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioDestinationNode)

This node has no output as it is a destination. It also takes no parameters. Use virtualAudioGraph.getAudioNodeById method to access the node's stream property

```javascript
['mediaStreamDestination']
```
___
#### [MediaStreamAudioSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode)
NB Both params can only be set once and only one should be set
```javascript
['mediaElementSource', output, {
  mediaElement, // EITHER set this if constructing from an HTMLMediaElement
  mediaStream, // OR set this if constructing from a MediaStream
}]
```
___

#### [OscillatorNode](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode)

```javascript
['oscillator', output, {
  type,
  frequency,
  detune,
  // time in seconds since virtualAudioGraph.currentTime
  // was 0, if not provided then node starts immediately
  startTime,
  // if not provided then stop is not called on node until it is disconnected
  stopTime,
}]
```
___

#### [PannerNode](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode)

```javascript
['panner', output, {
  coneInnerAngle,
  coneOuterAngle,
  coneOuterGain,
  distanceModel,
  // applies an array of arguments with the corresponding AudioNode setter:
  orientation,
  panningModel,
  // applies an array of arguments with the corresponding AudioNode setter:
  position,
  maxDistance,
  refDistance,
  rolloffFactor,
}]
```
___

#### [StereoPannerNode](https://developer.mozilla.org/en-US/docs/Web/API/StereoPannerNode)

```javascript
['stereoPanner', output, {pan}]
```
___

#### [WaveShaperNode](https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode)

```javascript
['waveShaper', output, {curve, oversample}]
```
