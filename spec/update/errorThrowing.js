/* global beforeEach describe expect it */
import createVirtualAudioGraph from '../../src/index.js';

describe('virtualAudioGraph.update - error throwing conditions:', () => {
  let audioContext;
  let virtualAudioGraph;

  beforeEach(() => {
    audioContext = new AudioContext();
    virtualAudioGraph = createVirtualAudioGraph({
      audioContext,
      output: audioContext.destination,
    });
  });

  it('throws an error if no output is provided', () => {
    expect(() => virtualAudioGraph.update({
      0: ['gain'],
    })).toThrow();
  });

  it('throws an error when virtual node name property is not recognised', () => {
    expect(() => virtualAudioGraph.update({
      0: ['foobar', 'output'],
    })).toThrow();
  });

  it('throws an error when id is "output"', () => {
    expect(() => virtualAudioGraph.update({
      output: ['gain', 'output'],
    })).toThrow();
  });

  it('throws an error if a node param is null or undefined', () => {
    expect(() => virtualAudioGraph.update({
      0: ['oscillator', 'output'],
      1: undefined,
    })).toThrow();

    expect(() => virtualAudioGraph.update({
      0: ['oscillator', 'output'],
      1: null,
    })).toThrow();
  });

  it('throws an error when output is an object and key is not specified', () => {
    expect(() => virtualAudioGraph.update({
      0: ['gain', ['output'], {gain: 0.2}],
      1: ['oscillator', 0, {frequency: 120}],
      2: ['gain', {id: 1, destination: 'frequency'}, {gain: 1024}],
      3: ['oscillator', 2, {frequency: 100}],
    })).toThrow();
  });

  it('throws an error if outputs and inputs of channelSplitter are different lengths', () => {
    const params = {numberOfOutputs: 2};

    expect(() => virtualAudioGraph.update({
      0: ['channelMerger', 'output', params],
      1: ['oscillator', 'output'],
      2: ['channelSplitter', {key: 0, outputs: [0, 1, 2], inputs: [1, 0]}, params],
    })).toThrow();
  });
});
