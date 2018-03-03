/* global AudioContext */
const test = require('tape')
require('../WebAudioTestAPISetup')
const V = require('../..')
const createVirtualAudioGraph = V.default

const audioContext = new AudioContext()
const virtualAudioGraph = createVirtualAudioGraph({audioContext})

test('update - throws an error if no output is provided', t => {
  t.throws(() => virtualAudioGraph.update({0: V.gain()}))
  t.end()
})

test('update - throws an error when virtual node name property is not recognised', t => {
  t.throws(() => virtualAudioGraph.update({0: V.foobar('output')}))
  t.end()
})

test('update - throws an error when id is "output"', t => {
  t.throws(() => virtualAudioGraph.update({output: V.gain('output')}))
  t.end()
})

test('update - throws an error when id is "output"', t => {
  t.throws(() => virtualAudioGraph.update({
    0: V.oscillator('output'),
    1: undefined,
  }))
  t.throws(() => virtualAudioGraph.update({
    0: V.oscillator('output'),
    1: null,
  }))
  t.end()
})

test('update - throws an error when output is an object and key is not specified', t => {
  t.throws(() => virtualAudioGraph.update({
    0: V.gain(['output'], {gain: 0.2}),
    1: V.oscillator(0, {frequency: 120}),
    2: V.gain({destination: 'frequency', id: 1}, {gain: 1024}),
    3: V.oscillator(2, {frequency: 100}),
  }))
  t.end()
})

test('update - throws an error when output is an object and key is not specified', t => {
  const params = {numberOfOutputs: 2}

  t.throws(() => virtualAudioGraph.update({
    0: V.channelMerger('output', params),
    1: V.oscillator('output'),
    2: V.channelSplitter({inputs: [1, 0], key: 0, outputs: [0, 1, 2]}, params),
  }))
  t.end()
})
