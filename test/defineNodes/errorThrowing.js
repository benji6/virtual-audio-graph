/* global AudioContext */
const test = require('tape')
require('../WebAudioTestAPISetup')
const createVirtualAudioGraph = require('../..')
const pingPongDelay = require('../utils/pingPongDelay')

const audioContext = new AudioContext()
const virtualAudioGraph = createVirtualAudioGraph({audioContext})

test('defineNodes - does not throw if name provided is a standard node', t => {
  t.doesNotThrow(() => virtualAudioGraph.defineNodes({gain: pingPongDelay}))
  t.end()
})
