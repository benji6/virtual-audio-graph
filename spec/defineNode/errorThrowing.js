/* global describe expect it */
const VirtualAudioGraph = require('../../dist/index.js');
const pingPongDelayParamsFactory = require('../tools/pingPongDelayParamsFactory');

describe('virtualAudioGraph.defineNode - error throwing', function () {
  it('throws if name provided is a standard node', function () {
    const audioContext = new AudioContext();
    const virtualAudioGraph = new VirtualAudioGraph({
      audioContext: audioContext,
      output: audioContext.destination,
    });

    expect(function () {
      virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'gain');
    }).toThrow();
  });
});
