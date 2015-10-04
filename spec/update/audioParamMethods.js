/* global beforeEach describe expect it */
import createVirtualAudioGraph from '../../src/index.js';

describe('virtualAudioGraph.update - AudioParam Methods', () => {
  let audioContext;
  let virtualAudioGraph;
  beforeEach(() => {
    audioContext = new AudioContext();
    virtualAudioGraph = createVirtualAudioGraph({audioContext});
  });

  it('single setValueAtTime', () => {
    virtualAudioGraph.update({
      0: ['gain', 'output', {gain: ['setValueAtTime', 0.5, 1],
    }]});
    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode', inputs: [
        {name: 'GainNode', gain: {value: 1, inputs: []}, inputs: []},
      ],
    });
    const {gain} = virtualAudioGraph.getAudioNodeById(0);
    expect(gain.$valueAtTime('00:00.000')).toBe(1);
    expect(gain.$valueAtTime('00:00.999')).toBe(1);
    expect(gain.$valueAtTime('00:01.000')).toBe(0.5);
    expect(gain.$valueAtTime('23:59.999')).toBe(0.5);
  });

  it('multiple setValueAtTime', () => {
    virtualAudioGraph.update({
      0: ['gain', 'output', {gain: [['setValueAtTime', 0, 0],
                                    ['setValueAtTime', 1, 1],
                                    ['setValueAtTime', 0.5, 2]],
    }]});
    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode', inputs: [
        {name: 'GainNode', gain: {value: 0, inputs: []}, inputs: []},
      ],
    });
    const {gain} = virtualAudioGraph.getAudioNodeById(0);
    expect(gain.$valueAtTime('00:00.000')).toBe(0);
    expect(gain.$valueAtTime('00:00.999')).toBe(0);
    expect(gain.$valueAtTime('00:01.000')).toBe(1);
    expect(gain.$valueAtTime('00:01.999')).toBe(1);
    expect(gain.$valueAtTime('00:02.000')).toBe(0.5);
    expect(gain.$valueAtTime('23:59.999')).toBe(0.5);
  });
});

// test for setting multiple at the same time
// test for updating
