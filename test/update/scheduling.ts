import createVirtualAudioGraph, * as V from '../..'

const audioContext: any = new AudioContext()
const virtualAudioGraph = createVirtualAudioGraph({ audioContext })

const testSchedulingForNode = (node) => {
  describe(node, () => {
    test('no start or stop times are played immediately and forever', () => {
      const virtualGraphParams = {
        0: V[node]('output'),
        1: V[node]('output'),
      }

      virtualAudioGraph.update(virtualGraphParams)

      Array.from((virtualAudioGraph as any).virtualNodes).forEach((virtualNode) => {
        const audioNode = (virtualNode as any).audioNode

        expect(audioNode.$stateAtTime('00:00.000')).toBe('PLAYING')
        expect(audioNode.$stateAtTime('00:00.099')).toBe('PLAYING')
        expect(audioNode.$stateAtTime('00:00.100')).toBe('PLAYING')
        expect(audioNode.$stateAtTime('00:00.199')).toBe('PLAYING')
        expect(audioNode.$stateAtTime('00:00.200')).toBe('PLAYING')
        expect(audioNode.$stateAtTime('23:59.999')).toBe('PLAYING')
      })
    })

    test('no start times but with stop times are played immediately until their stop time', () => {
      const virtualGraphParams = {
        0: V[node]('output', { stopTime: 0.2 }),
        1: V[node]('output', { stopTime: 0.2 }),
      }

      virtualAudioGraph.update(virtualGraphParams)
      Array.from((virtualAudioGraph as any).virtualNodes).forEach((virtualNode) => {
        const audioNode = (virtualNode as any).audioNode

        expect(audioNode.$stateAtTime('00:00.000')).toBe('PLAYING')
        expect(audioNode.$stateAtTime('00:00.099')).toBe('PLAYING')
        expect(audioNode.$stateAtTime('00:00.100')).toBe('PLAYING')
        expect(audioNode.$stateAtTime('00:00.199')).toBe('PLAYING')
        expect(audioNode.$stateAtTime('00:00.200')).toBe('FINISHED')
        expect(audioNode.$stateAtTime('23:59.999')).toBe('FINISHED')
      })
    })

    test('start times but no stop times played at their start time then forever', () => {
      const virtualGraphParams = {
        0: V[node]('output', { startTime: 0.1 }),
        1: V[node]('output', { startTime: 0.1 }),
      }

      virtualAudioGraph.update(virtualGraphParams)
      Array.from((virtualAudioGraph as any).virtualNodes).forEach(
        (virtualNode) => {
          const audioNode = (virtualNode as any).audioNode
          expect(audioNode.$stateAtTime('00:00.000')).toBe('SCHEDULED')
          expect(audioNode.$stateAtTime('00:00.099')).toBe('SCHEDULED')
          expect(audioNode.$stateAtTime('00:00.100')).toBe('PLAYING')
          expect(audioNode.$stateAtTime('00:00.199')).toBe('PLAYING')
          expect(audioNode.$stateAtTime('00:00.200')).toBe('PLAYING')
          expect(audioNode.$stateAtTime('23:59.999')).toBe('PLAYING')
        },
        (virtualAudioGraph as any).virtualNodes,
      )
    })

    test('works when scheduling a single node\'s start and stop times', () => {
      const virtualGraphParams = {
        nodeA: V[node]('output', { startTime: 0.1, stopTime: 0.2 }),
      }

      virtualAudioGraph.update(virtualGraphParams)
      const audioNode = (virtualAudioGraph as any).virtualNodes.nodeA.audioNode
      expect(audioNode.$stateAtTime('00:00.000')).toBe('SCHEDULED')
      expect(audioNode.$stateAtTime('00:00.099')).toBe('SCHEDULED')
      expect(audioNode.$stateAtTime('00:00.100')).toBe('PLAYING')
      expect(audioNode.$stateAtTime('00:00.199')).toBe('PLAYING')
      expect(audioNode.$stateAtTime('00:00.200')).toBe('FINISHED')
    })

    test('works when scheduling multiple nodes start and stop times', () => {
      const virtualGraphParams = {
        0: V[node]('output', { startTime: 0.1, stopTime: 0.2 }),
        1: V[node]('output', { startTime: 0.1, stopTime: 0.2 }),
        2: V[node]('output', { startTime: 0.1, stopTime: 0.2 }),
      }

      virtualAudioGraph.update(virtualGraphParams)
      Array.from((virtualAudioGraph as any).virtualNodes).forEach((virtualNode) => {
        const audioNode = (virtualNode as any).audioNode
        expect(audioNode.$stateAtTime('00:00.000')).toBe('SCHEDULED')
        expect(audioNode.$stateAtTime('00:00.099')).toBe('SCHEDULED')
        expect(audioNode.$stateAtTime('00:00.100')).toBe('PLAYING')
        expect(audioNode.$stateAtTime('00:00.199')).toBe('PLAYING')
        expect(audioNode.$stateAtTime('00:00.200')).toBe('FINISHED')
      })
    })

    test('works when rescheduling multiple node start and stop times', () => {
      const nodeJSONFromNodeName = {
        bufferSource: {
          buffer: null,
          inputs: [],
          loop: false,
          loopEnd: 0,
          loopStart: 0,
          name: 'AudioBufferSourceNode',
          playbackRate: { inputs: [], value: 1 },
        },
        oscillator: {
          detune: { inputs: [], value: 0 },
          frequency: { inputs: [], value: 440 },
          inputs: [],
          name: 'OscillatorNode',
          type: 'sine',
        },
      }

      virtualAudioGraph.update({
        0: V[node]('output', { startTime: 1.1, stopTime: 1.2 }),
        1: V[node]('output', { startTime: 1.1, stopTime: 1.2 }),
        2: V[node]('output', { startTime: 1.1, stopTime: 1.2 }),
        3: V[node]('output', { startTime: 1.1, stopTime: 1.2 }),
      })
      Array.from((virtualAudioGraph as any).virtualNodes).forEach((x) => {
        const audioNode = (x as any).audioNode
        expect(audioNode.$stateAtTime('00:00.000')).toBe('SCHEDULED')
        expect(audioNode.$stateAtTime('00:01.099')).toBe('SCHEDULED')
        expect(audioNode.$stateAtTime('00:01.100')).toBe('PLAYING')
        expect(audioNode.$stateAtTime('00:01.199')).toBe('PLAYING')
        expect(audioNode.$stateAtTime('00:01.200')).toBe('FINISHED')
      })

      expect(audioContext.toJSON()).toEqual({
        inputs: [
          nodeJSONFromNodeName[node],
          nodeJSONFromNodeName[node],
          nodeJSONFromNodeName[node],
          nodeJSONFromNodeName[node],
        ],
        name: 'AudioDestinationNode',
      })

      virtualAudioGraph.update({
        0: V[node]('output', { startTime: 0.1, stopTime: 0.2 }),
        1: V[node]('output', { startTime: 0.1, stopTime: 0.2 }),
        2: V[node]('output', { startTime: 0.1, stopTime: 0.2 }),
        3: V[node]('output', { startTime: 0.1, stopTime: 0.2 }),
      })

      Array.from((virtualAudioGraph as any).virtualNodes).forEach((x) => {
        const audioNode = (x as any).audioNode
        expect(audioNode.$stateAtTime('00:00.000')).toBe('SCHEDULED')
        expect(audioNode.$stateAtTime('00:00.099')).toBe('SCHEDULED')
        expect(audioNode.$stateAtTime('00:00.100')).toBe('PLAYING')
        expect(audioNode.$stateAtTime('00:00.199')).toBe('PLAYING')
        expect(audioNode.$stateAtTime('00:00.200')).toBe('FINISHED')
      })

      expect(audioContext.toJSON()).toEqual({
        inputs: [
          nodeJSONFromNodeName[node],
          nodeJSONFromNodeName[node],
          nodeJSONFromNodeName[node],
          nodeJSONFromNodeName[node],
        ],
        name: 'AudioDestinationNode',
      })
    })
  })
}

describe('scheduling with update', () => {
  testSchedulingForNode('oscillator')
  testSchedulingForNode('bufferSource')
})
