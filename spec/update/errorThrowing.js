/* global beforeEach describe expect it */
const VirtualAudioGraph = require('../../dist/index.js');

describe('virtualAudioGraph.update - error throwing conditions', function () {
  var audioContext;
  var virtualAudioGraph;

  beforeEach(function () {
    audioContext = new AudioContext();
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext: audioContext,
      output: audioContext.destination,
    });
  });

  it('throws an error if no id is provided', function () {
    expect(function () {
      virtualAudioGraph.update([{
        node: 'gain',
        output: 'output',
      }]);
    }).toThrow();
  });

  it('throws an error if no output is provided', function () {
    expect(function () {
      virtualAudioGraph.update([{
        node: 'gain',
        id: 1,
      }]);
    }).toThrow();
  });

  it('throws an error when virtual node name property is not recognised', function () {
    expect(function () {
      virtualAudioGraph.update([{
        id: 0,
        node: 'foobar',
        output: 'output',
      }]);
    }).toThrow();
  });

  it('throws an error when id is "output"', function () {
    expect(function () {
      virtualAudioGraph.update([{
        id: 'output',
        node: 'gain',
        output: 'output',
      }]);
    }).toThrow();
  });
});
