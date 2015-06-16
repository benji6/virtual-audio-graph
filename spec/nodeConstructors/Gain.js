const audioContext = require('../tools/audioContext');
const Gain = require('../../src/nodeConstructors/Gain');

describe("Gain", () => {
  var virtualNode;

  beforeEach(() => {
    virtualNode = new Gain(audioContext);
  });

  it("is called with an audioContext and returns an object with a gain node on the audioNode property", () => {
    expect(virtualNode.audioNode.constructor).toBe(GainNode);
  });
});
