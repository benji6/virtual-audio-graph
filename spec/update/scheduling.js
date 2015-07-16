/* global beforeEach describe expect it */
const R = require('ramda');
const VirtualAudioGraph = require('../../dist/index.js');

describe('virtualAudioGraph.update - scheduling', function () {
  var audioContext;
  var virtualAudioGraph;

  beforeEach(function () {
    audioContext = new AudioContext();
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext: audioContext,
      output: audioContext.destination,
    });
  });

  it('works when scheduling a single oscillator\'s start and stop times', function () {
    const virtualNodeParams = [
      {
        id: 0,
        node: 'oscillator',
        output: 'output',
        params: {
          startTime: 0.1,
          stopTime: 0.2,
        },
      },
    ];

    virtualAudioGraph.update(virtualNodeParams);
    const audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.$stateAtTime('00:00.000')).toBe('SCHEDULED');
    expect(audioNode.$stateAtTime('00:00.099')).toBe('SCHEDULED');
    expect(audioNode.$stateAtTime('00:00.100')).toBe('PLAYING');
    expect(audioNode.$stateAtTime('00:00.199')).toBe('PLAYING');
    expect(audioNode.$stateAtTime('00:00.200')).toBe('FINISHED');
  });

  it('works when scheduling multiple oscillators\' start and stop times', function () {
    const virtualNodeParams = [
      {
        id: 0,
        node: 'oscillator',
        output: 'output',
        params: {
          startTime: 0.1,
          stopTime: 0.2,
        },
      },
      {
        id: 1,
        node: 'oscillator',
        output: 'output',
        params: {
          startTime: 0.1,
          stopTime: 0.2,
        },
      },
      {
        id: 2,
        node: 'oscillator',
        output: 'output',
        params: {
          startTime: 0.1,
          stopTime: 0.2,
        },
      },
    ];

    virtualAudioGraph.update(virtualNodeParams);
    R.forEach(function (virtualNode) {
      const audioNode = virtualNode.audioNode;
      expect(audioNode.$stateAtTime('00:00.000')).toBe('SCHEDULED');
      expect(audioNode.$stateAtTime('00:00.099')).toBe('SCHEDULED');
      expect(audioNode.$stateAtTime('00:00.100')).toBe('PLAYING');
      expect(audioNode.$stateAtTime('00:00.199')).toBe('PLAYING');
      expect(audioNode.$stateAtTime('00:00.200')).toBe('FINISHED');
    }, virtualAudioGraph.virtualNodes);
  });
});
