/* global beforeEach describe expect it */
const VirtualAudioGraph = require('../../dist/index.js');
const pingPongDelayParamsFactory = require('../tools/pingPongDelayParamsFactory');

describe('virtualAudioGraph.defineNode - error throwing', function () {
  var audioContext;
  var virtualAudioGraph;

  beforeEach(function () {
    audioContext = new AudioContext();
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext: audioContext,
      output: audioContext.destination,
    });
  });

  it('throws if name provided is a standard node', function () {
    expect(function () {
      virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'gain');
    }).toThrow();
  });
});
