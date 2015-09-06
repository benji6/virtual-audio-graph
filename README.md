# virtual-audio-graph

[![npm version](https://badge.fury.io/js/virtual-audio-graph.svg)](http://badge.fury.io/js/virtual-audio-graph)
[![Build Status](https://api.travis-ci.org/benji6/virtual-audio-graph.svg?branch=master)](https://travis-ci.org/benji6/virtual-audio-graph)
[![dependencies](https://david-dm.org/benji6/virtual-audio-graph.svg)](https://david-dm.org/benji6/virtual-audio-graph.svg)
[![Code Climate](https://codeclimate.com/github/benji6/virtual-audio-graph/badges/gpa.svg)](https://codeclimate.com/github/benji6/virtual-audio-graph)

## Overview

Library for declaratively manipulating the Web Audio API.

virtual-audio-graph manages the state of the audio graph so this does not have to be done manually. Simply declare what you would like the audio graph to look like and virtual-audio-graph takes care of the rest.

## Installation

```bash
npm i -S virtual-audio-graph
```

## Upgrading

See [changelog](/CHANGELOG.md).

## API

### Instantiating a new virtual-audio-graph

```javascript

import VirtualAudioGraph from 'virtual-audio-graph';

const audioContext = new AudioContext();

const virtualAudioGraph = new VirtualAudioGraph({
  audioContext,
  output: audioContext.destination,
});

```

The `VirtualAudioGraph` constructor takes an object with two optional properties:

- `audioContext` - an instance of AudioContext. If not provided then virtual-audio-graph will create its own instance of AudioContext. Note that the number of instances of AudioContext is limited so if you have one it may be best to provide it here.

- `output` - a valid AudioNode destination (e.g. `audioContext.destination` or `audioContext.createGain()`). If not provided then the audioContext destination will be used.

### Public Interface
- `virtualAudioGraph.currentTime` returns the currentTime of virtualAudioGraph's audioContext instance.

- `virtual-audio-graph.update` method described [below](#updating-the-audio-graph).

- `virtual-audio-graph.defineNode` method described [below](#defining-custom-nodes).

- `virtual-audio-graph.getAudioNodeById` takes an id and returns the audioNode relating to that id or undefined if no such audioNode exists. This is useful if the node has methods (e.g. `AnalyserNode.getFloatFrequencyData` & `OscillatorNode.setPeriodicWave`). If you adjust any properties on nodes retrieved using this method virtual-audio-graph will not know so be careful!

### Updating the Audio Graph

Create two oscillators, schedule their start and stop times, put them through a gain node and attach the gain node to the destination:

```javascript

const {currentTime} = virtualAudioGraph;

const virtualNodeParams = {
  0: ['gain', 'output', params: {gain: 0.2}],
  1: ['oscillator', 0, {type: 'square',
                        frequency: 440,
                        startTime: currentTime + 1,
                        stopTime: currentTime + 2}],
  2: ['oscillator', 0, {type: 'sawtooth',
                        frequency: 660,
                        detune: 4,
                        startTime: currentTime + 1.5,
                        stopTime: currentTime + 2.5}],
};

virtualAudioGraph.update(virtualNodeParams);

```

`virtualAudioGraph.update` takes an object representing the desired audio graph, then internally it creates a virtual audio graph which it compares to any previous updates and updates the actual audio graph accordingly. Each key in this object is used as a unique reference to the corresponding virtualAudioNode and each value is an array which contains parameters for the virtualAudioNode. For each index these keys are as follows:

- `0` - name of the node we are creating.

- `1` - Here we specify where this node is outputting to. In it's simplest form this could be a key for another audioNode or the reserved word `output` which connects to virtualAudioGraph's destination. You can also connect a node to a valid AudioParam using an object with a `key` property corresponding to the destination virtual-node key and a `destination` property with a string value specifying the AudioParam destination. Finally the output property could be an array of any of these values if the node has multiple outputs. Here are some examples:

```javascript

virtualAudioGraph.update({
  // output is a reserved value for virtual-audio-graph destination
  0: ['oscillator', 'output'],
  // connecting to the frequency AudioParam of the oscillator above
  1: ['gain', {key: 0, destination: 'frequency'}, {gain: 10}],
  // connect to node key 1 (gain node above) and output
  2: ['oscillator', [1, 'output'], {type: 'triangle', frequency: 1}],
});

```

- `2` - an object representing any properties to set/alter on the audio node created (details on properties available to standard nodes [here](#standard-virtual-audio-nodes)).

- `3` - specify whether this node is an an input of a custom node. Only valid when defining nodes (see [below](#defining-custom-nodes).

Calling `virtualAudioGraph.update` subsequently will diff the new state against the old state and make appropriate changes to the audio graph.

### Defining Custom Nodes

The virtual audio graph is composed of standard virtual audio nodes (see [below](#standard-virtual-audio-nodes)) and custom virtual audio nodes which in their simplest form are built out of standard audio nodes.

`virtualAudioGraph.defineNode` allows you to define your own custom nodes, it takes two arguments, the first is a function which returns an object of virtual audio node parameters and the second is the name of the custom node. The function can optionally take an object as an argument with properties corresponding to variable parameters for the node.

When defining virtual audio node parameters include a property `input` and value `'input'` which specifies the input points of the custom virtual node:

```javascript

const pingPongDelayParamsFactory = ({
  decay = 1 / 3,
  delayTime = 1 / 3,
  maxDelayTime = 1 / 3,
} = {}) => ({
  zero: ['stereoPanner', 'output', {pan: -1}],
  1: ['stereoPanner', 'output', {pan: 1}],
  2: ['delay', [1, 'five'], {maxDelayTime}],
  3: ['gain', 2, {gain: decay}],
  4: ['delay', ['zero', 3], {maxDelayTime}],
  five: ['gain', 4, {gain: decay}, 'input']
});

//define a custom node like this:
virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

//and now this instance of virtual-audio-graph will recognize it as a valid node:
virtualAudioGraph.update({
  0: ['pingPongDelay',
      'output',
      // with custom parameters as defined in above factory
      {decay: 1 / 4, delayTime: 1 / 3, maxDelayTime: 1}],
  1: ['gain', [0, 'output'], {gain: 1 / 4}],
  2: ['oscillator', 1, {frequency: 440, type: 'square'}],
});

```

If an `'input'` node has no parameters specify `null` like this:

```javascript
  five: ['gain', 4, null, 'input']
```

### Standard Virtual Audio Nodes

Here is a list of standard virtual audio nodes implemented in virtual-audio-graph and the params you can provide them with. You can build custom virtual audio nodes out of these as above.

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
const {audioContext, audioContext: {sampleRate}} = virtualAudioGraph;
const buffer = audioContext.createBuffer(2, sampleRate * 2, sampleRate);
['bufferSource', output, {buffer,
                          loop,
                          loopEnd,
                          loopStart,
                          onended,
                          playbackRate,
                          // time in seconds since virtualAudioGraph.currentTime
                          // was 0, if not provided then node starts immediately
                          startTime,
                          // if not provided then stop is not called on node
                          // until it is disconnected
                          stopTime}]
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
  startTime, // time in seconds since virtualAudioGraph.currentTime was 0, if not provided then node starts immediately
  stopTime, // if not provided then stop is not called on node until it is disconnected
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
  orientation, // applies an array of arguments with the corresponding AudioNode setter
  panningModel,
  position, // applies an array of arguments with the corresponding AudioNode setter
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
