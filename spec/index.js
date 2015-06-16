const audioContext = require('./tools/audioContext');
const VirtualAudioGraph = require('../src/index.js');

describe("VirtualAudioGraph", () => {
  it("takes audioContext property and returns an object with that same audio context as a property", () => {
    const virtualAudioGraph = new VirtualAudioGraph({audioContext});
    expect(virtualAudioGraph.audioContext).toBe(audioContext);
  });

  it("takes audio node destination parameter", () => {
    const virtualAudioGraph = new VirtualAudioGraph({
      destination: audioContext.destination,
    });
    expect(virtualAudioGraph.destination).toBe(audioContext.destination);
  });
});

describe("virtualAudioGraph.update", () => {
  var virtualAudioGraph;

  beforeEach(() => {
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext,
      destination: audioContext.destination,
    });
  });

  it('throws an error when virtual node name property is not recognised', () => {
    const virtualNode = {
      name: 'qwerty',
      connections: [0],
    };
    expect(() => virtualAudioGraph.update(virtualNode)).toThrow();
  });

  it('creates specified virtual nodes and stores them in virtualAudioGraph property which is an array', () => {
    const virtualNodeParams = [{
      id: 1,
      name: 'gain',
      connections: 0,
    },
    {
      id: 2,
      name: 'oscillator',
      connections: 1,
    }];
    virtualAudioGraph.update(virtualNodeParams);
    expect(Array.isArray(virtualAudioGraph.virtualAudioGraph)).toBe(true);
  });

  it('can take object or array of objects and returns this', () => {
    const virtualNode = {
      name: 'oscillator',
      connections: [0],
    };
    expect(virtualAudioGraph.update(virtualNode)).toBe(virtualAudioGraph);
  });
});