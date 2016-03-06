/* global AudioContext */
const test = require('tape')
require('../WebAudioTestAPISetup')
const createVirtualAudioGraph = require('../..')

const audioContext = new AudioContext()
const virtualAudioGraph = createVirtualAudioGraph({audioContext})

test('update - throws an error if no output is provided', t => {
  t.throws(_ => virtualAudioGraph.update({0: ['gain']}))
  t.end()
})

test('update - throws an error when virtual node name property is not recognised', t => {
  t.throws(_ => virtualAudioGraph.update({0: ['foobar', 'output']}))
  t.end()
})

test('update - throws an error when id is "output"', t => {
  t.throws(_ => virtualAudioGraph.update({output: ['gain', 'output']}))
  t.end()
})

test('update - throws an error when id is "output"', t => {
  t.throws(_ => virtualAudioGraph.update({
    0: ['oscillator', 'output'],
    1: undefined
  }))
  t.throws(_ => virtualAudioGraph.update({
    0: ['oscillator', 'output'],
    1: null
  }))
  t.end()
})

test('update - throws an error when output is an object and key is not specified', t => {
  t.throws(_ => virtualAudioGraph.update({
    0: ['gain', ['output'], {gain: 0.2}],
    1: ['oscillator', 0, {frequency: 120}],
    2: ['gain', {id: 1, destination: 'frequency'}, {gain: 1024}],
    3: ['oscillator', 2, {frequency: 100}]
  }))
  t.end()
})

test('update - throws an error when output is an object and key is not specified', t => {
  const params = {numberOfOutputs: 2}

  t.throws(_ => virtualAudioGraph.update({
    0: ['channelMerger', 'output', params],
    1: ['oscillator', 'output'],
    2: ['channelSplitter', {key: 0, outputs: [0, 1, 2], inputs: [1, 0]}, params]
  }))
  t.end()
})
