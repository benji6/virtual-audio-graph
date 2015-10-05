/* global describe expect it */
import createVirtualAudioGraph from '../../src/index.js';
import pingPongDelay from '../tools/pingPongDelay';

describe('virtualAudioGraph.defineNode - error throwing:', () => {
  it('throws if name provided is a standard node', () => {
    const audioContext = new AudioContext();
    const virtualAudioGraph = createVirtualAudioGraph({
      audioContext,
      output: audioContext.destination,
    });

    expect(() => virtualAudioGraph.defineNodes({gain: pingPongDelay}))
      .toThrow();
  });
});
