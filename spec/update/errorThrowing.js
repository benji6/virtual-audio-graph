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
    const virtualNodeParams = [{
      node: 'gain',
      output: 'output',
    }];
    expect(function () {
      virtualAudioGraph.update(virtualNodeParams);
    }).toThrow();
  });

  it('throws an error if no output is provided', function () {
    const virtualNodeParams = [{
      node: 'gain',
      id: 1,
    }];
    expect(function () {
      virtualAudioGraph.update(virtualNodeParams);
    }).toThrow();
  });

  it('throws an error when virtual node name property is not recognised', function () {
    const virtualNodeParams = [{
      id: 0,
      node: 'foobar',
      output: 'output',
    }];
    expect(function () {
      virtualAudioGraph.update(virtualNodeParams);
    }).toThrow();
  });
});
