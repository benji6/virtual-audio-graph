/* global beforeEach describe expect it */
const VirtualAudioGraph = require('../../dist/index.js');
const pingPongDelayParamsFactory = require('../tools/pingPongDelayParamsFactory');

describe('virtualAudioGraph.update - expected behaviour', function () {
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
    const virtualNodeParams = [{
      id: 0,
      node: 'oscillator',
      params: {
        type: 'square',
      },
      output: 'output',
    }];
    expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
  });

  it('adds then removes nodes', function () {
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

  it('handles random strings for ids', function () {
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

  it('changes the node if passed params with same id but different node property', function () {
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

    virtualAudioGraph.update([{
      id: 0,
      node: 'oscillator',
      output: 'output',
    }]);

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

    virtualAudioGraph.update([{
      id: 0,
      node: 'pingPongDelay',
      output: 'output',
    }]);
    /* eslint-disable */
    expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }) ] }) ] }) ] }) ] });
    /* eslint-enable */
  });

  it('connects nodes to each other', function () {
    virtualAudioGraph.update([{
      id: 0,
      node: 'gain',
      output: 'output',
    },
    {
      id: 1,
      node: 'oscillator',
      output: 0,
    }]);
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
    virtualAudioGraph.update([{
      id: 0,
      node: 'oscillator',
      output: 'output',
    }]);
    expect(audioContext.toJSON()).toEqual({
      'name': 'AudioDestinationNode',
      'inputs': [
        {
          'name': 'OscillatorNode',
          'type': 'sine',
          'frequency': {
            'value': 440,
            'inputs': [],
          },
          'detune': {
            'value': 0,
            'inputs': [],
          },
          inputs: [],
        },
      ],
    });
  });

  it('reconnects nodes to each other', function () {
    virtualAudioGraph.update([{
      id: 0,
      node: 'gain',
      output: 'output',
    },
    {
      id: 1,
      node: 'oscillator',
      output: 0,
    }]);
    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      'inputs': [
        {
          'name': 'GainNode',
          'gain': {
            'value': 1,
            'inputs': [],
          },
          'inputs': [
            {
              'name': 'OscillatorNode',
              'type': 'sine',
              'frequency': {
                'value': 440,
                'inputs': [],
              },
              'detune': {
                'value': 0,
                'inputs': [],
              },
              'inputs': [],
            },
          ],
        },
      ],
    });
    virtualAudioGraph.update([{
      id: 0,
      node: 'gain',
      output: 'output',
    },
    {
      id: 1,
      node: 'oscillator',
      output: 'output',
    }]);
    expect(audioContext.toJSON()).toEqual({
      'name': 'AudioDestinationNode',
      'inputs': [
        {
          'name': 'GainNode',
          'gain': {
            'value': 1,
            'inputs': [],
          },
          'inputs': [],
        },
        {
          'name': 'OscillatorNode',
          'type': 'sine',
          'frequency': {
            'value': 440,
            'inputs': [],
          },
          'detune': {
            'value': 0,
            'inputs': [],
          },
          'inputs': [],
        },
      ],
    });
  });

  it('connects and reconnects nodes to audioParams', function () {
    virtualAudioGraph.update([{
      id: 0,
      node: 'gain',
      output: 'output',
    },
    {
      id: 1,
      node: 'oscillator',
      output: 0,
    },
    {
      id: 2,
      node: 'oscillator',
      output: {id: 1, destination: 'frequency'},
      params: {
        frequency: 0.5,
        type: 'triangle',
      },
    }]);

    expect(audioContext.toJSON()).toEqual({
      'name': 'AudioDestinationNode',
      'inputs': [
        {
          'name': 'GainNode',
          'gain': {
            'value': 1,
            'inputs': [],
          },
          'inputs': [
            {
              'name': 'OscillatorNode',
              'type': 'sine',
              'frequency': {
                'value': 440,
                'inputs': [
                  {
                    'name': 'OscillatorNode',
                    'type': 'triangle',
                    'frequency': {
                      'value': 0.5,
                      'inputs': [],
                    },
                    'detune': {
                      'value': 0,
                      'inputs': [],
                    },
                    'inputs': [],
                  },
                ],
              },
              'detune': {
                'value': 0,
                'inputs': [],
              },
              'inputs': [],
            },
          ],
        },
      ],
    });

    virtualAudioGraph.update([{
      id: 0,
      node: 'gain',
      output: 'output',
    },
    {
      id: 1,
      node: 'oscillator',
      output: 0,
    },
    {
      id: 2,
      node: 'oscillator',
      output: [
        {
          id: 1,
          destination: 'detune',
        },
      ],
      params: {
        frequency: 0.5,
        type: 'triangle',
      },
    }]);

    expect(audioContext.toJSON()).toEqual({
      'name': 'AudioDestinationNode',
      'inputs': [
        {
          'name': 'GainNode',
          'gain': {
            'value': 1,
            'inputs': [],
          },
          'inputs': [
            {
              'name': 'OscillatorNode',
              'type': 'sine',
              'frequency': {
                'value': 440,
                'inputs': [],
              },
              'detune': {
                'value': 0,
                'inputs': [
                  {
                    'name': 'OscillatorNode',
                    'type': 'triangle',
                    'frequency': {
                      'value': 0.5,
                      'inputs': [],
                    },
                    'detune': {
                      'value': 0,
                      'inputs': [],
                    },
                    'inputs': [],
                  },
                ],
              },
              'inputs': [],
            },
          ],
        },
      ],
    });

    virtualAudioGraph.update([{
      id: 0,
      node: 'oscillator',
      output: 'output',
    }]);
    expect(audioContext.toJSON()).toEqual({
      'name': 'AudioDestinationNode',
      'inputs': [
        {
          'name': 'OscillatorNode',
          'type': 'sine',
          'frequency': {
            'value': 440,
            'inputs': [],
          },
          'detune': {
            'value': 0,
            'inputs': [],
          },
          'inputs': [],
        },
      ],
    });
  });
});
