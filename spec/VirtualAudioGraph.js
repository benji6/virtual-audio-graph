/* global describe expect it */
import createVirtualAudioGraph from '../src/index.js';
const audioContext = new AudioContext();

describe('createVirtualAudioGraph', () => {
  it('optionally takes audioContext property', () => {
    expect(createVirtualAudioGraph({audioContext}).audioContext).toBe(audioContext);
    expect(createVirtualAudioGraph().audioContext instanceof AudioContext).toBe(true);
  });

  it('optionally takes output parameter', () => {
    const gain = audioContext.createGain();
    createVirtualAudioGraph({
      audioContext,
      output: gain,
    }).update({
      0: ['gain', 'output', {gain: 0.2}],
    });
    expect(gain.toJSON()).toEqual({
      name: 'GainNode',
      gain: {value: 1, inputs: []},
      inputs: [
        {
          name: 'GainNode',
          gain: Object({value: 0.2, inputs: []}),
          inputs: [],
        },
      ],
    });
    createVirtualAudioGraph({audioContext}).update({
      0: ['gain', 'output', {gain: 0.2}],
    });
    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [
        {
          name: 'GainNode',
          gain: {value: 0.2, inputs: []},
          inputs: [],
        },
      ],
    });
  });

  it('has a property called currentTime which returns the audioContext currentTime', () => {
    expect(createVirtualAudioGraph({audioContext}).currentTime).toBe(audioContext.currentTime);
  });

  it('has a method called getAudioNodeById which returns an AudioNode of with the given id', () => {
    const virtualAudioGraph = createVirtualAudioGraph({audioContext});

    virtualAudioGraph.update({
      0: ['gain', 'output'],
    });

    expect(virtualAudioGraph.getAudioNodeById(0).constructor).toBe(GainNode);
  });
});
