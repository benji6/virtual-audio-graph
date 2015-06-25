const VirtualAudioGraph = require('../src/index.js');
const audioContext = new AudioContext();

describe("VirtualAudioGraph", () => {
  it("optionally takes audioContext property", () => {
    expect(new VirtualAudioGraph({audioContext}).audioContext).toBe(audioContext);
    expect(new VirtualAudioGraph().audioContext instanceof AudioContext).toBe(true);
  });

  it("optionally takes output parameter", () => {
    expect(new VirtualAudioGraph({
      output: audioContext.destination,
    }).output).toBe(audioContext.destination);
    expect(new VirtualAudioGraph({audioContext}).output).toBe(audioContext.destination);
  });
});
