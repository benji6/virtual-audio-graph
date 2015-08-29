/* global describe expect it */
import VirtualAudioGraph from '../src/index.js';
const audioContext = new AudioContext();

describe('VirtualAudioGraph', () => {
  it('optionally takes audioContext property', () => {
    expect(new VirtualAudioGraph({audioContext}).audioContext).toBe(audioContext);
    expect(new VirtualAudioGraph({audioContext}).output).toBe(audioContext.destination);
    expect(new VirtualAudioGraph().audioContext instanceof AudioContext).toBe(true);
  });

  it('optionally takes output parameter', () => {
    expect(new VirtualAudioGraph({
      output: audioContext.destination,
    }).output).toBe(audioContext.destination);
    expect(new VirtualAudioGraph({audioContext: audioContext}).output).toBe(audioContext.destination);
  });

  it('has a property called currentTime which returns the audioContext currentTime', () => {
    expect(new VirtualAudioGraph({audioContext}).currentTime).toBe(audioContext.currentTime);
  });

  it('has a method called getAudioNodeById which returns an AudioNode of with the given id', () => {
    const virtualAudioGraph = new VirtualAudioGraph({audioContext});

    virtualAudioGraph.update({
      0: {
        node: 'gain',
        output: 'output',
      },
    });

    expect(virtualAudioGraph.getAudioNodeById(0).constructor).toBe(GainNode);
  });
});
