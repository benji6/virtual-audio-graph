require('web-audio-test-api');
/* global WebAudioTestAPI*/
WebAudioTestAPI.setState('AudioContext#createStereoPanner', 'enabled');
const Benchmark = require('benchmark');
const PublishedVirtualAudioGraph = require('virtual-audio-graph');
const DevelopmentVirtualAudioGraph = require('./dist/VirtualAudioGraph');
const pingPongDelayParamsFactory = require('./spec/tools/pingPongDelayParamsFactory');

const runBenchmarkCode = function (virtualAudioGraph) {
  const quietpingPongDelayParamsFactory = function () {
    return {
      0: {
        node: 'gain',
        output: 'output',
      },
      1: {
        node: 'pingPongDelay',
        output: 0,
      },
      2: {
        node: 'oscillator',
        output: 1,
      },
    };
  };

  virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');
  virtualAudioGraph.defineNode(quietpingPongDelayParamsFactory, 'quietPingPongDelay');

  virtualAudioGraph.update({
    0: {
      node: 'gain',
      output: 'output',
    },
  });

  virtualAudioGraph.update({
    0: {
      node: 'gain',
      output: 'output',
      params: {
        gain: 0.5,
      },
    },
    1: {
      node: 'quietPingPongDelay',
      output: 0,
    },
    2: {
      node: 'pingPongDelay',
      output: 1,
    },
    3: {
      node: 'oscillator',
      output: 2,
    },
  });

  virtualAudioGraph.update({
    0: {
      node: 'gain',
      output: 'output',
    },
  });

  virtualAudioGraph.update({
    0: {
      node: 'gain',
      output: 'output',
      params: {
        gain: 0.5,
      },
    },
    1: {
      node: 'oscillator',
      output: 0,
      params: {
        type: 'triangle',
        frequency: 1720,
        detune: 14,
      },
    },
    2: {
      node: 'oscillator',
      output: 0,
      params: {
        type: 'square',
        frequency: 880,
        detune: -2,
      },
    },
    3: {
      node: 'oscillator',
      output: 0,
      params: {
        type: 'sine',
        frequency: 440,
        detune: 1,
      },
    },
    4: {
      node: 'oscillator',
      output: 0,
      params: {
        type: 'sawtooth',
        frequency: 220,
        detune: -20,
      },
    },
  });

  virtualAudioGraph.update({
    0: {
      node: 'gain',
      output: 'output',
    },
  });

  virtualAudioGraph.update({
    0: {
      node: 'gain',
      output: 'output',
      params: {
        gain: 0.5,
      },
    },
    1: {
      node: 'pingPongDelay',
      output: 0,
    },
    2: {
      node: 'oscillator',
      output: 1,
      params: {
        type: 'triangle',
        frequency: 1720,
        detune: 14,
      },
    },
    3: {
      node: 'oscillator',
      output: 1,
      params: {
        type: 'square',
        frequency: 880,
        detune: -2,
      },
    },
    4: {
      node: 'oscillator',
      output: 1,
      params: {
        type: 'sine',
        frequency: 440,
        detune: 1,
      },
    },
    5: {
      node: 'oscillator',
      output: 1,
      params: {
        type: 'sawtooth',
        frequency: 220,
        detune: -20,
      },
    },
  });

  virtualAudioGraph.update({
    0: {
      node: 'gain',
      output: 'output',
    },
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
