const {equals} = require('ramda');
const VirtualAudioGraph = require('../src/index.js');
const audioContext = require('./tools/audioContext');

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

describe('virtualAudioGraph.defineNode', () => {
  let virtualAudioGraph;

  beforeEach(() => {
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext,
      output: audioContext.destination,
    });
  });

  it('returns itself', () => {
    expect(virtualAudioGraph.defineNode(pingPongDelayParams, 'pingPongDelay')).toBe(virtualAudioGraph);
  });

  it('throws if name provided is a standard node', () => {
    expect(() => virtualAudioGraph.defineNode(pingPongDelayParams, 'gain')).toThrow();
  });

  it('creates a custom node internally', () => {
    virtualAudioGraph.defineNode(pingPongDelayParams, 'pingPongDelay');

    expect(typeof virtualAudioGraph.customNodes.pingPongDelay).toBe('function');
  });

  it('creates a custom node which can be reused in virtualAudioGraph.update', () => {
    virtualAudioGraph.defineNode(pingPongDelayParams, 'pingPongDelay');

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
      },
      {
        id: 2,
        node: 'oscillator',
        output: 1,
      },
    ];

  const expectedAudioGraph = {
    name: "AudioDestinationNode",
    inputs:[
      {
        name: "GainNode",
        gain: {
          value: 0.5,
          inputs: []
        },
        inputs: [
          {
            name: "StereoPannerNode",
            pan: {
              value: -1,
              inputs: []
            },
            inputs: [
              {
                name: "DelayNode",
                delayTime: {
                  value: 0.3333333333333333,
                  inputs: []
                },
                inputs: [
                  {
                    name: "GainNode",
                    gain: {
                      value: 0.3333333333333333,
                      inputs: []
                    },
                    inputs: [
                      {
                        name: "DelayNode",
                        delayTime: {
                          value: 0.3333333333333333,
                          inputs: []
                        },
                        inputs: [
                          {
                            name: "GainNode",
                            gain: {
                              value: 0.3333333333333333,
                              inputs: []
                            },
                            inputs: ["<circular:DelayNode>"]
                          }
                        ]
                      },
                      {
                        name: "OscillatorNode",
                        type: "sine",
                        frequency: {
                          value: 440,
                          inputs: []
                        },
                        detune: {
                          value: 0,
                          inputs: []
                        },
                        inputs: []
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "StereoPannerNode",
            pan: {
              value: 1,
              inputs: []
            },
            inputs: [
              {
                name: "DelayNode",
                delayTime: {
                  value: 0.3333333333333333,
                  inputs: []
                },
                inputs: [
                  {
                    name: "GainNode",
                    gain: {
                      value: 0.3333333333333333,
                      inputs: []
                    },
                    inputs: [
                      {
                        name: "DelayNode",
                        delayTime: {
                          value: 0.3333333333333333,
                          inputs: []
                        },
                        inputs: [
                          {
                            name: "GainNode",
                            gain: {
                              value: 0.3333333333333333,
                              inputs: []
                            },
                            inputs: [
                              "<circular:DelayNode>",
                              {
                                name: "OscillatorNode",
                                type: "sine",
                                frequency: {
                                  value: 440,
                                  inputs: []
                                },
                                detune: {
                                  value: 0,
                                  inputs: []
                                },
                                inputs: []
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

    expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
    expect(equals(audioContext.toJSON(), expectedAudioGraph)).toBe(true);
  });

  it('can define a custom node built of other custom nodes', () => {
    virtualAudioGraph.defineNode(pingPongDelayParams, 'pingPongDelay');

    const quietPingPongDelayParams = [
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

    virtualAudioGraph.defineNode(quietPingPongDelayParams, 'quietPingPongDelay');

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
    expect(equals(audioContext.toJSON(), {"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"StereoPannerNode","pan":{"value":-1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":["<circular:DelayNode>"]}]},{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]},{"name":"StereoPannerNode","pan":{"value":1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":["<circular:DelayNode>",{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]}]}]}]},{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":1,"inputs":[]},"inputs":[{"name":"StereoPannerNode","pan":{"value":-1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":["<circular:DelayNode>"]}]},{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]},{"name":"StereoPannerNode","pan":{"value":1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":["<circular:DelayNode>",{"name":"OscillatorNode","type":"sine","frequency":{"value":440,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]}]}]}]}]}]})).toBe(true);
  });
});
