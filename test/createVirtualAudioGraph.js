/* global AudioContext */
const test = require('tape')
require('./WebAudioTestAPISetup')

const createVirtualAudioGraph = require('..')
const audioContext = new AudioContext()

test('createVirtualAudioGraph - optionally takes audioContext property', t => {
  t.is(createVirtualAudioGraph({audioContext}).audioContext, audioContext)
  t.true(createVirtualAudioGraph().audioContext instanceof AudioContext)
  t.end()
})

test('createVirtualAudioGraph - optionally takes output parameter', t => {
  const gain = audioContext.createGain()

  createVirtualAudioGraph({audioContext, output: gain}).update({
    0: ['gain', 'output', {gain: 0.2}]
  })

  t.deepEqual(gain.toJSON(), {
    name: 'GainNode',
    gain: {value: 1, inputs: []},
    inputs: [
      {
        name: 'GainNode',
        gain: Object({value: 0.2, inputs: []}),
        inputs: []
      }
    ]
  })
  createVirtualAudioGraph({audioContext}).update({
    0: ['gain', 'output', {gain: 0.2}]
  })
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [
      {
        name: 'GainNode',
        gain: {value: 0.2, inputs: []},
        inputs: []
      }
    ]
  })
  t.end()
})
