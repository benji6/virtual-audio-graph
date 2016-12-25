/* global AudioContext */
const test = require('tape')
require('./WebAudioTestAPISetup')

const createVirtualAudioGraph = require('..')
const audioContext = new AudioContext()

test('createVirtualAudioGraph - optionally takes audioContext property', t => {
  t.true(createVirtualAudioGraph({audioContext}).audioContext === audioContext)
  t.false(createVirtualAudioGraph().audioContext === audioContext)
  t.true(createVirtualAudioGraph().audioContext instanceof AudioContext)
  t.end()
})

test('createVirtualAudioGraph - optionally takes output parameter', t => {
  const gain = audioContext.createGain()

  createVirtualAudioGraph({audioContext, output: gain}).update({
    0: ['gain', 'output', {gain: 0.2}],
  })

  t.deepEqual(gain.toJSON(), {
    gain: {inputs: [], value: 1},
    inputs: [
      {
        gain: Object({inputs: [], value: 0.2}),
        inputs: [],
        name: 'GainNode',
      },
    ],
    name: 'GainNode',
  })
  createVirtualAudioGraph({audioContext}).update({
    0: ['gain', 'output', {gain: 0.2}],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [
      {
        gain: {inputs: [], value: 0.2},
        inputs: [],
        name: 'GainNode',
      },
    ],
    name: 'AudioDestinationNode',
  })
  t.end()
})
