const audioContext = require('./tools/audioContext');
const VirtualAudioGraph = require('../src/index.js');

describe("VirtualAudioGraph", () => {
  it("is a constructor which takes an audio context and returns an object with that same audio context as a property", () => {
    const virtualAudioGraph = new VirtualAudioGraph(audioContext);
    expect(virtualAudioGraph.audioContext).toBe(audioContext);
  });

  it("creates a new audioContext if one is not supplied", () => {
    const virtualAudioGraph = new VirtualAudioGraph();
    expect(virtualAudioGraph.audioContext.constructor).toBe(AudioContext);
  });
});

describe("virtualAudioGraph.update", () => {
  var virtualAudioGraph;

  beforeEach(() => {
    virtualAudioGraph = new VirtualAudioGraph();
  });

  it('throws an error when virtualNode name property is not recognised', () => {
    const virtualNode = {
      name: 'qwerty',
    };
    expect(() => virtualAudioGraph.update(virtualNode)).toThrow();
  });

  it('creates specified virtualNode and stores it in audioGraph property which is an array', () => {
    const virtualNode = {
      name: 'oscillator',
    };
    virtualAudioGraph.update(virtualNode);
    expect(Array.isArray(virtualAudioGraph.audioGraph)).toBe(true);
    expect(typeof virtualAudioGraph.audioGraph[0]).toBe('object');
  });

  it('returns this', () => {
    const virtualNode = {
      name: 'oscillator',
    };
    expect(virtualAudioGraph.update(virtualNode)).toBe(virtualAudioGraph);
  });
});

describe("VirtualNodeConstructors", () => {
  require('./nodeConstructors/Gain');
  require('./nodeConstructors/Oscillator');
});
