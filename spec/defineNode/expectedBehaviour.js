/* global beforeEach describe expect it */
const VirtualAudioGraph = require('../../dist/index.js');
const pingPongDelayParamsFactory = require('../tools/pingPongDelayParamsFactory');
const sineOscFactory = require('../tools/sineOscFactory');
const squareOscFactory = require('../tools/squareOscFactory');

describe('virtualAudioGraph.defineNode - expected behaviour', function () {
  var audioContext;
  var virtualAudioGraph;

  beforeEach(function () {
    audioContext = new AudioContext();
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext: audioContext,
      output: audioContext.destination,
    });
  });

  it('returns itself', function () {
    expect(virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay')).toBe(virtualAudioGraph);
  });

  it('creates a custom node internally', function () {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    expect(typeof virtualAudioGraph.customNodes.pingPongDelay).toBe('function');
  });

  it('creates a custom node which can be reused in virtualAudioGraph.update', function () {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    const virtualGraphParams = {
      0: {
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        },
      },
      1: {
        node: 'pingPongDelay',
        output: 0,
        params: {
          decay: 0.5,
          delayTime: 0.5,
          maxDelayTime: 0.5,
        },
      },
      2: {
        node: 'oscillator',
        output: 1,
      },
    };

    expect(virtualAudioGraph.update(virtualGraphParams)).toBe(virtualAudioGraph);
    /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>', Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }), Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] });
    /* eslint-enable */
  });

  it('can define a custom node built of other custom nodes', function () {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    const quietpingPongDelayParamsFactory = function () {
      return {
        0: {
          node: 'gain',
          output: 'output',
        },
        1: {
          node: 'pingPongDelay',
          output: 0,
        },
        2: {
          node: 'oscillator',
          output: 1,
        },
      };
    };

    virtualAudioGraph.defineNode(quietpingPongDelayParamsFactory, 'quietPingPongDelay');

    const virtualGraphParams = {
      0: {
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        },
      },
      1: {
        node: 'quietPingPongDelay',
        output: 0,
      },
      2: {
        node: 'pingPongDelay',
        output: 1,
      },
      3: {
        node: 'oscillator',
        output: 2,
      },
    };

    expect(virtualAudioGraph.update(virtualGraphParams)).toBe(virtualAudioGraph);
    /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ '<circular:DelayNode>', Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }), Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }) ] });
    /* eslint-enable */
  });

  it('can define a custom node which can be updated', function () {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    const virtualGraphParams = {
      0: {
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        },
      },
      1: {
        node: 'pingPongDelay',
        output: 0,
        params: {
          decay: 0.5,
          delayTime: 0.5,
          maxDelayTime: 0.5,
        },
      },
      2: {
        node: 'oscillator',
        output: 1,
      },
    };

    virtualAudioGraph.update(virtualGraphParams);

    /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>', Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }), Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] });
    /* eslint-enable */
    virtualGraphParams[1].params.decay = 0.6;

    virtualAudioGraph.update(virtualGraphParams);
    /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.6, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.6, inputs: [  ] }), inputs: [ '<circular:DelayNode>', Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.6, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.6, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }), Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] });
    /* eslint-enable */
  });

  it('can define a custom node which can be removed', function () {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    const virtualGraphParams = {
      0: {
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        },
      },
      1: {
        node: 'pingPongDelay',
        output: 0,
        params: {
          decay: 0.5,
          delayTime: 0.5,
          maxDelayTime: 0.5,
        },
      },
      2: {
        node: 'oscillator',
        output: 1,
      },
    };

    virtualAudioGraph.update(virtualGraphParams);

    /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>', Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }), Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] });
    /* eslint-enable */
    virtualGraphParams[1].params.decay = 0.6;

    virtualAudioGraph.update({
      0: {
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        },
      },
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
  it('can define a custom node which can be replaced with another on update', function () {
    virtualAudioGraph.defineNode(sineOscFactory, 'sineOscFactory');
    virtualAudioGraph.defineNode(squareOscFactory, 'squareOscFactory');

    virtualAudioGraph.update({
      0: {
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        },
      },
      1: {
        node: 'squareOscFactory',
        output: 0,
        params: {
          gain: 0.5,
          frequency: 220,
          startTime: 1,
          stopTime: 2,
        },
      },
    });

    /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"OscillatorNode","type":"square","frequency":{"value":220,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]},{"name":"OscillatorNode","type":"square","frequency":{"value":220,"inputs":[]},"detune":{"value":3,"inputs":[]},"inputs":[]}]}]}]});
    /* eslint-enable */

    virtualAudioGraph.update({
      0: {
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        },
      },
      1: {
        node: 'sineOscFactory',
        output: 0,
        params: {
          gain: 0.5,
          frequency: 220,
          startTime: 1,
          stopTime: 2,
        },
      },
    });
    /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"OscillatorNode","type":"sine","frequency":{"value":220,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]});
    /* eslint-enable */
  });
});
