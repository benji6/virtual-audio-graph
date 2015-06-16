const audioContext = require('../tools/audioContext');
const Oscillator = require('../../src/nodeConstructors/Oscillator');

describe("Oscillator", () => {
  var virtualNode;

  beforeEach(() => {
    virtualNode = new Oscillator(audioContext);
  });

  it("is called with an audioContext and returns an object with an oscillator node on the audioNode property", () => {
    expect(virtualNode.audioNode.constructor).toBe(OscillatorNode);
  });
});
