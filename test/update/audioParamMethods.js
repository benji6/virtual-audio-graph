/* global AudioContext */
const test = require('tape')
require('../WebAudioTestAPISetup')
const createVirtualAudioGraph = require('../..')

test('update - single setValueAtTime', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: ['setValueAtTime', 0.5, 1]}],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [
      {gain: {inputs: [], value: 1}, inputs: [], name: 'GainNode'},
    ],
    name: 'AudioDestinationNode',
  })
  const gain = virtualAudioGraph.getAudioNodeById(0).gain
  t.is(gain.$valueAtTime('00:00.000'), 1)
  t.is(gain.$valueAtTime('00:00.999'), 1)
  t.is(gain.$valueAtTime('00:01.000'), 0.5)
  t.is(gain.$valueAtTime('23:59.999'), 0.5)
  t.end()
})

test('update - multiple setValueAtTime', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: [['setValueAtTime', 0, 0],
                                  ['setValueAtTime', 1, 1],
                                  ['setValueAtTime', 0.5, 2]]}],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [
      {gain: {inputs: [], value: 0}, inputs: [], name: 'GainNode'},
    ],
    name: 'AudioDestinationNode',
  })
  const gain = virtualAudioGraph.getAudioNodeById(0).gain
  t.is(gain.$valueAtTime('00:00.000'), 0)
  t.is(gain.$valueAtTime('00:00.999'), 0)
  t.is(gain.$valueAtTime('00:01.000'), 1)
  t.is(gain.$valueAtTime('00:01.999'), 1)
  t.is(gain.$valueAtTime('00:02.000'), 0.5)
  t.is(gain.$valueAtTime('23:59.999'), 0.5)
  t.end()
})

test('update - overides setValueAtTime', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: ['setValueAtTime', 0.5, 1]}],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [
      {gain: {inputs: [], value: 1}, inputs: [], name: 'GainNode'},
    ],
    name: 'AudioDestinationNode',
  })
  const gain = virtualAudioGraph.getAudioNodeById(0).gain
  t.is(gain.$valueAtTime('00:00.000'), 1)
  t.is(gain.$valueAtTime('00:00.999'), 1)
  t.is(gain.$valueAtTime('00:01.000'), 0.5)
  t.is(gain.$valueAtTime('23:59.999'), 0.5)
  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: ['setValueAtTime', 0.75, 0.5]}],
  })
  t.is(gain.$valueAtTime('00:00.000'), 1)
  t.is(gain.$valueAtTime('00:00.499'), 1)
  t.is(gain.$valueAtTime('00:00.500'), 0.75)
  t.is(gain.$valueAtTime('23:59.999'), 0.75)
  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: ['setValueAtTime', 0.75, 1]}],
  })
  t.is(gain.$valueAtTime('00:00.000'), 1)
  t.is(gain.$valueAtTime('00:00.999'), 1)
  t.is(gain.$valueAtTime('00:01.000'), 0.75)
  t.is(gain.$valueAtTime('23:59.999'), 0.75)
  t.end()
})

test('update - setValueAtTime with linearRampToValueAtTime', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: [['setValueAtTime', 0.25, 0.25],
                                  ['linearRampToValueAtTime', 0.5, 0.5]]}],
  })
  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: [['setValueAtTime', 0, 0],
                                  ['linearRampToValueAtTime', 1, 1]]}],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [
      {gain: {inputs: [], value: 0}, inputs: [], name: 'GainNode'},
    ],
    name: 'AudioDestinationNode',
  })
  const gain = virtualAudioGraph.getAudioNodeById(0).gain
  t.is(gain.$valueAtTime('00:00.000'), 0)
  t.is(gain.$valueAtTime('00:00.001'), 0.001)
  t.is(gain.$valueAtTime('00:00.250'), 0.25)
  t.is(gain.$valueAtTime('00:00.500'), 0.5)
  t.is(gain.$valueAtTime('00:00.750'), 0.75)
  t.is(gain.$valueAtTime('00:00.999'), 0.999)
  t.is(gain.$valueAtTime('00:01.000'), 1)
  t.is(gain.$valueAtTime('23:59.999'), 1)
  t.end()
})

test('update - setValueAtTime with exponentialRampToValueAtTime', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})

  virtualAudioGraph.update({
    0: ['oscillator', 'output', {frequency: [['setValueAtTime', 220, 0],
                                             ['exponentialRampToValueAtTime', 1320, 5]]}],
  })
  virtualAudioGraph.update({
    0: ['oscillator', 'output', {frequency: [['setValueAtTime', 440, 0],
                                             ['exponentialRampToValueAtTime', 880, 1]]}],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [
      {
        detune: {inputs: [], value: 0},
        frequency: {inputs: [], value: 440},
        inputs: [],
        name: 'OscillatorNode',
        type: 'sine',
      },
    ],
    name: 'AudioDestinationNode',
  })
  const frequency = virtualAudioGraph.getAudioNodeById(0).frequency
  t.is(frequency.$valueAtTime('00:00.000'), 440)
  t.is(frequency.$valueAtTime('00:00.001'), 440.30509048353554)
  t.is(frequency.$valueAtTime('00:00.250'), 523.2511306011972)
  t.is(frequency.$valueAtTime('00:00.500'), 622.2539674441618)
  t.is(frequency.$valueAtTime('00:00.750'), 739.9888454232688)
  t.is(frequency.$valueAtTime('00:00.999'), 879.3902418315982)
  t.is(frequency.$valueAtTime('00:01.000'), 880)
  t.is(frequency.$valueAtTime('23:59.999'), 880)
  t.end()
})

test('update - setValueAtTime with setTargetAtTime', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: [['setValueAtTime', 0, 0],
                                  ['setTargetAtTime', 1, 1, 0.75]]}],
  })
  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: [['setValueAtTime', 0, 0],
                                  ['setTargetAtTime', 1, 1, 0.5]]}],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [
      {gain: {inputs: [], value: 0}, inputs: [], name: 'GainNode'},
    ],
    name: 'AudioDestinationNode',
  })
  const gain = virtualAudioGraph.getAudioNodeById(0).gain
  t.is(gain.$valueAtTime('00:00.000'), 0)
  t.is(gain.$valueAtTime('00:01.000'), 0)
  t.is(gain.$valueAtTime('00:01.100'), 0.1812692469220183)
  t.is(gain.$valueAtTime('00:02.000'), 0.8646647167633873)
  t.is(gain.$valueAtTime('00:03.000'), 0.9816843611112658)
  t.is(gain.$valueAtTime('00:05.000'), 0.9996645373720975)
  t.is(gain.$valueAtTime('00:08.000'), 0.9999991684712809)
  t.is(gain.$valueAtTime('00:13.000'), 0.9999999999622486)
  t.is(gain.$valueAtTime('01:00.000'), 1)
  t.is(gain.$valueAtTime('23:59.999'), 1)
  t.end()
})

test('update - setValueAtTime with setValueCurveAtTime', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})

  const waveArray0 = Float32Array.of(0, 0.2, 0.4, 0.8)
  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: [['setValueAtTime', 0, 0],
                                  ['setValueCurveAtTime', waveArray0, 1, 1]]}],
  })
  const waveArray1 = Float32Array.of(0.5, 0.75, 0.25, 1)
  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: [['setValueAtTime', 0, 0],
                                  ['setValueCurveAtTime', waveArray1, 1, 1]]}],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [
      {gain: {inputs: [], value: 0}, inputs: [], name: 'GainNode'},
    ],
    name: 'AudioDestinationNode',
  })
  const gain = virtualAudioGraph.getAudioNodeById(0).gain
  t.is(gain.$valueAtTime('00:00.000'), 0)
  t.is(gain.$valueAtTime('00:00.999'), 0)
  t.is(gain.$valueAtTime('00:01.000'), 0.5)
  t.is(gain.$valueAtTime('00:01.240'), 0.5)
  t.is(gain.$valueAtTime('00:01.250'), 0.75)
  t.is(gain.$valueAtTime('00:01.490'), 0.75)
  t.is(gain.$valueAtTime('00:01.500'), 0.25)
  t.is(gain.$valueAtTime('00:01.749'), 0.25)
  t.is(gain.$valueAtTime('00:01.750'), 1)
  t.is(gain.$valueAtTime('23:59.999'), 1)
  t.end()
})
