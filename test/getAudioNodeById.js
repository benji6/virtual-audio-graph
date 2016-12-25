/* global AudioContext GainNode */
require('./WebAudioTestAPISetup')
const test = require('tape')
const V = require('..')

test('virtualAudioGraph instance - getAudioNodeById', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = V.default({audioContext})

  virtualAudioGraph.update({0: V.gain('output')})

  t.is(virtualAudioGraph.getAudioNodeById(0).constructor, GainNode)
  t.end()
})
