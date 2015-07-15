/* global beforeEach describe expect it */
const R = require('ramda');
const VirtualAudioGraph = require('../../dist/index.js');
const pingPongDelayParamsFactory = require('../tools/pingPongDelayParamsFactory');

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

    const virtualNodeParams = [
      {
        id: 0,
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        },
      },
      {
        id: 1,
        node: 'pingPongDelay',
        output: 0,
        params: {
          decay: 0.5,
          delayTime: 0.5,
          maxDelayTime: 0.5,
        },
      },
      {
        id: 2,
        node: 'oscillator',
        output: 1,
      },
    ];

    expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
    /* eslint-disable */
    expect(R.equals(audioContext.toJSON(), {"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"StereoPannerNode","pan":{"value":-1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":["<circular:DelayNode>"]}]},{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]},{"name":"StereoPannerNode","pan":{"value":1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":["<circular:DelayNode>",{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]}]}]}]}]})).toBe(true);
    /* eslint-enable */
  });

  it('can define a custom node built of other custom nodes', function () {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    const quietpingPongDelayParamsFactory = function () {
      return [
        {
          id: 0,
          node: 'gain',
          output: 'output',
        },
        {
          id: 1,
          node: 'pingPongDelay',
          output: 0,
        },
        {
          id: 2,
          node: 'oscillator',
          output: 1,
        },
      ];
    };

    virtualAudioGraph.defineNode(quietpingPongDelayParamsFactory, 'quietPingPongDelay');

    const virtualNodeParams = [
      {
        id: 0,
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        },
      },
      {
        id: 1,
        node: 'quietPingPongDelay',
        output: 0,
      },
      {
        id: 2,
        node: 'pingPongDelay',
        output: 1,
      },
      {
        id: 3,
        node: 'oscillator',
        output: 2,
      },
    ];

    expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
    /* eslint-disable */
    expect(R.equals(audioContext.toJSON(), {"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":1,"inputs":[]},"inputs":[{"name":"StereoPannerNode","pan":{"value":-1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":["<circular:DelayNode>"]}]},{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]},{"name":"StereoPannerNode","pan":{"value":1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":["<circular:DelayNode>",{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]}]}]}]}]}]})).toBe(true);
    /* eslint-enable */
  });

  it('can define a custom node which can be updated', function () {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    const virtualNodeParams = [
      {
        id: 0,
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        },
      },
      {
        id: 1,
        node: 'pingPongDelay',
        output: 0,
        params: {
          decay: 0.5,
          delayTime: 0.5,
          maxDelayTime: 0.5,
        },
      },
      {
        id: 2,
        node: 'oscillator',
        output: 1,
      },
    ];

    virtualAudioGraph.update(virtualNodeParams);

    /* eslint-disable */
    expect(R.equals(audioContext.toJSON(), {"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"StereoPannerNode","pan":{"value":-1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":["<circular:DelayNode>"]}]},{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]},{"name":"StereoPannerNode","pan":{"value":1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":["<circular:DelayNode>",{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]}]}]}]}]})).toBe(true);
    /* eslint-enable */
    virtualNodeParams[1].params.decay = 0.6;

    virtualAudioGraph.update(virtualNodeParams);
    /* eslint-disable */
    expect(R.equals(audioContext.toJSON(), {"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"StereoPannerNode","pan":{"value":-1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.6,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.6,"inputs":[]},"inputs":["<circular:DelayNode>"]}]},{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]},{"name":"StereoPannerNode","pan":{"value":1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.6,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.6,"inputs":[]},"inputs":["<circular:DelayNode>",{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]}]}]}]}]})).toBe(true);
    /* eslint-enable */
  });

  it('can define a custom node which can be removed', function () {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    const virtualNodeParams = [
      {
        id: 0,
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        },
      },
      {
        id: 1,
        node: 'pingPongDelay',
        output: 0,
        params: {
          decay: 0.5,
          delayTime: 0.5,
          maxDelayTime: 0.5,
        },
      },
      {
        id: 2,
        node: 'oscillator',
        output: 1,
      },
    ];

    virtualAudioGraph.update(virtualNodeParams);

    /* eslint-disable */
    expect(R.equals(audioContext.toJSON(), {"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"StereoPannerNode","pan":{"value":-1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":["<circular:DelayNode>"]}]},{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]},{"name":"StereoPannerNode","pan":{"value":1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":["<circular:DelayNode>",{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]}]}]}]}]})).toBe(true);
    /* eslint-enable */
    virtualNodeParams[1].params.decay = 0.6;

    virtualAudioGraph.update([
      {
        id: 0,
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        },
      },
    ]);

    expect(R.equals(audioContext.toJSON(), {
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
    })).toBe(true);
  });
});
