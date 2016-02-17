/* global AudioContext beforeEach describe expect it */
import pingPongDelay from '../tools/pingPongDelay'
import sineOsc from '../tools/sineOsc'

export default createVirtualAudioGraph => {
  describe('virtualAudioGraph.update - expected behaviour:', () => {
    let audioContext
    let virtualAudioGraph

    beforeEach(() => {
      audioContext = new AudioContext()
      virtualAudioGraph = createVirtualAudioGraph({
        audioContext,
        output: audioContext.destination
      })
    })

    it('returns itself', () => {
      const virtualNodeParams = {
        0: ['oscillator', 'output', {type: 'square'}]
      }
      expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph)
    })

    it('adds then removes nodes', () => {
      virtualAudioGraph.update({
        0: ['gain', 'output'],
        1: ['oscillator', 0]
      })
      expect(audioContext.toJSON()).toEqual({
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
      expect(audioContext.toJSON()).toEqual({
        name: 'AudioDestinationNode',
        inputs: []
      })
    })

    it('handles random strings for ids', () => {
      virtualAudioGraph.update({
        foo: ['gain', 'output'],
        bar: ['oscillator', 'foo']
      })
      expect(audioContext.toJSON()).toEqual({
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
      expect(audioContext.toJSON()).toEqual({
        name: 'AudioDestinationNode',
        inputs: []
      })
    })

    it('changes the node if passed params with same id but different node property', () => {
      virtualAudioGraph.update({
        0: ['gain', 'output']
      })

      expect(audioContext.toJSON()).toEqual({
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

      virtualAudioGraph.update({
        0: ['oscillator', 'output']
      })

      expect(audioContext.toJSON()).toEqual({
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

      virtualAudioGraph.defineNodes({pingPongDelay})

      virtualAudioGraph.update({
        0: ['pingPongDelay', 'output']
      })

       /* eslint-disable */
      expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }) ] }) ] }) ] }) ] })
      /* eslint-enable */
    })

    it('updates standard and custom nodes if passed same id but different params', () => {
      virtualAudioGraph.update({
        0: ['oscillator', 'output', {frequency: 220, detune: -9}]
      })

      expect(audioContext.toJSON()).toEqual({
        name: 'AudioDestinationNode',
        inputs: [{
          name: 'OscillatorNode',
          type: 'sine',
          frequency: {
            value: 220,
            inputs: []
          },
          detune: {
            value: -9,
            inputs: []
          },
          inputs: []
        }]
      })

      virtualAudioGraph.update({
        0: ['oscillator', 'output', {frequency: 880, detune: 0}]
      })

      expect(audioContext.toJSON()).toEqual({
        name: 'AudioDestinationNode',
        inputs: [{
          name: 'OscillatorNode',
          type: 'sine',
          frequency: {
            value: 880,
            inputs: []
          },
          detune: {
            value: 0,
            inputs: []
          },
          inputs: []
        }]
      })

      virtualAudioGraph.defineNodes({sineOsc})

      virtualAudioGraph.update({
        0: ['sineOsc', 'output', {frequency: 110, gain: 0.5}]
      })

      expect(audioContext.toJSON()).toEqual({
        name: 'AudioDestinationNode',
        inputs: [{
          name: 'GainNode',
          gain: {
            value: 0.5,
            inputs: []
          },
          inputs: [{
            name: 'OscillatorNode',
            type: 'sine',
            frequency: {
              value: 110,
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

      virtualAudioGraph.update({
        0: ['sineOsc', 'output', {frequency: 660, gain: 0.2}]
      })

      expect(audioContext.toJSON()).toEqual({
        name: 'AudioDestinationNode',
        inputs: [{
          name: 'GainNode',
          gain: {
            value: 0.2,
            inputs: []
          },
          inputs: [{
            name: 'OscillatorNode',
            type: 'sine',
            frequency: {
              value: 660,
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
    })

    it('connects nodes to each other', () => {
      virtualAudioGraph.update({
        0: ['gain', 'output'],
        1: ['oscillator', 0]
      })
      expect(audioContext.toJSON()).toEqual({
        name: 'AudioDestinationNode',
        inputs: [
          {
            name: 'GainNode',
            gain: {
              value: 1,
              inputs: []
            },
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
          }
        ]
      })
      virtualAudioGraph.update({
        0: ['oscillator', 'output']
      })
      expect(audioContext.toJSON()).toEqual({
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
    })

    it('reconnects nodes to each other', () => {
      virtualAudioGraph.update({
        0: ['gain', 'output'],
        1: ['oscillator', 0]
      })
      expect(audioContext.toJSON()).toEqual({
        name: 'AudioDestinationNode',
        inputs: [
          {
            name: 'GainNode',
            gain: {
              value: 1,
              inputs: []
            },
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
          }
        ]
      })
      virtualAudioGraph.update({
        0: ['gain', 'output'],
        1: ['oscillator', 'output']
      })
      expect(audioContext.toJSON()).toEqual({
        name: 'AudioDestinationNode',
        inputs: [
          {
            name: 'GainNode',
            gain: {
              value: 1,
              inputs: []
            },
            inputs: []
          },
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
    })

    it('connects and reconnects nodes to audioParams', () => {
      virtualAudioGraph.update({
        0: ['gain', 'output'],
        1: ['oscillator', 0],
        2: ['oscillator',
            {key: 1, destination: 'frequency'},
            {frequency: 0.5, type: 'triangle'}]
      })

      expect(audioContext.toJSON()).toEqual({
        name: 'AudioDestinationNode',
        inputs: [
          {
            name: 'GainNode',
            gain: {
              value: 1,
              inputs: []
            },
            inputs: [
              {
                name: 'OscillatorNode',
                type: 'sine',
                frequency: {
                  value: 440,
                  inputs: [
                    {
                      name: 'OscillatorNode',
                      type: 'triangle',
                      frequency: {
                        value: 0.5,
                        inputs: []
                      },
                      detune: {
                        value: 0,
                        inputs: []
                      },
                      inputs: []
                    }
                  ]
                },
                detune: {
                  value: 0,
                  inputs: []
                },
                inputs: []
              }
            ]
          }
        ]
      })

      virtualAudioGraph.update({
        0: ['gain', 'output'],
        1: ['oscillator', 0],
        2: ['oscillator',
            [{key: 1, destination: 'detune'}],
            {frequency: 0.5, type: 'triangle'}]
      })

      expect(audioContext.toJSON()).toEqual({
        name: 'AudioDestinationNode',
        inputs: [
          {
            name: 'GainNode',
            gain: {
              value: 1,
              inputs: []
            },
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
                  inputs: [
                    {
                      name: 'OscillatorNode',
                      type: 'triangle',
                      frequency: {
                        value: 0.5,
                        inputs: []
                      },
                      detune: {
                        value: 0,
                        inputs: []
                      },
                      inputs: []
                    }
                  ]
                },
                inputs: []
              }
            ]
          }
        ]
      })

      virtualAudioGraph.update({
        0: ['oscillator', 'output']
      })
      expect(audioContext.toJSON()).toEqual({
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
    })
    it('disconnects and reconnects child nodes properly', () => {
      virtualAudioGraph.update({
        0: ['gain', 'output'],
        1: ['stereoPanner', 0],
        2: ['gain', 1]
      })
      expect(audioContext.toJSON()).toEqual({
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
      expect(audioContext.toJSON()).toEqual({
        name: 'AudioDestinationNode',
        inputs: [{
          name: 'GainNode',
          gain: {value: 1, inputs: []},
          inputs: [{
            name: 'GainNode',
            gain: {value: 1, inputs: []},
            inputs: [
              {name: 'GainNode', gain: {value: 1, inputs: []}, inputs: []}
            ]
          }]
        }]
      })
    })
  })
}
