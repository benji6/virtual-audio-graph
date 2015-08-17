/* global describe expect it */
const VirtualAudioGraph = require('../dist/index.js');
const audioContext = new AudioContext();

describe('VirtualAudioGraph', function () {
  it('optionally takes audioContext property', function () {
    expect(new VirtualAudioGraph({audioContext: audioContext}).audioContext).toBe(audioContext);
    expect(new VirtualAudioGraph({audioContext: audioContext}).output).toBe(audioContext.destination);
    expect(new VirtualAudioGraph().audioContext instanceof AudioContext).toBe(true);
  });

  it('optionally takes output parameter', function () {
    expect(new VirtualAudioGraph({
      output: audioContext.destination,
    }).output).toBe(audioContext.destination);
    expect(new VirtualAudioGraph({audioContext: audioContext}).output).toBe(audioContext.destination);
  });

  it('has a property called currentTime which returns the audioContext currentTime', function () {
    expect(new VirtualAudioGraph({
      audioContext: audioContext,
    }).currentTime).toBe(audioContext.currentTime);
  });

  it('has a method called getAudioNodeById which returns an AudioNode of with the given id', function () {
    const virtualAudioGraph = new VirtualAudioGraph({
      audioContext: audioContext,
    });

    virtualAudioGraph.update({
      0: {
        node: 'gain',
        output: 'output',
      },
    });

    expect(virtualAudioGraph.getAudioNodeById(0).constructor).toBe(GainNode);
  });
});
