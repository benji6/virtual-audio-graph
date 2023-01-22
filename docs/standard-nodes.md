# Standard Virtual Audio Node Factories

Here is a list of the standard virtual audio node factories exported by virtual-audio-graph and the params you can provide them with ([the virtual-audio-graph guide is here](https://virtual-audio-graph.netlify.com/)).

## [analyser](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode)

```javascript
analyser(output, {
  fftSize,
  minDecibels,
  maxDecibels,
  smoothingTimeConstant,
}]
```
___

## [bufferSource](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode)

```javascript
const {audioContext, audioContext: {sampleRate}} = virtualAudioGraph
const buffer = audioContext.createBuffer(2, sampleRate * 2, sampleRate)
bufferSource(output, {
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
})
```
___

## [biquadFilter](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode)

```javascript
biquadFilter(output, {type, frequency, detune, Q})
```
___
## [channelMerger](https://developer.mozilla.org/en-US/docs/Web/API/ChannelMergerNode)

```javascript
channelMerger(output, {numberOfInputs})
```
___
## [channelSplitter](https://developer.mozilla.org/en-US/docs/Web/API/ChannelSplitterNode)

NB ChannelSplitter has it's own syntax for the output parameter. Because the channel is split it means each node can have multiple outputs. Each output is indexed and the outputs property should be an array of these indices. Then the inputs property should be an array of indices corresponding to the inputs of the destination node. Check out the spec and the link above for more info.

```javascript
channelSplitter({key, outputs, inputs}, {numberOfOutputs})
```
___
## [convolver](https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode)

```javascript
convolver(output, {buffer, normalize})
```
___

## [delay](https://developer.mozilla.org/en-US/docs/Web/API/DelayNode)
NB maxDelayTime must be set when node is first created but cannot be updated. A new node will have to be inserted if a different maxDelayTime is required.

```javascript
delay(output, {delayTime, maxDelayTime})
```
___

## [dynamicsCompressor](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode)

```javascript
dynamicsCompressor(output, {
  attack,
  knee,
  ratio,
  release,
  threshold,
}]
```
___

## [gain](https://developer.mozilla.org/en-US/docs/Web/API/GainNode)

```javascript
gain(output, {gain})
```
___
## [mediaElementSource](https://developer.mozilla.org/en-US/docs/Web/API/MediaElementAudioSourceNode)
NB params can only be set once
```javascript
mediaElementSource(output, {mediaElement})
```
___
## [mediaStreamDestination](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioDestinationNode)

This node has no output as it is a destination. It also takes no parameters. Use virtualAudioGraph.getAudioNodeById method to access the node's stream property

```javascript
mediaStreamDestination()
```
___
## [mediaStreamSource](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode)
NB params can only be set once
```javascript
mediaStreamSource(output, {mediaStream})
```
___

## [oscillator](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode)

```javascript
oscillator(output, {
  type,
  frequency,
  detune,
  // time in seconds since virtualAudioGraph.currentTime
  // was 0, if not provided then node starts immediately
  startTime,
  // if not provided then stop is not called on node until it is disconnected
  stopTime,
})
```
___

## [panner](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode)

```javascript
panner(output, {
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
})
```
___

## [stereoPanner](https://developer.mozilla.org/en-US/docs/Web/API/StereoPannerNode)

```javascript
stereoPanner(output, {pan})
```
___

## [waveShaper](https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode)

```javascript
waveShaper(output, {curve, oversample})
```
