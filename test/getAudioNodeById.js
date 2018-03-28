/* global AudioContext GainNode */
const test = require('tape')
require('./WebAudioTestAPISetup')
const V = require('..')
const createVirtualAudioGraph = V.default

test('virtualAudioGraph instance - getAudioNodeById', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})

  virtualAudioGraph.update({0: V.gain('output')})

  t.is(virtualAudioGraph.getAudioNodeById(0).constructor, GainNode)
  t.end()
})
