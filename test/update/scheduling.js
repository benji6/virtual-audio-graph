/* global AudioContext */
const test = require('tape')
require('../WebAudioTestAPISetup')
const V = require('../..')
const createVirtualAudioGraph = V.default

const audioContext = new AudioContext()
const virtualAudioGraph = createVirtualAudioGraph({audioContext})

const testSchedulingForNode = node => {
  test(`update - ${node}s with no start or stop times are played immediately and forever`, t => {
    const virtualGraphParams = {
      0: V[node]('output'),
      1: V[node]('output'),
    }

    virtualAudioGraph.update(virtualGraphParams)
    Array.from(virtualAudioGraph.virtualNodes).forEach(virtualNode => {
      const audioNode = virtualNode.audioNode
      t.is(audioNode.$stateAtTime('00:00.000'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:00.099'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:00.100'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:00.199'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:00.200'), 'PLAYING')
      t.is(audioNode.$stateAtTime('23:59.999'), 'PLAYING')
    })
    t.end()
  })

  test(`update - ${node}s with no start times but with stop times are played immediately until their stop time`, t => {
    const virtualGraphParams = {
      0: V[node]('output', {stopTime: 0.2}),
      1: V[node]('output', {stopTime: 0.2}),
    }

    virtualAudioGraph.update(virtualGraphParams)
    Array.from(virtualAudioGraph.virtualNodes).forEach(virtualNode => {
      const audioNode = virtualNode.audioNode
      t.is(audioNode.$stateAtTime('00:00.000'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:00.099'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:00.100'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:00.199'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:00.200'), 'FINISHED')
      t.is(audioNode.$stateAtTime('23:59.999'), 'FINISHED')
    })
    t.end()
  })

  test(`update - ${node}s with start times but no stop times are played at their start time then forever`, t => {
    const virtualGraphParams = {
      0: V[node]('output', {startTime: 0.1}),
      1: V[node]('output', {startTime: 0.1}),
    }

    virtualAudioGraph.update(virtualGraphParams)
    Array.from(virtualAudioGraph.virtualNodes).forEach(virtualNode => {
      const audioNode = virtualNode.audioNode
      t.is(audioNode.$stateAtTime('00:00.000'), 'SCHEDULED')
      t.is(audioNode.$stateAtTime('00:00.099'), 'SCHEDULED')
      t.is(audioNode.$stateAtTime('00:00.100'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:00.199'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:00.200'), 'PLAYING')
      t.is(audioNode.$stateAtTime('23:59.999'), 'PLAYING')
    }, virtualAudioGraph.virtualNodes)
    t.end()
  })

  test(`update - works when scheduling a single ${node}'s start and stop times`, t => {
    const virtualGraphParams = {
      nodeA: V[node]('output', {startTime: 0.1, stopTime: 0.2}),
    }

    virtualAudioGraph.update(virtualGraphParams)
    const audioNode = virtualAudioGraph.virtualNodes.nodeA.audioNode
    t.is(audioNode.$stateAtTime('00:00.000'), 'SCHEDULED')
    t.is(audioNode.$stateAtTime('00:00.099'), 'SCHEDULED')
    t.is(audioNode.$stateAtTime('00:00.100'), 'PLAYING')
    t.is(audioNode.$stateAtTime('00:00.199'), 'PLAYING')
    t.is(audioNode.$stateAtTime('00:00.200'), 'FINISHED')
    t.end()
  })

  test(`update - works when scheduling multiple ${node}s' start and stop times`, t => {
    const virtualGraphParams = {
      0: V[node]('output', {startTime: 0.1, stopTime: 0.2}),
      1: V[node]('output', {startTime: 0.1, stopTime: 0.2}),
      2: V[node]('output', {startTime: 0.1, stopTime: 0.2}),
    }

    virtualAudioGraph.update(virtualGraphParams)
    Array.from(virtualAudioGraph.virtualNodes).forEach(virtualNode => {
      const audioNode = virtualNode.audioNode
      t.is(audioNode.$stateAtTime('00:00.000'), 'SCHEDULED')
      t.is(audioNode.$stateAtTime('00:00.099'), 'SCHEDULED')
      t.is(audioNode.$stateAtTime('00:00.100'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:00.199'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:00.200'), 'FINISHED')
    })
    t.end()
  })

  test(`update - works when rescheduling multiple ${node}' start and stop times`, t => {
    const nodeJSONFromNodeName = {
      bufferSource: {
        buffer: null,
        inputs: [],
        loop: false,
        loopEnd: 0,
        loopStart: 0,
        name: 'AudioBufferSourceNode',
        playbackRate: {inputs: [], value: 1},
      },
      oscillator: {
        detune: {inputs: [], value: 0},
        frequency: {inputs: [], value: 440},
        inputs: [],
        name: 'OscillatorNode',
        type: 'sine',
      },
    }

    virtualAudioGraph.update({
      0: V[node]('output', {startTime: 1.1, stopTime: 1.2}),
      1: V[node]('output', {startTime: 1.1, stopTime: 1.2}),
      2: V[node]('output', {startTime: 1.1, stopTime: 1.2}),
      3: V[node]('output', {startTime: 1.1, stopTime: 1.2}),
    })
    Array.from(virtualAudioGraph.virtualNodes).forEach(x => {
      const audioNode = x.audioNode
      t.is(audioNode.$stateAtTime('00:00.000'), 'SCHEDULED')
      t.is(audioNode.$stateAtTime('00:01.099'), 'SCHEDULED')
      t.is(audioNode.$stateAtTime('00:01.100'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:01.199'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:01.200'), 'FINISHED')
    })
    t.deepEqual(audioContext.toJSON(), {
      inputs: [
        nodeJSONFromNodeName[node],
        nodeJSONFromNodeName[node],
        nodeJSONFromNodeName[node],
        nodeJSONFromNodeName[node],
      ],
      name: 'AudioDestinationNode',
    })

    virtualAudioGraph.update({
      0: V[node]('output', {startTime: 0.1, stopTime: 0.2}),
      1: V[node]('output', {startTime: 0.1, stopTime: 0.2}),
      2: V[node]('output', {startTime: 0.1, stopTime: 0.2}),
      3: V[node]('output', {startTime: 0.1, stopTime: 0.2}),
    })

    Array.from(virtualAudioGraph.virtualNodes).forEach(x => {
      const audioNode = x.audioNode
      t.is(audioNode.$stateAtTime('00:00.000'), 'SCHEDULED')
      t.is(audioNode.$stateAtTime('00:00.099'), 'SCHEDULED')
      t.is(audioNode.$stateAtTime('00:00.100'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:00.199'), 'PLAYING')
      t.is(audioNode.$stateAtTime('00:00.200'), 'FINISHED')
    })
    t.deepEqual(audioContext.toJSON(), {
      inputs: [
        nodeJSONFromNodeName[node],
        nodeJSONFromNodeName[node],
        nodeJSONFromNodeName[node],
        nodeJSONFromNodeName[node],
      ],
      name: 'AudioDestinationNode',
    })
    t.end()
  })
}

testSchedulingForNode('oscillator')
testSchedulingForNode('bufferSource')
