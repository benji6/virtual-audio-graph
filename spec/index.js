const VirtualAudioGraph = require('../src/index.js');

console.log(VirtualAudioGraph);
console.log("VirtualAudioGraph");

describe("VirtualAudioGraph", () => {
  it("is a constructor which takes an audio context and returns an object with that same audio context as a property", () => {
    const audioContext = new AudioContext();
    const virtualAudioGraph = new VirtualAudioGraph(audioContext);
    expect(typeof VirtualAudioGraph).toBe("function");
    expect(typeof virtualAudioGraph).toBe("object");
    expect(virtualAudioGraph.audioContext).toBe(audioContext);
  });
});
