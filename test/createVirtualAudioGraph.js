/* global AudioContext */
const test = require('tape')
require('./WebAudioTestAPISetup')
const V = require('..')

const audioContext = new AudioContext()

test('createVirtualAudioGraph - optionally takes audioContext property', t => {
  t.true(V.default({audioContext}).audioContext === audioContext)
  t.false(V.default().audioContext === audioContext)
  t.true(V.default().audioContext instanceof AudioContext)
  t.end()
})

test('createVirtualAudioGraph - optionally takes output parameter', t => {
  const gain = audioContext.createGain()

  V.default({audioContext, output: gain}).update({
    0: V.gain('output', {gain: 0.2}),
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
  V.default({audioContext}).update({
    0: V.gain('output', {gain: 0.2}),
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
