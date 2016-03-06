/* global AudioContext */
const test = require('tape')
require('../WebAudioTestAPISetup')
const createVirtualAudioGraph = require('../..')

const audioContext = new AudioContext()
const virtualAudioGraph = createVirtualAudioGraph({audioContext})

const testSchedulingForNode = node => {
  test(`update - ${node}s with no start or stop times are played immediately and forever`, t => {
    const virtualGraphParams = {
      0: [node, 'output'],
      1: [node, 'output']
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
      0: [node, 'output', {stopTime: 0.2}],
      1: [node, 'output', {stopTime: 0.2}]
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
      0: [node, 'output', {startTime: 0.1}],
      1: [node, 'output', {startTime: 0.1}]
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
      nodeA: [node, 'output', {startTime: 0.1, stopTime: 0.2}]
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
      0: [node, 'output', {startTime: 0.1, stopTime: 0.2}],
      1: [node, 'output', {startTime: 0.1, stopTime: 0.2}],
      2: [node, 'output', {startTime: 0.1, stopTime: 0.2}]
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
      oscillator: {
        name: 'OscillatorNode',
        type: 'sine',
        frequency: {value: 440, inputs: []},
        detune: {value: 0, inputs: []},
        inputs: []
      },
      bufferSource: {
        name: 'AudioBufferSourceNode',
        buffer: null,
        playbackRate: {value: 1, inputs: []},
        loop: false,
        loopStart: 0,
        loopEnd: 0,
        inputs: []
      }
    }

    virtualAudioGraph.update({
      0: [node, 'output', {startTime: 1.1, stopTime: 1.2}],
      1: [node, 'output', {startTime: 1.1, stopTime: 1.2}],
      2: [node, 'output', {startTime: 1.1, stopTime: 1.2}],
      3: [node, 'output', {startTime: 1.1, stopTime: 1.2}]
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
      name: 'AudioDestinationNode',
      inputs: [
        nodeJSONFromNodeName[node],
        nodeJSONFromNodeName[node],
        nodeJSONFromNodeName[node],
        nodeJSONFromNodeName[node]
      ]
    })

    virtualAudioGraph.update({
      0: [node, 'output', {startTime: 0.1, stopTime: 0.2}],
      1: [node, 'output', {startTime: 0.1, stopTime: 0.2}],
      2: [node, 'output', {startTime: 0.1, stopTime: 0.2}],
      3: [node, 'output', {startTime: 0.1, stopTime: 0.2}]
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
      name: 'AudioDestinationNode',
      inputs: [
        nodeJSONFromNodeName[node],
        nodeJSONFromNodeName[node],
        nodeJSONFromNodeName[node],
        nodeJSONFromNodeName[node]
      ]
    })
    t.end()
  })
}

testSchedulingForNode('oscillator')
testSchedulingForNode('bufferSource')
