/* global describe expect it */
import VirtualAudioGraph from '../../src/index.js';
import pingPongDelayParamsFactory from '../tools/pingPongDelayParamsFactory';

describe('virtualAudioGraph.defineNode - error throwing: ', () => {
  it('throws if name provided is a standard node', () => {
    const audioContext = new AudioContext();
    const virtualAudioGraph = new VirtualAudioGraph({
      audioContext,
      output: audioContext.destination,
    });

    expect(() => virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'gain'))
      .toThrow();
  });
});
