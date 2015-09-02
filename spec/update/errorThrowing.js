/* global beforeEach describe expect it */
import VirtualAudioGraph from '../../src/index.js';

describe('virtualAudioGraph.update - error throwing conditions: ', () => {
  let audioContext;
  let virtualAudioGraph;

  beforeEach(() => {
    audioContext = new AudioContext();
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext,
      output: audioContext.destination,
    });
  });

  it('throws an error if no output is provided', () => {
    expect(() => virtualAudioGraph.update({
      0: {
        node: 'gain',
      },
    })).toThrow();
  });

  it('throws an error when virtual node name property is not recognised', () => {
    expect(() => virtualAudioGraph.update({
      0: {
        node: 'foobar',
        output: 'output',
      },
    })).toThrow();
  });

  it('throws an error when id is "output"', () => {
    expect(() => virtualAudioGraph.update({
      0: {
        output: {
          node: 'gain',
          output: 'output',
        },
      },
    })).toThrow();
  });

  it('throws an error if a node param is null or undefined', () => {
    expect(() => virtualAudioGraph.update({
      0: {
        node: 'oscillator',
        output: 'output',
      },
      1: undefined,
    })).toThrow();

    expect(() => virtualAudioGraph.update({
      0: {
        node: 'oscillator',
        output: 'output',
      },
      1: null,
    })).toThrow();
  });

  it('throws an error when output is an object and key is not specified', () => {
    expect(() => virtualAudioGraph.update({
      0: {
        node: 'gain',
        output: ['output'],
        params: {
          gain: 0.2,
        },
      },
      1: {
        node: 'oscillator',
        output: 0,
        params: {
          frequency: 120,
        },
      },
      2: {
        node: 'gain',
        output: {id: 1, destination: 'frequency'},
        params: {
          gain: 1024,
        },
      },
      3: {
        node: 'oscillator',
        output: 2,
        params: {
          frequency: 100,
        },
      },
    })).toThrow();
  });

  it('throws an error if outputs and inputs of channelSplitter are different lengths', () => {
    const params = {numberOfOutputs: 2};

    expect(() => virtualAudioGraph.update({
      0: {
        node: 'channelMerger',
        params,
        output: 'output',
      },
      1: {
        node: 'oscillator',
        output: 'output',
      },
      2: {
        node: 'channelSplitter',
        params,
        output: {key: 0, outputs: [0, 1, 2], inputs: [1, 0]},
      },
    })).toThrow();
  });
});
