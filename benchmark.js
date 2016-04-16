require('web-audio-test-api')
/* global WebAudioTestAPI*/
WebAudioTestAPI.setState('AudioContext#createStereoPanner', 'enabled')
const Benchmark = require('benchmark')
const createPublishedVirtualAudioGraph = require('virtual-audio-graph')
const createDevelopmentVirtualAudioGraph = require('./dist/index')
const pingPongDelay = require('./test/utils/pingPongDelay')

const runBenchmarkCode = function (virtualAudioGraph) {
  virtualAudioGraph.update({0: ['gain', 'output']})

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: 0.5}],
    1: ['oscillator', 0, {type: 'triangle',
                          frequency: 1720,
                          detune: 14}],
    2: ['oscillator', 0, {type: 'square',
                          frequency: 880,
                          detune: -2}],
    3: ['oscillator', 0, {type: 'sine',
                          frequency: 440,
                          detune: 1}],
    4: ['oscillator', 0, {type: 'sawtooth',
                          frequency: 220,
                          detune: -20}]
  })

  virtualAudioGraph.update({0: ['gain', 'output']})

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: 0.5}],
    1: [pingPongDelay, 0],
    2: ['oscillator', 1, {type: 'triangle',
                          frequency: 1720,
                          detune: 14}],
    3: ['oscillator', 1, {type: 'square',
                          frequency: 880,
                          detune: -2}],
    4: ['oscillator', 1, {type: 'sine',
                          frequency: 440,
                          detune: 1}],
    5: ['oscillator', 1, {type: 'sawtooth',
                          frequency: 220,
                          detune: -20}]
  })

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: 0.5}],
    1: [pingPongDelay, 0],
    2: ['oscillator', 1, {type: 'triangle',
                          frequency: 123,
                          detune: 45}],
    3: ['oscillator', 1, {type: 'square',
                          frequency: 123,
                          detune: -23}],
    4: ['oscillator', 1, {type: 'sine',
                          frequency: 123,
                          detune: 12}],
    5: ['oscillator', 1, {type: 'sawtooth',
                          frequency: 123,
                          detune: -260}]
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
