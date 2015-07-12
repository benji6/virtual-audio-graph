const VirtualAudioGraph = require('../dist/index.js');
const audioContext = new AudioContext();

describe('VirtualAudioGraph', function () {
  it('optionally takes audioContext property', function () {
    expect(new VirtualAudioGraph({audioContext: audioContext}).audioContext).toBe(audioContext);
    expect(new VirtualAudioGraph().audioContext instanceof AudioContext).toBe(true);
  });

  it('optionally takes output parameter', function () {
    expect(new VirtualAudioGraph({
      output: audioContext.destination,
    }).output).toBe(audioContext.destination);
    expect(new VirtualAudioGraph({audioContext: audioContext}).output).toBe(audioContext.destination);
  });
});
