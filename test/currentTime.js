/* global AudioContext */
const test = require('tape')
require('./WebAudioTestAPISetup')
const createVirtualAudioGraph = require('..')

const audioContext = new AudioContext()
test('virtualAudioGraph instance - has currentTime getter property', t => {
  t.is(
    createVirtualAudioGraph({audioContext}).currentTime,
    audioContext.currentTime
  )
  t.end()
})
