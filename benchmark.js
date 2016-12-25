require('web-audio-test-api')
/* global WebAudioTestAPI   */
/* eslint-disable no-console */
WebAudioTestAPI.setState('AudioContext#createStereoPanner', 'enabled')
const Benchmark = require('benchmark')
const createPublishedVirtualAudioGraph = require('virtual-audio-graph')
const createDevelopmentVirtualAudioGraph = require('./dist/index')
const pingPongDelay = require('./test/utils/pingPongDelay')

const runBenchmarkCode = function (virtualAudioGraph) {
  virtualAudioGraph.update({0: ['gain', 'output']})

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: 0.5}],
    1: ['oscillator', 0, {
      detune: 14,
      frequency: 1720,
      type: 'triangle',
    }],
    2: ['oscillator', 0, {
      detune: -2,
      frequency: 880,
      type: 'square',
    }],
    3: ['oscillator', 0, {
      detune: 1,
      frequency: 440,
      type: 'sine',
    }],
    4: ['oscillator', 0, {
      detune: -20,
      frequency: 220,
      type: 'sawtooth',
    }],
  })

  virtualAudioGraph.update({0: ['gain', 'output']})

  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['oscillator', {destination: 'gain', key: 0}, {frequency: 100}],
  })

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: 0.5}],
    1: [pingPongDelay, 0],
    2: ['oscillator', 1, {
      detune: 14,
      frequency: 1720,
      type: 'triangle',
    }],
    3: ['oscillator', 1, {
      detune: -2,
      frequency: 880,
      type: 'square',
    }],
    4: ['oscillator', 1, {
      detune: 1,
      frequency: 440,
      type: 'sine',
    }],
    5: ['oscillator', 1, {
      detune: -20,
      frequency: 220,
      type: 'sawtooth',
    }],
  })

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: 0.5}],
    1: [pingPongDelay, 0],
    2: ['oscillator', 1, {
      detune: 45,
      frequency: 123,
      type: 'triangle',
    }],
    3: ['oscillator', 1, {
      detune: -23,
      frequency: 123,
      type: 'square',
    }],
    4: ['oscillator', 1, {
      detune: 12,
      frequency: 123,
      type: 'sine',
    }],
    5: ['oscillator', 1, {
      detune: -260,
      frequency: 123,
      type: 'sawtooth',
    }],
  })

  virtualAudioGraph.update({0: ['gain', 'output']})
  virtualAudioGraph.update({})
}

new Benchmark.Suite()
  .add('PublishedVirtualAudioGraph', () => runBenchmarkCode(createPublishedVirtualAudioGraph()))
  .add('DevelopmentVirtualAudioGraph', () => runBenchmarkCode(createDevelopmentVirtualAudioGraph()))
  .on('cycle', event => console.log(String(event.target)))
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({async: true})
