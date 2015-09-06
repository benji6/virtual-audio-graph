require('web-audio-test-api');
/* global WebAudioTestAPI*/
WebAudioTestAPI.setState('AudioContext#createStereoPanner', 'enabled');
const Benchmark = require('benchmark');
const PublishedVirtualAudioGraph = require('virtual-audio-graph');
const DevelopmentVirtualAudioGraph = require('./dist/index');
const pingPongDelayParamsFactory = require('./spec/tools/pingPongDelayParamsFactory');

const runBenchmarkCode = function (virtualAudioGraph) {
  const quietpingPongDelayParamsFactory = () => ({
    0: ['gain', 'output'],
    1: ['pingPongDelay', 0],
    2: ['oscillator', 1],
  });

  virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');
  virtualAudioGraph.defineNode(quietpingPongDelayParamsFactory, 'quietPingPongDelay');

  virtualAudioGraph.update({
    0: ['gain', 'output'],
  });

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: 0.5}],
    1: ['quietPingPongDelay', 0],
    2: ['pingPongDelay', 1],
    3: ['oscillator', 2],
  });

  virtualAudioGraph.update({
    0: ['gain', 'output'],
  });

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
                          detune: -20}],
  });

  virtualAudioGraph.update({
    0: ['gain', 'output'],
  });

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: 0.5}],
    1: ['pingPongDelay', 0],
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
                          detune: -20}],
  });

  virtualAudioGraph.update({
    0: ['gain', 'output'],
  });
};

new Benchmark.Suite()
  .add('PublishedVirtualAudioGraph', function () {
    runBenchmarkCode(new PublishedVirtualAudioGraph());
  })
  .add('DevelopmentVirtualAudioGraph', function() {
    runBenchmarkCode(new DevelopmentVirtualAudioGraph());
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  })
  .run({'async': true});
