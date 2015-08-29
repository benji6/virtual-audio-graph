/* global beforeEach describe expect it */
import VirtualAudioGraph from '../../src/index.js';
import pingPongDelayParamsFactory from '../tools/pingPongDelayParamsFactory';
import sineOscFactory from '../tools/sineOscFactory';

describe('virtualAudioGraph.update - expected behaviour: ', () => {
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
    const virtualNodeParams = {
      0: {
        node: 'oscillator',
        params: {
          type: 'square',
        },
        output: 'output',
      },
    };
    expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
  });

  it('adds then removes nodes', () => {
    virtualAudioGraph.update({
      0: {
        node: 'gain',
        output: 'output',
      },
      1: {
        node: 'oscillator',
        output: 0,
      },
    });
    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [{
        name: 'GainNode',
        gain: {
          value: 1,
          inputs: [],
        },
        inputs: [{
          name: 'OscillatorNode',
          type: 'sine',
          frequency: {
            value: 440,
            inputs: [],
          },
          detune: {
            value: 0,
            inputs: [],
          },
          inputs: [],
        }],
      }],
    });
    virtualAudioGraph.update({});
    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [],
    });
  });

  it('handles random strings for ids', () => {
    virtualAudioGraph.update({
      foo: {
        node: 'gain',
        output: 'output',
      },
      bar: {
        node: 'oscillator',
        output: 'foo',
      },
    });
    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [{
        name: 'GainNode',
        gain: {
          value: 1,
          inputs: [],
        },
        inputs: [{
          name: 'OscillatorNode',
          type: 'sine',
          frequency: {
            value: 440,
            inputs: [],
          },
          detune: {
            value: 0,
            inputs: [],
          },
          inputs: [],
        }],
      }],
    });
    virtualAudioGraph.update({});
    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [],
    });
  });

  it('changes the node if passed params with same id but different node property', () => {
    virtualAudioGraph.update({
      0: {
        node: 'gain',
        output: 'output',
      },
    });

    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [
        {
          name: 'GainNode',
          gain: {
            value: 1,
            inputs: [],
          },
          inputs: [],
        },
      ],
    });

    virtualAudioGraph.update({
      0: {
        node: 'oscillator',
        output: 'output',
      },
    });

    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [
        {
          name: 'OscillatorNode',
          type: 'sine',
          frequency: {
            value: 440,
            inputs: [],
          },
          detune: {
            value: 0,
            inputs: [],
          },
          inputs: [],
        },
      ],
    });

    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    virtualAudioGraph.update({
      0: {
        node: 'pingPongDelay',
        output: 'output',
      },
    });

     /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }) ] }) ] }) ] }) ] });
    /* eslint-enable */
  });

  it('updates standard and custom nodes if passed same id but different params', () => {
    virtualAudioGraph.update({
      0: {
        node: 'oscillator',
        params: {
          frequency: 220,
          detune: -9,
        },
        output: 'output',
      },
    });

    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [{
        name: 'OscillatorNode',
        type: 'sine',
        frequency: {
          value: 220,
          inputs: [],
        },
        detune: {
          value: -9,
          inputs: [],
        },
        inputs: [],
      }],
    });

    virtualAudioGraph.update({
      0: {
        node: 'oscillator',
        params: {
          frequency: 880,
          detune: 0,
        },
        output: 'output',
      },
    });

    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [{
        name: 'OscillatorNode',
        type: 'sine',
        frequency: {
          value: 880,
          inputs: [],
        },
        detune: {
          value: 0,
          inputs: [],
        },
        inputs: [],
      }],
    });

    virtualAudioGraph.defineNode(sineOscFactory, 'sineOscFactory');

    virtualAudioGraph.update({
      0: {
        node: 'sineOscFactory',
        params: {
          frequency: 110,
          gain: 0.5,
        },
        output: 'output',
      },
    });

    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [{
        name: 'GainNode',
        gain: {
          value: 0.5,
          inputs: [],
        },
        inputs: [{
          name: 'OscillatorNode',
          type: 'sine',
          frequency: {
            value: 110,
            inputs: [],
          },
          detune: {
            value: 0,
            inputs: [],
          },
          inputs: [],
        }],
      }],
    });

    virtualAudioGraph.update({
      0: {
        node: 'sineOscFactory',
        params: {
          frequency: 660,
          gain: 0.2,
        },
        output: 'output',
      },
    });

    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [{
        name: 'GainNode',
        gain: {
          value: 0.2,
          inputs: [],
        },
        inputs: [{
          name: 'OscillatorNode',
          type: 'sine',
          frequency: {
            value: 660,
            inputs: [],
          },
          detune: {
            value: 0,
            inputs: [],
          },
          inputs: [],
        }],
      }],
    });
  });

  it('connects nodes to each other', () => {
    virtualAudioGraph.update({
      0: {
        node: 'gain',
        output: 'output',
      },
      1: {
        node: 'oscillator',
        output: 0,
      },
    });
    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [
        {
          name: 'GainNode',
          gain: {
            value: 1,
            inputs: [],
          },
          inputs: [
            {
              name: 'OscillatorNode',
              type: 'sine',
              frequency: {
                value: 440,
                inputs: [],
              },
              detune: {
                value: 0,
                inputs: [],
              },
              inputs: [],
            },
          ],
        },
      ],
    });
    virtualAudioGraph.update({
      0: {
        node: 'oscillator',
        output: 'output',
      },
    });
    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [
        {
          name: 'OscillatorNode',
          type: 'sine',
          frequency: {
            value: 440,
            inputs: [],
          },
          detune: {
            value: 0,
            inputs: [],
          },
          inputs: [],
        },
      ],
    });
  });

  it('reconnects nodes to each other', () => {
    virtualAudioGraph.update({
      0: {
        node: 'gain',
        output: 'output',
      },
      1: {
        node: 'oscillator',
        output: 0,
      },
    });
    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [
        {
          name: 'GainNode',
          gain: {
            value: 1,
            inputs: [],
          },
          inputs: [
            {
              name: 'OscillatorNode',
              type: 'sine',
              frequency: {
                value: 440,
                inputs: [],
              },
              detune: {
                value: 0,
                inputs: [],
              },
              inputs: [],
            },
          ],
        },
      ],
    });
    virtualAudioGraph.update({
      0: {
        node: 'gain',
        output: 'output',
      },
      1: {
        node: 'oscillator',
        output: 'output',
      },
    });
    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [
        {
          name: 'GainNode',
          gain: {
            value: 1,
            inputs: [],
          },
          inputs: [],
        },
        {
          name: 'OscillatorNode',
          type: 'sine',
          frequency: {
            value: 440,
            inputs: [],
          },
          detune: {
            value: 0,
            inputs: [],
          },
          inputs: [],
        },
      ],
    });
  });

  it('connects and reconnects nodes to audioParams', () => {
    virtualAudioGraph.update({
      0: {
        node: 'gain',
        output: 'output',
      },
      1: {
        node: 'oscillator',
        output: 0,
      },
      2: {
        node: 'oscillator',
        output: {key: 1, destination: 'frequency'},
        params: {
          frequency: 0.5,
          type: 'triangle',
        },
      },
    });

    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [
        {
          name: 'GainNode',
          gain: {
            value: 1,
            inputs: [],
          },
          inputs: [
            {
              name: 'OscillatorNode',
              type: 'sine',
              frequency: {
                value: 440,
                inputs: [
                  {
                    name: 'OscillatorNode',
                    type: 'triangle',
                    frequency: {
                      value: 0.5,
                      inputs: [],
                    },
                    detune: {
                      value: 0,
                      inputs: [],
                    },
                    inputs: [],
                  },
                ],
              },
              detune: {
                value: 0,
                inputs: [],
              },
              inputs: [],
            },
          ],
        },
      ],
    });

    virtualAudioGraph.update({
      0: {
        node: 'gain',
        output: 'output',
      },
      1: {
        node: 'oscillator',
        output: 0,
      },
      2: {
        node: 'oscillator',
        output: [
          {key: 1, destination: 'detune'},
        ],
        params: {
          frequency: 0.5,
          type: 'triangle',
        },
      },
    });

    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [
        {
          name: 'GainNode',
          gain: {
            value: 1,
            inputs: [],
          },
          inputs: [
            {
              name: 'OscillatorNode',
              type: 'sine',
              frequency: {
                value: 440,
                inputs: [],
              },
              detune: {
                value: 0,
                inputs: [
                  {
                    name: 'OscillatorNode',
                    type: 'triangle',
                    frequency: {
                      value: 0.5,
                      inputs: [],
                    },
                    detune: {
                      value: 0,
                      inputs: [],
                    },
                    inputs: [],
                  },
                ],
              },
              inputs: [],
            },
          ],
        },
      ],
    });

    virtualAudioGraph.update({
      0: {
        node: 'oscillator',
        output: 'output',
      },
    });
    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [
        {
          name: 'OscillatorNode',
          type: 'sine',
          frequency: {
            value: 440,
            inputs: [],
          },
          detune: {
            value: 0,
            inputs: [],
          },
          inputs: [],
        },
      ],
    });
  });
});
