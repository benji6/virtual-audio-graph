/* global AudioContext */
const test = require('tape')
require('../WebAudioTestAPISetup')
const pingPongDelay = require('../utils/pingPongDelay')
const sineOsc = require('../utils/sineOsc')
const createVirtualAudioGraph = require('../..')

const audioContext = new AudioContext()
const virtualAudioGraph = createVirtualAudioGraph({audioContext})

test('update - returns itself', t => {
  const virtualNodeParams = {0: ['oscillator', 'output', {type: 'square'}]}
  t.is(virtualAudioGraph.update(virtualNodeParams), virtualAudioGraph)
  t.end()
})

test('update - adds then removes nodes', t => {
  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['oscillator', 0],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [{
      gain: {inputs: [], value: 1},
      inputs: [{
        detune: {inputs: [], value: 0},
        frequency: {inputs: [], value: 440},
        inputs: [],
        name: 'OscillatorNode',
        type: 'sine',
      }],
      name: 'GainNode',
    }],
    name: 'AudioDestinationNode',
  })
  virtualAudioGraph.update({})
  t.deepEqual(audioContext.toJSON(), {
    inputs: [],
    name: 'AudioDestinationNode',
  })
  t.end()
})

test('update - handles random strings for ids', t => {
  virtualAudioGraph.update({
    bar: ['oscillator', 'foo'],
    foo: ['gain', 'output'],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [{
      gain: {
        inputs: [],
        value: 1,
      },
      inputs: [{
        detune: {
          inputs: [],
          value: 0,
        },
        frequency: {
          inputs: [],
          value: 440,
        },
        inputs: [],
        name: 'OscillatorNode',
        type: 'sine',
      }],
      name: 'GainNode',
    }],
    name: 'AudioDestinationNode',
  })
  virtualAudioGraph.update({})
  t.deepEqual(audioContext.toJSON(), {
    inputs: [],
    name: 'AudioDestinationNode',
  })
  t.end()
})

test('update - handles random strings for ids', t => {
  virtualAudioGraph.update({0: ['gain', 'output']})

  t.deepEqual(audioContext.toJSON(), {
    inputs: [
      {
        gain: {
          inputs: [],
          value: 1,
        },
        inputs: [],
        name: 'GainNode',
      },
    ],
    name: 'AudioDestinationNode',
  })

  virtualAudioGraph.update({0: ['oscillator', 'output']})

  t.deepEqual(audioContext.toJSON(), {
    inputs: [
      {
        detune: {
          inputs: [],
          value: 0,
        },
        frequency: {
          inputs: [],
          value: 440,
        },
        inputs: [],
        name: 'OscillatorNode',
        type: 'sine',
      },
    ],
    name: 'AudioDestinationNode',
  })

  virtualAudioGraph.update({0: [pingPongDelay, 'output']})

  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode', inputs: [
      {name: 'StereoPannerNode', pan: {value: 1, inputs: []}, inputs: [{name: 'DelayNode', delayTime: Object({value: 0.3333333333333333, inputs: []}), inputs: [Object({name: 'GainNode', gain: Object({value: 0.3333333333333333, inputs: []}), inputs: [Object({name: 'DelayNode', delayTime: Object({value: 0.3333333333333333, inputs: []}), inputs: [Object({name: 'GainNode', gain: Object({value: 0.3333333333333333, inputs: []}), inputs: ['<circular:DelayNode>']})]})]})]}]},
      {name: 'StereoPannerNode', pan: Object({value: -1, inputs: []}), inputs: [Object({name: 'DelayNode', delayTime: Object({value: 0.3333333333333333, inputs: []}), inputs: [Object({name: 'GainNode', gain: Object({value: 0.3333333333333333, inputs: []}), inputs: [Object({name: 'DelayNode', delayTime: Object({value: 0.3333333333333333, inputs: []}), inputs: [Object({name: 'GainNode', gain: Object({value: 0.3333333333333333, inputs: []}), inputs: ['<circular:DelayNode>']})]})]})]})]},
    ],
  })

  t.end()
})

test('update - updates standard and custom nodes if passed same id but different params', t => {
  virtualAudioGraph.update({
    0: ['oscillator', 'output', {detune: -9, frequency: 220}],
  })

  t.deepEqual(audioContext.toJSON(), {
    inputs: [{
      detune: {inputs: [], value: -9},
      frequency: {inputs: [], value: 220},
      inputs: [],
      name: 'OscillatorNode',
      type: 'sine',
    }],
    name: 'AudioDestinationNode',
  })

  virtualAudioGraph.update({
    0: ['oscillator', 'output', {detune: 0, frequency: 880}],
  })

  t.deepEqual(audioContext.toJSON(), {
    inputs: [{
      detune: {inputs: [], value: 0},
      frequency: {inputs: [], value: 880},
      inputs: [],
      name: 'OscillatorNode',
      type: 'sine',
    }],
    name: 'AudioDestinationNode',
  })

  virtualAudioGraph.update({
    0: [sineOsc, 'output', {frequency: 110, gain: 0.5}],
  })

  t.deepEqual(audioContext.toJSON(), {
    inputs: [{
      gain: {inputs: [], value: 0.5},
      inputs: [{
        detune: {inputs: [], value: 0},
        frequency: {inputs: [], value: 110},
        inputs: [],
        name: 'OscillatorNode',
        type: 'sine',
      }],
      name: 'GainNode',
    }],
    name: 'AudioDestinationNode',
  })

  virtualAudioGraph.update({
    0: [sineOsc, 'output', {frequency: 660, gain: 0.2}],
  })

  t.deepEqual(audioContext.toJSON(), {
    inputs: [{
      gain: {inputs: [], value: 0.2},
      inputs: [{
        detune: {inputs: [], value: 0},
        frequency: {inputs: [], value: 660},
        inputs: [],
        name: 'OscillatorNode',
        type: 'sine',
      }],
      name: 'GainNode',
    }],
    name: 'AudioDestinationNode',
  })
  t.end()
})

test('update - connects nodes to each other', t => {
  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['oscillator', 0],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [
      {
        gain: {inputs: [], value: 1},
        inputs: [{
          detune: {inputs: [], value: 0},
          frequency: {inputs: [], value: 440},
          inputs: [],
          name: 'OscillatorNode',
          type: 'sine',
        }],
        name: 'GainNode',
      },
    ],
    name: 'AudioDestinationNode',
  })
  virtualAudioGraph.update({
    0: ['oscillator', 'output'],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [{
      detune: {inputs: [], value: 0},
      frequency: {inputs: [], value: 440},
      inputs: [],
      name: 'OscillatorNode',
      type: 'sine',
    }],
    name: 'AudioDestinationNode',
  })
  t.end()
})

test('update - reconnects nodes to each other', t => {
  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['oscillator', 0],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [{
      gain: {inputs: [], value: 1},
      inputs: [{
        detune: {inputs: [], value: 0},
        frequency: {inputs: [], value: 440},
        inputs: [],
        name: 'OscillatorNode',
        type: 'sine',
      }],
      name: 'GainNode',
    }],
    name: 'AudioDestinationNode',
  })
  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['oscillator', 'output'],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [
      {
        gain: {inputs: [], value: 1},
        inputs: [],
        name: 'GainNode',
      },
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
  t.end()
})

test('update - connects and reconnects nodes to audioParams', t => {
  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['oscillator', 0],
    2: [
      'oscillator',
      {destination: 'frequency', key: 1},
      {frequency: 0.5, type: 'triangle'},
    ],
  })

  t.deepEqual(audioContext.toJSON(), {
    inputs: [{
      gain: {inputs: [], value: 1},
      inputs: [{
        detune: {inputs: [], value: 0},
        frequency: {
          inputs: [{
            detune: {inputs: [], value: 0},
            frequency: {inputs: [], value: 0.5},
            inputs: [],
            name: 'OscillatorNode',
            type: 'triangle',
          }],
          value: 440,
        },
        inputs: [],
        name: 'OscillatorNode',
        type: 'sine',
      }],
      name: 'GainNode',
    }],
    name: 'AudioDestinationNode',
  })

  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['oscillator', 0],
    2: [
      'oscillator',
      [{destination: 'detune', key: 1}],
      {frequency: 0.5, type: 'triangle'},
    ],
  })

  t.deepEqual(audioContext.toJSON(), {
    inputs: [{
      gain: {inputs: [], value: 1},
      inputs: [{
        detune: {
          inputs: [{
            detune: {inputs: [], value: 0},
            frequency: {inputs: [], value: 0.5},
            inputs: [],
            name: 'OscillatorNode',
            type: 'triangle',
          }],
          value: 0,
        },
        frequency: {inputs: [], value: 440},
        inputs: [],
        name: 'OscillatorNode',
        type: 'sine',
      }],
      name: 'GainNode',
    }],
    name: 'AudioDestinationNode',
  })

  virtualAudioGraph.update({
    0: ['oscillator', 'output'],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [{
      detune: {inputs: [], value: 0},
      frequency: {inputs: [], value: 440},
      inputs: [],
      name: 'OscillatorNode',
      type: 'sine',
    }],
    name: 'AudioDestinationNode',
  })
  t.end()
})

test('update - disconnects and reconnects child nodes properly', t => {
  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['stereoPanner', 0],
    2: ['gain', 1],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [{
      gain: {inputs: [], value: 1},
      inputs: [{
        inputs: [{
          gain: {inputs: [], value: 1},
          inputs: [],
          name: 'GainNode',
        }],
        name: 'StereoPannerNode',
        pan: {inputs: [], value: 0},
      }],
      name: 'GainNode',
    }],
    name: 'AudioDestinationNode',
  })
  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['gain', 0],
    2: ['gain', 1],
  })
  t.deepEqual(audioContext.toJSON(), {
    inputs: [{
      gain: {inputs: [], value: 1},
      inputs: [{
        gain: {inputs: [], value: 1},
        inputs: [{
          gain: {inputs: [], value: 1},
          inputs: [],
          name: 'GainNode',
        }],
        name: 'GainNode',
      }],
      name: 'GainNode',
    }],
    name: 'AudioDestinationNode',
  })
  t.end()
})
