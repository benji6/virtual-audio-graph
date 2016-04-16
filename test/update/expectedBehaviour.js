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
    1: ['oscillator', 0]
  })
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [{
      name: 'GainNode',
      gain: {value: 1, inputs: []},
      inputs: [{
        name: 'OscillatorNode',
        type: 'sine',
        frequency: {value: 440, inputs: []},
        detune: {value: 0, inputs: []},
        inputs: []
      }]
    }]
  })
  virtualAudioGraph.update({})
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: []
  })
  t.end()
})

test('update - handles random strings for ids', t => {
  virtualAudioGraph.update({
    foo: ['gain', 'output'],
    bar: ['oscillator', 'foo']
  })
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [{
      name: 'GainNode',
      gain: {
        value: 1,
        inputs: []
      },
      inputs: [{
        name: 'OscillatorNode',
        type: 'sine',
        frequency: {
          value: 440,
          inputs: []
        },
        detune: {
          value: 0,
          inputs: []
        },
        inputs: []
      }]
    }]
  })
  virtualAudioGraph.update({})
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: []
  })
  t.end()
})

test('update - handles random strings for ids', t => {
  virtualAudioGraph.update({0: ['gain', 'output']})

  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [
      {
        name: 'GainNode',
        gain: {
          value: 1,
          inputs: []
        },
        inputs: []
      }
    ]
  })

  virtualAudioGraph.update({0: ['oscillator', 'output']})

  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [
      {
        name: 'OscillatorNode',
        type: 'sine',
        frequency: {
          value: 440,
          inputs: []
        },
        detune: {
          value: 0,
          inputs: []
        },
        inputs: []
      }
    ]
  })

  virtualAudioGraph.update({0: [pingPongDelay, 'output']})

   /* eslint-disable */
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode', inputs: [
      { name: 'StereoPannerNode', pan: { value: 1, inputs: [  ] }, inputs: [ { name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }) ] }) ] } ] },
      { name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }) ] }) ] }) ] }
    ]
  })
  /* eslint-enable */
  t.end()
})

test('update - updates standard and custom nodes if passed same id but different params', t => {
  virtualAudioGraph.update({
    0: ['oscillator', 'output', {frequency: 220, detune: -9}]
  })

  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [{
      name: 'OscillatorNode',
      type: 'sine',
      frequency: {value: 220, inputs: []},
      detune: {value: -9, inputs: []},
      inputs: []
    }]
  })

  virtualAudioGraph.update({
    0: ['oscillator', 'output', {frequency: 880, detune: 0}]
  })

  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [{
      name: 'OscillatorNode',
      type: 'sine',
      frequency: {value: 880, inputs: []},
      detune: {value: 0, inputs: []},
      inputs: []
    }]
  })

  virtualAudioGraph.update({
    0: [sineOsc, 'output', {frequency: 110, gain: 0.5}]
  })

  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [{
      name: 'GainNode',
      gain: {value: 0.5, inputs: []},
      inputs: [{
        name: 'OscillatorNode',
        type: 'sine',
        frequency: {value: 110, inputs: []},
        detune: {value: 0, inputs: []},
        inputs: []
      }]
    }]
  })

  virtualAudioGraph.update({
    0: [sineOsc, 'output', {frequency: 660, gain: 0.2}]
  })

  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [{
      name: 'GainNode',
      gain: {value: 0.2, inputs: []},
      inputs: [{
        name: 'OscillatorNode',
        type: 'sine',
        frequency: {value: 660, inputs: []},
        detune: {value: 0, inputs: []},
        inputs: []
      }]
    }]
  })
  t.end()
})

test('update - connects nodes to each other', t => {
  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['oscillator', 0]
  })
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [
      {
        name: 'GainNode',
        gain: {value: 1, inputs: []},
        inputs: [{
          name: 'OscillatorNode',
          type: 'sine',
          frequency: {value: 440, inputs: []},
          detune: {value: 0, inputs: []},
          inputs: []
        }]
      }
    ]
  })
  virtualAudioGraph.update({
    0: ['oscillator', 'output']
  })
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [{
      name: 'OscillatorNode',
      type: 'sine',
      frequency: {value: 440, inputs: []},
      detune: {value: 0, inputs: []},
      inputs: []
    }]
  })
  t.end()
})

test('update - reconnects nodes to each other', t => {
  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['oscillator', 0]
  })
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [{
      name: 'GainNode',
      gain: {value: 1, inputs: []},
      inputs: [{
        name: 'OscillatorNode',
        type: 'sine',
        frequency: {value: 440, inputs: []},
        detune: {value: 0, inputs: []},
        inputs: []
      }]
    }]
  })
  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['oscillator', 'output']
  })
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [
      {
        name: 'GainNode',
        gain: {value: 1, inputs: []},
        inputs: []
      },
      {
        name: 'OscillatorNode',
        type: 'sine',
        frequency: {value: 440, inputs: []},
        detune: {value: 0, inputs: []},
        inputs: []
      }
    ]
  })
  t.end()
})

test('update - connects and reconnects nodes to audioParams', t => {
  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['oscillator', 0],
    2: [
      'oscillator',
      {key: 1, destination: 'frequency'},
      {frequency: 0.5, type: 'triangle'}
    ]
  })

  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [{
      name: 'GainNode',
      gain: {value: 1, inputs: []},
      inputs: [{
        name: 'OscillatorNode',
        type: 'sine',
        frequency: {
          value: 440,
          inputs: [{
            name: 'OscillatorNode',
            type: 'triangle',
            frequency: {value: 0.5, inputs: []},
            detune: {value: 0, inputs: []},
            inputs: []
          }]
        },
        detune: {value: 0, inputs: []},
        inputs: []
      }]
    }]
  })

  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['oscillator', 0],
    2: [
      'oscillator',
      [{key: 1, destination: 'detune'}],
      {frequency: 0.5, type: 'triangle'}
    ]
  })

  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [{
      name: 'GainNode',
      gain: {value: 1, inputs: []},
      inputs: [{
        name: 'OscillatorNode',
        type: 'sine',
        frequency: {value: 440, inputs: []},
        detune: {
          value: 0,
          inputs: [{
            name: 'OscillatorNode',
            type: 'triangle',
            frequency: {value: 0.5, inputs: []},
            detune: {value: 0, inputs: []},
            inputs: []
          }]
        },
        inputs: []
      }]
    }]
  })

  virtualAudioGraph.update({
    0: ['oscillator', 'output']
  })
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [{
      name: 'OscillatorNode',
      type: 'sine',
      frequency: {value: 440, inputs: []},
      detune: {value: 0, inputs: []},
      inputs: []
    }]
  })
  t.end()
})

test('update - disconnects and reconnects child nodes properly', t => {
  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['stereoPanner', 0],
    2: ['gain', 1]
  })
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [{
      name: 'GainNode',
      gain: {value: 1, inputs: []},
      inputs: [{
        name: 'StereoPannerNode',
        pan: {value: 0, inputs: []},
        inputs: [{
          name: 'GainNode',
          gain: {value: 1, inputs: []},
          inputs: []
        }]
      }]
    }]
  })
  virtualAudioGraph.update({
    0: ['gain', 'output'],
    1: ['gain', 0],
    2: ['gain', 1]
  })
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [{
      name: 'GainNode',
      gain: {value: 1, inputs: []},
      inputs: [{
        name: 'GainNode',
        gain: {value: 1, inputs: []},
        inputs: [{name: 'GainNode', gain: {value: 1, inputs: []}, inputs: []}]
      }]
    }]
  })
  t.end()
})
