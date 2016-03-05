/* global AudioContext GainNode */
require('./WebAudioTestAPISetup')
const test = require('tape')
const createVirtualAudioGraph = require('..')

test('virtualAudioGraph instance - getAudioNodeById', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})

  virtualAudioGraph.update({0: ['gain', 'output']})

  t.is(virtualAudioGraph.getAudioNodeById(0).constructor, GainNode)
  t.end()
})
