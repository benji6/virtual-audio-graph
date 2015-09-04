/* global beforeEach describe expect it */
import VirtualAudioGraph from '../../src/index.js';
import pingPongDelayParamsFactory from '../tools/pingPongDelayParamsFactory';
import sineOscFactory from '../tools/sineOscFactory';
import squareOscFactory from '../tools/squareOscFactory';

describe('virtualAudioGraph.defineNode - expected behaviour: ', () => {
  let audioContext;
  let virtualAudioGraph;

  beforeEach(() => {
    audioContext = new AudioContext();
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext,
      output: audioContext.destination,
    });
  });

  it('returns itself', () => {
    expect(virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay')).toBe(virtualAudioGraph);
  });

  it('creates a custom node internally', () => {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');
    expect(typeof virtualAudioGraph.customNodes.pingPongDelay).toBe('function');
  });

  it('creates a custom node which can be reused in virtualAudioGraph.update', () => {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    const virtualGraphParams = {
      0: ['gain', 'output', {gain: 0.5}],
      1: ['pingPongDelay', 0, {decay: 0.5, delayTime: 0.5, maxDelayTime: 0.5}],
      2: ['oscillator', 1],
    };

    expect(virtualAudioGraph.update(virtualGraphParams)).toBe(virtualAudioGraph);
    /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>', Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }), Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] });
    /* eslint-enable */
  });

  it('can define a custom node built of other custom nodes', () => {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    const quietpingPongDelayParamsFactory = () => ({
      0: ['gain', 'output'],
      1: ['pingPongDelay', 0],
      2: ['oscillator', 1],
    });

    virtualAudioGraph.defineNode(quietpingPongDelayParamsFactory, 'quietPingPongDelay');

    const virtualGraphParams = {
      0: ['gain', 'output', {gain: 0.5}],
      1: ['quietPingPongDelay', 0],
      2: ['pingPongDelay', 1],
      3: ['oscillator', 2],
    };

    expect(virtualAudioGraph.update(virtualGraphParams)).toBe(virtualAudioGraph);
    /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ '<circular:DelayNode>', Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }), Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }) ] });
    /* eslint-enable */
  });

  it('can define a custom node which can be updated', () => {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    const virtualGraphParams = {
      0: ['gain', 'output', {gain: 0.5}],
      1: ['pingPongDelay', 0, {decay: 0.5, delayTime: 0.5, maxDelayTime: 0.5}],
      2: ['oscillator', 1],
    };

    virtualAudioGraph.update(virtualGraphParams);

    /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>', Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }), Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] });
    /* eslint-enable */
    virtualGraphParams[1][2].decay = 0.6;

    virtualAudioGraph.update(virtualGraphParams);
    /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.6, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.6, inputs: [  ] }), inputs: [ '<circular:DelayNode>', Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.6, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.6, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }), Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] });
    /* eslint-enable */
  });

  it('can define a custom node which can be removed', () => {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    const virtualGraphParams = {
      0: ['gain', 'output', {gain: 0.5}],
      1: ['pingPongDelay', 0, {decay: 0.5, delayTime: 0.5, maxDelayTime: 0.5}],
      2: ['oscillator', 1],
    };

    virtualAudioGraph.update(virtualGraphParams);

    /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>', Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }), Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] });
    /* eslint-enable */
    virtualGraphParams[1][2].decay = 0.6;

    virtualAudioGraph.update({
      0: ['gain', 'output', {gain: 0.5}],
    });

    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [
        {
          name: 'GainNode',
          gain: {
            value: 0.5,
            inputs: [],
          },
          inputs: [],
        },
      ],
    });
  });
  it('can define a custom node which can be replaced with another on update', () => {
    virtualAudioGraph.defineNode(sineOscFactory, 'sineOscFactory');
    virtualAudioGraph.defineNode(squareOscFactory, 'squareOscFactory');

    virtualAudioGraph.update({
      0: ['gain', 'output', {gain: 0.5}],
      1: ['squareOscFactory', 0, {gain: 0.5,
                                  frequency: 220,
                                  startTime: 1,
                                  stopTime: 2}],
    });

    /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"OscillatorNode","type":"square","frequency":{"value":220,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]},{"name":"OscillatorNode","type":"square","frequency":{"value":220,"inputs":[]},"detune":{"value":3,"inputs":[]},"inputs":[]}]}]}]});
    /* eslint-enable */

    virtualAudioGraph.update({
      0: ['gain', 'output', {gain: 0.5}],
      1: ['sineOscFactory', 0, {gain: 0.5,
                                frequency: 220,
                                startTime: 1,
                                stopTime: 2}],
    });
    /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"OscillatorNode","type":"sine","frequency":{"value":220,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]});
    /* eslint-enable */
  });
});
