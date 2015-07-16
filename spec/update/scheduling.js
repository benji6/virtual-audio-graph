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

  it('oscillators with no start or stop times are played immediately and forever', function () {
    const virtualNodeParams = [
      {
        id: 0,
        node: 'oscillator',
        output: 'output',
      },
      {
        id: 1,
        node: 'oscillator',
        output: 'output',
      },
    ];

    virtualAudioGraph.update(virtualNodeParams);
    R.forEach(function (virtualNode) {
      const audioNode = virtualNode.audioNode;
      expect(audioNode.$stateAtTime('00:00.000')).toBe('PLAYING');
      expect(audioNode.$stateAtTime('00:00.099')).toBe('PLAYING');
      expect(audioNode.$stateAtTime('00:00.100')).toBe('PLAYING');
      expect(audioNode.$stateAtTime('00:00.199')).toBe('PLAYING');
      expect(audioNode.$stateAtTime('00:00.200')).toBe('PLAYING');
      expect(audioNode.$stateAtTime('23:59.999')).toBe('PLAYING');
    }, virtualAudioGraph.virtualNodes);
  });

  it('oscillators with no start times but with stop times are played immediately until their stop time', function () {
    const virtualNodeParams = [
      {
        id: 0,
        node: 'oscillator',
        output: 'output',
        params: {
          stopTime: 0.2,
        },
      },
      {
        id: 1,
        node: 'oscillator',
        output: 'output',
        params: {
          stopTime: 0.2,
        },
      },
    ];

    virtualAudioGraph.update(virtualNodeParams);
    R.forEach(function (virtualNode) {
      const audioNode = virtualNode.audioNode;
      expect(audioNode.$stateAtTime('00:00.000')).toBe('PLAYING');
      expect(audioNode.$stateAtTime('00:00.099')).toBe('PLAYING');
      expect(audioNode.$stateAtTime('00:00.100')).toBe('PLAYING');
      expect(audioNode.$stateAtTime('00:00.199')).toBe('PLAYING');
      expect(audioNode.$stateAtTime('00:00.200')).toBe('FINISHED');
      expect(audioNode.$stateAtTime('23:59.999')).toBe('FINISHED');
    }, virtualAudioGraph.virtualNodes);
  });

  it('oscillators with start times but no stop times are played at their start time then forever', function () {
    const virtualNodeParams = [
      {
        id: 0,
        node: 'oscillator',
        output: 'output',
        params: {
          startTime: 0.1,
        },
      },
      {
        id: 1,
        node: 'oscillator',
        output: 'output',
        params: {
          startTime: 0.1,
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
      expect(audioNode.$stateAtTime('00:00.200')).toBe('PLAYING');
      expect(audioNode.$stateAtTime('23:59.999')).toBe('PLAYING');
    }, virtualAudioGraph.virtualNodes);
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
