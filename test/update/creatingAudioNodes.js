/*
  global
  AudioContext
  AnalyserNode
  BiquadFilterNode
  DelayNode
  OscillatorNode
  WebAudioTestAPI
*/
const test = require('tape')
require('../WebAudioTestAPISetup')
const V = require('../..')
const createVirtualAudioGraph = V.default

test('update - creates AnalyserNode with all valid parameters', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})

  const params = {
    fftSize: 2048,
    maxDecibels: -10,
    minDecibels: -90,
    smoothingTimeConstant: 1,
  }

  const virtualGraphParams = {
    0: V.analyser('output', params),
  }

  virtualAudioGraph.update(virtualGraphParams)
  const audioNode = virtualAudioGraph.getAudioNodeById(0)
  t.is(audioNode.constructor, AnalyserNode)
  t.is(audioNode.fftSize, params.fftSize)
  t.is(audioNode.frequencyBinCount, params.fftSize / 2)
  t.is(audioNode.minDecibels, params.minDecibels)
  t.is(audioNode.maxDecibels, params.maxDecibels)
  t.is(audioNode.smoothingTimeConstant, params.smoothingTimeConstant)
  t.is(audioNode.getFloatFrequencyData(new Float32Array(audioNode.frequencyBinCount)), undefined)
  t.is(audioNode.getByteFrequencyData(new Uint8Array(audioNode.frequencyBinCount)), undefined)
  t.is(audioNode.getFloatTimeDomainData(new Float32Array(audioNode.fftSize)), undefined)
  t.is(audioNode.getByteTimeDomainData(new Uint8Array(audioNode.fftSize)), undefined)
  t.end()
})

test('update - creates BiquadFilterNode with all valid parameters', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})

  const type = 'peaking'
  const frequency = 500
  const detune = 6
  const Q = 0.5

  const virtualGraphParams = {
    0: V.biquadFilter('output', {detune, frequency, Q, type}),
  }

  virtualAudioGraph.update(virtualGraphParams)
  const audioNode = virtualAudioGraph.getAudioNodeById(0)
  t.is(audioNode.constructor, BiquadFilterNode)
  t.is(audioNode.type, type)
  t.is(audioNode.frequency.value, frequency)
  t.is(audioNode.detune.value, detune)
  t.is(audioNode.Q.value, Q)
  t.end()
})

test('update - creates BufferSourceNode with all valid parameters', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})
  const sampleRate = audioContext.sampleRate

  const params = {
    buffer: audioContext.createBuffer(2, sampleRate * 2, sampleRate),
    loop: true,
    loopEnd: 2,
    loopStart: 1,
    onended: () => {},
    playbackRate: 2,
  }

  const virtualGraphParams = {
    0: V.bufferSource('output', params),
  }

  virtualAudioGraph.update(virtualGraphParams)
  const audioNode = virtualAudioGraph.getAudioNodeById(0)
  t.is(audioNode.constructor.name, 'AudioBufferSourceNode')
  t.is(audioNode.buffer, params.buffer)
  t.is(audioNode.loop, params.loop)
  t.is(audioNode.loopEnd, params.loopEnd)
  t.is(audioNode.loopStart, params.loopStart)
  t.is(audioNode.onended, params.onended)
  t.is(audioNode.playbackRate.value, params.playbackRate)
  t.end()
})

test('update - creates ChannelSplitterNode and ChannelMergerNode and connects them correctly', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})
  const params = {numberOfOutputs: 2}

  virtualAudioGraph.update({
    0: V.channelMerger('output', params),
  })
  t.is(virtualAudioGraph.getAudioNodeById(0).constructor.name, 'ChannelMergerNode')

  virtualAudioGraph.update({
    0: V.channelSplitter('output', params),
  })
  t.is(virtualAudioGraph.getAudioNodeById(0).constructor.name, 'ChannelSplitterNode')

  virtualAudioGraph.update({
    0: V.channelMerger('output', params),
    1: V.oscillator('output'),
    2: V.channelSplitter({inputs: [1, 0], key: 0, outputs: [0, 1]}, params),
  })
  t.end()
})

test('update - creates ConvolverNode with all valid parameters', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})
  const sampleRate = audioContext.sampleRate
  const params = {
    buffer: audioContext.createBuffer(2, sampleRate * 2, sampleRate),
    normalize: false,
  }

  const virtualGraphParams = {
    0: V.convolver('output', params),
  }

  virtualAudioGraph.update(virtualGraphParams)
  const audioNode = virtualAudioGraph.getAudioNodeById(0)
  t.is(audioNode.constructor.name, 'ConvolverNode')
  t.is(audioNode.buffer, params.buffer)
  t.is(audioNode.normalize, params.normalize)
  t.end()
})

test('update - creates DelayNode with all valid parameters', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})
  const delayTime = 2
  const maxDelayTime = 5

  const virtualGraphParams = {
    0: V.delay('output', {delayTime, maxDelayTime}),
  }

  virtualAudioGraph.update(virtualGraphParams)
  const audioNode = virtualAudioGraph.getAudioNodeById(0)
  t.is(audioNode.constructor, DelayNode)
  t.is(audioNode.delayTime.value, delayTime)
  t.end()
})

test('update - creates DynamicsCompressorNode with all valid parameters', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})
  const params = {
    attack: 0,
    knee: 40,
    ratio: 12,
    reduction: -20,
    release: 0.25,
    threshold: -50,
  }

  const virtualGraphParams = {
    'random string id': V.dynamicsCompressor('output', params),
  }

  virtualAudioGraph.update(virtualGraphParams)
  const audioNode = virtualAudioGraph.getAudioNodeById('random string id')
  t.is(audioNode.constructor.name, 'DynamicsCompressorNode')
  t.is(audioNode.attack.value, params.attack)
  t.is(audioNode.knee.value, params.knee)
  t.is(audioNode.ratio.value, params.ratio)
  t.is(audioNode.reduction.value, params.reduction)
  t.is(audioNode.release.value, params.release)
  t.is(audioNode.threshold.value, params.threshold)
  t.end()
})

test('update - creates GainNode with all valid parameters', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})
  const gain = 0.5

  const virtualGraphParams = {
    0: V.gain('output', {gain}),
  }

  virtualAudioGraph.update(virtualGraphParams)
  const audioNode = virtualAudioGraph.getAudioNodeById(0)
  t.is(audioNode.constructor.name, 'GainNode')
  t.is(audioNode.gain.value, gain)
  t.end()
})

test('update - creates MediaStreamAudioDestinationNode with all valid parameters', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})

  virtualAudioGraph.update({
    0: V.mediaStreamDestination(),
  })
  const audioNode = virtualAudioGraph.getAudioNodeById(0)
  t.is(audioNode.constructor.name, 'MediaStreamAudioDestinationNode')
  t.end()
})

test('update - creates MediaElementAudioSourceNode and MediaStreamAudioSourceNode with all valid parameters', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})
  const HTMLMediaElement = WebAudioTestAPI.HTMLMediaElement
  const MediaStream = WebAudioTestAPI.MediaStream

  virtualAudioGraph.update({
    0: V.mediaElementSource('output', {mediaElement: new HTMLMediaElement()}),
  })
  t.is(virtualAudioGraph.getAudioNodeById(0).constructor.name, 'MediaElementAudioSourceNode')

  virtualAudioGraph.update({
    0: V.mediaStreamSource('output', {mediaStream: new MediaStream()}),
  })
  t.is(virtualAudioGraph.getAudioNodeById(0).constructor.name, 'MediaStreamAudioSourceNode')
  t.end()
})

test('update - creates OscillatorNode with all valid parameters', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})
  const params = {
    detune: 4,
    frequency: 440,
    type: 'square',
  }

  const virtualGraphParams = {
    0: V.oscillator('output', params),
  }

  virtualAudioGraph.update(virtualGraphParams)
  const audioNode = virtualAudioGraph.getAudioNodeById(0)
  t.is(audioNode.constructor, OscillatorNode)
  t.is(audioNode.type, params.type)
  t.is(audioNode.frequency.value, params.frequency)
  t.is(audioNode.detune.value, params.detune)
  t.end()
})

test('update - creates PannerNode with all valid parameters', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})
  const distanceModel = 'inverse'
  const panningModel = 'HRTF'
  const refDistance = 1
  const maxDistance = 10000
  const rolloffFactor = 1
  const coneInnerAngle = 360
  const coneOuterAngle = 0
  const coneOuterGain = 0
  const position = [0, 0, 0]
  const orientation = [1, 0, 0]

  const virtualGraphParams = {
    0: V.panner('output', {
      coneInnerAngle,
      coneOuterAngle,
      coneOuterGain,
      distanceModel,
      maxDistance,
      orientation,
      panningModel,
      position,
      refDistance,
      rolloffFactor,
    }),
  }

  virtualAudioGraph.update(virtualGraphParams)
  const audioNode = virtualAudioGraph.getAudioNodeById(0)
  t.is(audioNode.constructor.name, 'PannerNode')
  t.is(audioNode.coneInnerAngle, coneInnerAngle)
  t.is(audioNode.coneOuterAngle, coneOuterAngle)
  t.is(audioNode.coneOuterGain, coneOuterGain)
  t.is(audioNode.distanceModel, distanceModel)
  t.is(audioNode.panningModel, panningModel)
  t.is(audioNode.refDistance, refDistance)
  t.is(audioNode.rolloffFactor, rolloffFactor)
  t.is(audioNode.maxDistance, maxDistance)
  t.end()
})

test('update - creates StereoPannerNode with all valid parameters', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})
  const pan = 1

  const virtualGraphParams = {
    0: V.stereoPanner('output', {pan}),
  }

  virtualAudioGraph.update(virtualGraphParams)
  const audioNode = virtualAudioGraph.getAudioNodeById(0)
  t.is(audioNode.constructor.name, 'StereoPannerNode')
  t.is(audioNode.pan.value, pan)
  t.end()
})

test('update - creates WaveShaperNode with all valid parameters', t => {
  const audioContext = new AudioContext()
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})
  const params = {
    curve: new Float32Array(44100),
    oversample: '4x',
  }

  const virtualGraphParams = {
    0: V.waveShaper('output', params),
  }

  virtualAudioGraph.update(virtualGraphParams)
  const audioNode = virtualAudioGraph.getAudioNodeById(0)
  t.is(audioNode.constructor.name, 'WaveShaperNode')
  t.is(audioNode.curve, params.curve)
  t.is(audioNode.oversample, params.oversample)
  t.end()
})
