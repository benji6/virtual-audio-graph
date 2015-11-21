/* global describe expect it */
import pingPongDelay from '../tools/pingPongDelay';

export default createVirtualAudioGraph => {
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
};
