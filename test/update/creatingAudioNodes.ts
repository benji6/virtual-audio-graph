import createVirtualAudioGraph, * as V from '../..'

declare const WebAudioTestAPI: any

describe('creating audio nodes with update', () => {
  test('creates AnalyserNode with all valid parameters', () => {
    const audioContext = new AudioContext()
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext })

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
    expect(audioNode.constructor).toBe(AnalyserNode)
    expect(audioNode.fftSize).toBe(params.fftSize)
    expect(audioNode.frequencyBinCount).toBe(params.fftSize / 2)
    expect(audioNode.minDecibels).toBe(params.minDecibels)
    expect(audioNode.maxDecibels).toBe(params.maxDecibels)
    expect(audioNode.smoothingTimeConstant).toBe(params.smoothingTimeConstant)
    expect(
      audioNode.getFloatFrequencyData(
        new Float32Array(audioNode.frequencyBinCount),
      ),
    ).toBe(undefined)
    expect(
      audioNode.getByteFrequencyData(
        new Uint8Array(audioNode.frequencyBinCount),
      ),
    ).toBe(undefined)
    expect(
      audioNode.getFloatTimeDomainData(new Float32Array(audioNode.fftSize)),
    ).toBe(undefined)
    expect(
      audioNode.getByteTimeDomainData(new Uint8Array(audioNode.fftSize)),
    ).toBe(undefined)
  })

  test('creates BiquadFilterNode with all valid parameters', () => {
    const audioContext = new AudioContext()
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext })

    const type = 'peaking'
    const frequency = 500
    const detune = 6
    const Q = 0.5

    const virtualGraphParams = {
      0: V.biquadFilter('output', { detune, frequency, Q, type }),
    }

    virtualAudioGraph.update(virtualGraphParams)

    const audioNode = virtualAudioGraph.getAudioNodeById(0)

    expect(audioNode.constructor).toBe(BiquadFilterNode)
    expect(audioNode.type).toBe(type)
    expect(audioNode.frequency.value).toBe(frequency)
    expect(audioNode.detune.value).toBe(detune)
    expect(audioNode.Q.value).toBe(Q)
  })

  test('creates BufferSourceNode with all valid parameters', () => {
    const audioContext = new AudioContext()
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext })
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

    expect(audioNode.constructor.name).toBe('AudioBufferSourceNode')
    expect(audioNode.buffer).toBe(params.buffer)
    expect(audioNode.loop).toBe(params.loop)
    expect(audioNode.loopEnd).toBe(params.loopEnd)
    expect(audioNode.loopStart).toBe(params.loopStart)
    expect(audioNode.onended).toBe(params.onended)
    expect(audioNode.playbackRate.value).toBe(params.playbackRate)
  })

  test('creates ChannelSplitterNode and ChannelMergerNode and connects them correctly', () => {
    const audioContext = new AudioContext()
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext })
    const params = { numberOfOutputs: 2 }

    virtualAudioGraph.update({
      0: V.channelMerger('output', params),
    })

    expect(virtualAudioGraph.getAudioNodeById(0).constructor.name).toBe(
      'ChannelMergerNode',
    )

    virtualAudioGraph.update({
      0: V.channelSplitter('output', params),
    })

    expect(virtualAudioGraph.getAudioNodeById(0).constructor.name).toBe(
      'ChannelSplitterNode',
    )

    virtualAudioGraph.update({
      0: V.channelMerger('output', params),
      1: V.oscillator('output'),
      2: V.channelSplitter({ inputs: [1, 0], key: 0, outputs: [0, 1] }, params),
    })
  })

  test('creates ConvolverNode with all valid parameters', () => {
    const audioContext = new AudioContext()
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext })
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
    expect(audioNode.constructor.name).toBe('ConvolverNode')
    expect(audioNode.buffer).toBe(params.buffer)
    expect(audioNode.normalize).toBe(params.normalize)
  })

  test('creates DelayNode with all valid parameters', () => {
    const audioContext = new AudioContext()
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext })
    const delayTime = 2
    const maxDelayTime = 5

    const virtualGraphParams = {
      0: V.delay('output', { delayTime, maxDelayTime }),
    }

    virtualAudioGraph.update(virtualGraphParams)
    const audioNode = virtualAudioGraph.getAudioNodeById(0)

    expect(audioNode.constructor).toBe(DelayNode)
    expect(audioNode.delayTime.value).toBe(delayTime)
  })

  test('creates DynamicsCompressorNode with all valid parameters', () => {
    const audioContext = new AudioContext()
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext })
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

    expect(audioNode.constructor.name).toBe('DynamicsCompressorNode')
    expect(audioNode.attack.value).toBe(params.attack)
    expect(audioNode.knee.value).toBe(params.knee)
    expect(audioNode.ratio.value).toBe(params.ratio)
    expect(audioNode.reduction.value).toBe(params.reduction)
    expect(audioNode.release.value).toBe(params.release)
    expect(audioNode.threshold.value).toBe(params.threshold)
  })

  test('creates GainNode with all valid parameters', () => {
    const audioContext = new AudioContext()
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext })
    const gain = 0.5

    const virtualGraphParams = {
      0: V.gain('output', { gain }),
    }

    virtualAudioGraph.update(virtualGraphParams)
    const audioNode = virtualAudioGraph.getAudioNodeById(0)

    expect(audioNode.constructor.name).toBe('GainNode')
    expect(audioNode.gain.value).toBe(gain)
  })

  test('creates MediaStreamAudioDestinationNode with all valid parameters', () => {
    const audioContext = new AudioContext()
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext })

    virtualAudioGraph.update({
      0: V.mediaStreamDestination(),
    })
    const audioNode = virtualAudioGraph.getAudioNodeById(0)

    expect(audioNode.constructor.name).toBe('MediaStreamAudioDestinationNode')
  })

  test('creates valid MediaElementAudioSourceNode and MediaStreamAudioSourceNode', () => {
    const audioContext = new AudioContext()
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext })
    const HTMLMediaElement = WebAudioTestAPI.HTMLMediaElement
    const MediaStream = WebAudioTestAPI.MediaStream

    virtualAudioGraph.update({
      0: V.mediaElementSource('output', {
        mediaElement: new HTMLMediaElement(),
      }),
    })

    expect(virtualAudioGraph.getAudioNodeById(0).constructor.name).toBe(
      'MediaElementAudioSourceNode',
    )

    virtualAudioGraph.update({
      0: V.mediaStreamSource('output', { mediaStream: new MediaStream() }),
    })

    expect(virtualAudioGraph.getAudioNodeById(0).constructor.name).toBe(
      'MediaStreamAudioSourceNode',
    )
  })

  test('creates OscillatorNode with all valid parameters', () => {
    const audioContext = new AudioContext()
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext })
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

    expect(audioNode.constructor).toBe(OscillatorNode)
    expect(audioNode.type).toBe(params.type)
    expect(audioNode.frequency.value).toBe(params.frequency)
    expect(audioNode.detune.value).toBe(params.detune)
  })

  test('creates PannerNode with all valid parameters', () => {
    const audioContext = new AudioContext()
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext })
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

    expect(audioNode.constructor.name).toBe('PannerNode')
    expect(audioNode.coneInnerAngle).toBe(coneInnerAngle)
    expect(audioNode.coneOuterAngle).toBe(coneOuterAngle)
    expect(audioNode.coneOuterGain).toBe(coneOuterGain)
    expect(audioNode.distanceModel).toBe(distanceModel)
    expect(audioNode.panningModel).toBe(panningModel)
    expect(audioNode.refDistance).toBe(refDistance)
    expect(audioNode.rolloffFactor).toBe(rolloffFactor)
    expect(audioNode.maxDistance).toBe(maxDistance)
  })

  test('creates StereoPannerNode with all valid parameters', () => {
    const audioContext = new AudioContext()
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext })
    const pan = 1

    const virtualGraphParams = {
      0: V.stereoPanner('output', { pan }),
    }

    virtualAudioGraph.update(virtualGraphParams)
    const audioNode = virtualAudioGraph.getAudioNodeById(0)

    expect(audioNode.constructor.name).toBe('StereoPannerNode')
    expect(audioNode.pan.value).toBe(pan)
  })

  test('creates WaveShaperNode with all valid parameters', () => {
    const audioContext = new AudioContext()
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext })
    const params = {
      curve: new Float32Array(44100),
      oversample: '4x',
    }

    const virtualGraphParams = {
      0: V.waveShaper('output', params),
    }

    virtualAudioGraph.update(virtualGraphParams)
    const audioNode = virtualAudioGraph.getAudioNodeById(0)

    expect(audioNode.constructor.name).toBe('WaveShaperNode')
    expect(audioNode.curve).toBe(params.curve)
    expect(audioNode.oversample).toBe(params.oversample)
  })
})
