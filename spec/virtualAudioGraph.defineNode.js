const {equals} = require('ramda');
const VirtualAudioGraph = require('../src/index.js');

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
      }
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
      }
    },
  ];
};

describe('virtualAudioGraph.defineNode', () => {
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

  it('throws if name provided is a standard node', () => {
    expect(() => virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'gain')).toThrow();
  });

  it('creates a custom node internally', () => {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    expect(typeof virtualAudioGraph.customNodes.pingPongDelay).toBe('function');
  });

  it('creates a custom node which can be reused in virtualAudioGraph.update', () => {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    const virtualNodeParams = [
      {
        id: 0,
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        }
      },
      {
        id: 1,
        node: 'pingPongDelay',
        output: 0,
        params: {
          decay: 0.5,
          delayTime: 0.5,
          maxDelayTime: 0.5,
        }
      },
      {
        id: 2,
        node: 'oscillator',
        output: 1,
      },
    ];

    expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
    expect(equals(audioContext.toJSON(), {"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"StereoPannerNode","pan":{"value":-1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":["<circular:DelayNode>"]}]},{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]},{"name":"StereoPannerNode","pan":{"value":1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":["<circular:DelayNode>",{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]}]}]}]}]})).toBe(true);
  });

  it('can define a custom node built of other custom nodes', () => {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    const quietpingPongDelayParamsFactory = () => [
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

    virtualAudioGraph.defineNode(quietpingPongDelayParamsFactory, 'quietPingPongDelay');

    const virtualNodeParams = [
      {
        id: 0,
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        }
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
    expect(equals(audioContext.toJSON(), {"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":1,"inputs":[]},"inputs":[{"name":"StereoPannerNode","pan":{"value":-1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":["<circular:DelayNode>"]}]},{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]},{"name":"StereoPannerNode","pan":{"value":1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":["<circular:DelayNode>",{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]}]}]}]}]}]})).toBe(true);
  });

  it('can define a custom node which can be updated', () => {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    const virtualNodeParams = [
      {
        id: 0,
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        }
      },
      {
        id: 1,
        node: 'pingPongDelay',
        output: 0,
        params: {
          decay: 0.5,
          delayTime: 0.5,
          maxDelayTime: 0.5,
        }
      },
      {
        id: 2,
        node: 'oscillator',
        output: 1,
      },
    ];

    virtualAudioGraph.update(virtualNodeParams);

    expect(equals(audioContext.toJSON(), {"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"StereoPannerNode","pan":{"value":-1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":["<circular:DelayNode>"]}]},{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]},{"name":"StereoPannerNode","pan":{"value":1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":["<circular:DelayNode>",{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]}]}]}]}]})).toBe(true);

    virtualNodeParams[1].params.decay = 0.6;

    virtualAudioGraph.update(virtualNodeParams);

    expect(equals(audioContext.toJSON(), {"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"StereoPannerNode","pan":{"value":-1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.6,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.6,"inputs":[]},"inputs":["<circular:DelayNode>"]}]},{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]},{"name":"StereoPannerNode","pan":{"value":1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.6,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.6,"inputs":[]},"inputs":["<circular:DelayNode>",{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]}]}]}]}]})).toBe(true);
  });

  it('can define a custom node which can be removed', () => {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    const virtualNodeParams = [
      {
        id: 0,
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        }
      },
      {
        id: 1,
        node: 'pingPongDelay',
        output: 0,
        params: {
          decay: 0.5,
          delayTime: 0.5,
          maxDelayTime: 0.5,
        }
      },
      {
        id: 2,
        node: 'oscillator',
        output: 1,
      },
    ];

    virtualAudioGraph.update(virtualNodeParams);

    expect(equals(audioContext.toJSON(), {"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"StereoPannerNode","pan":{"value":-1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":["<circular:DelayNode>"]}]},{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]},{"name":"StereoPannerNode","pan":{"value":1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":["<circular:DelayNode>",{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]}]}]}]}]})).toBe(true);

    virtualNodeParams[1].params.decay = 0.6;

    virtualAudioGraph.update([
      {
        id: 0,
        node: 'gain',
        output: 'output',
        params: {
          gain: 0.5,
        }
      }
    ]);

    expect(equals(audioContext.toJSON(), {"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[]}]})).toBe(true);
  });
});
