import createVirtualAudioGraph, * as V from '../../src'

describe('audio param methods with update', () => {
  let audioContext: any
  let virtualAudioGraph

  beforeEach(() => {
    audioContext = new AudioContext()
    virtualAudioGraph = createVirtualAudioGraph({ audioContext })
  })

  test('single setValueAtTime', () => {
    virtualAudioGraph.update({
      0: V.gain('output', { gain: ['setValueAtTime', 0.5, 1] }),
    })

    expect(audioContext.toJSON()).toMatchSnapshot()

    const gain = virtualAudioGraph.getAudioNodeById(0).gain

    expect(gain.$valueAtTime('00:00.000')).toBe(1)
    expect(gain.$valueAtTime('00:00.999')).toBe(1)
    expect(gain.$valueAtTime('00:01.000')).toBe(0.5)
    expect(gain.$valueAtTime('23:59.999')).toBe(0.5)
  })

  test('multiple setValueAtTime', () => {
    virtualAudioGraph.update({
      0: V.gain('output', {
        gain: [
          ['setValueAtTime', 0, 0],
          ['setValueAtTime', 1, 1],
          ['setValueAtTime', 0.5, 2],
        ],
      }),
    })

    expect(audioContext.toJSON()).toMatchSnapshot()

    const gain = virtualAudioGraph.getAudioNodeById(0).gain

    expect(gain.$valueAtTime('00:00.000')).toBe(0)
    expect(gain.$valueAtTime('00:00.999')).toBe(0)
    expect(gain.$valueAtTime('00:01.000')).toBe(1)
    expect(gain.$valueAtTime('00:01.999')).toBe(1)
    expect(gain.$valueAtTime('00:02.000')).toBe(0.5)
    expect(gain.$valueAtTime('23:59.999')).toBe(0.5)
  })

  test('overides setValueAtTime', () => {
    virtualAudioGraph.update({
      0: V.gain('output', { gain: ['setValueAtTime', 0.5, 1] }),
    })

    expect(audioContext.toJSON()).toMatchSnapshot()

    const gain = virtualAudioGraph.getAudioNodeById(0).gain

    expect(gain.$valueAtTime('00:00.000')).toBe(1)
    expect(gain.$valueAtTime('00:00.999')).toBe(1)
    expect(gain.$valueAtTime('00:01.000')).toBe(0.5)
    expect(gain.$valueAtTime('23:59.999')).toBe(0.5)

    virtualAudioGraph.update({
      0: V.gain('output', { gain: ['setValueAtTime', 0.75, 0.5] }),
    })

    expect(gain.$valueAtTime('00:00.000')).toBe(1)
    expect(gain.$valueAtTime('00:00.499')).toBe(1)
    expect(gain.$valueAtTime('00:00.500')).toBe(0.75)
    expect(gain.$valueAtTime('23:59.999')).toBe(0.75)

    virtualAudioGraph.update({
      0: V.gain('output', { gain: ['setValueAtTime', 0.75, 1] }),
    })

    expect(gain.$valueAtTime('00:00.000')).toBe(1)
    expect(gain.$valueAtTime('00:00.999')).toBe(1)
    expect(gain.$valueAtTime('00:01.000')).toBe(0.75)
    expect(gain.$valueAtTime('23:59.999')).toBe(0.75)
  })

  test('setValueAtTime with linearRampToValueAtTime', () => {
    virtualAudioGraph.update({
      0: V.gain('output', {
        gain: [
          ['setValueAtTime', 0.25, 0.25],
          ['linearRampToValueAtTime', 0.5, 0.5],
        ],
      }),
    })

    virtualAudioGraph.update({
      0: V.gain('output', {
        gain: [['setValueAtTime', 0, 0], ['linearRampToValueAtTime', 1, 1]],
      }),
    })

    expect(audioContext.toJSON()).toMatchSnapshot()

    const gain = virtualAudioGraph.getAudioNodeById(0).gain

    expect(gain.$valueAtTime('00:00.000')).toBe(0)
    expect(gain.$valueAtTime('00:00.001')).toBe(0.001)
    expect(gain.$valueAtTime('00:00.250')).toBe(0.25)
    expect(gain.$valueAtTime('00:00.500')).toBe(0.5)
    expect(gain.$valueAtTime('00:00.750')).toBe(0.75)
    expect(gain.$valueAtTime('00:00.999')).toBe(0.999)
    expect(gain.$valueAtTime('00:01.000')).toBe(1)
    expect(gain.$valueAtTime('23:59.999')).toBe(1)
  })

  test('setValueAtTime with exponentialRampToValueAtTime', () => {
    virtualAudioGraph.update({
      0: V.oscillator('output', {
        frequency: [
          ['setValueAtTime', 220, 0],
          ['exponentialRampToValueAtTime', 1320, 5],
        ],
      }),
    })

    virtualAudioGraph.update({
      0: V.oscillator('output', {
        frequency: [
          ['setValueAtTime', 440, 0],
          ['exponentialRampToValueAtTime', 880, 1],
        ],
      }),
    })

    expect(audioContext.toJSON()).toMatchSnapshot()

    const frequency = virtualAudioGraph.getAudioNodeById(0).frequency

    expect(frequency.$valueAtTime('00:00.000')).toBe(440)
    expect(frequency.$valueAtTime('00:00.001')).toBe(440.30509048353554)
    expect(frequency.$valueAtTime('00:00.250')).toBe(523.2511306011972)
    expect(frequency.$valueAtTime('00:00.500')).toBe(622.2539674441618)
    expect(frequency.$valueAtTime('00:00.750')).toBe(739.9888454232688)
    expect(frequency.$valueAtTime('00:00.999')).toBe(879.3902418315982)
    expect(frequency.$valueAtTime('00:01.000')).toBe(880)
    expect(frequency.$valueAtTime('23:59.999')).toBe(880)
  })

  test('setValueAtTime with setTargetAtTime', () => {
    virtualAudioGraph.update({
      0: V.gain('output', {
        gain: [['setValueAtTime', 0, 0], ['setTargetAtTime', 1, 1, 0.75]],
      }),
    })

    virtualAudioGraph.update({
      0: V.gain('output', {
        gain: [['setValueAtTime', 0, 0], ['setTargetAtTime', 1, 1, 0.5]],
      }),
    })

    expect(audioContext.toJSON()).toMatchSnapshot()

    const gain = virtualAudioGraph.getAudioNodeById(0).gain

    expect(gain.$valueAtTime('00:00.000')).toBe(0)
    expect(gain.$valueAtTime('00:01.000')).toBe(0)
    expect(gain.$valueAtTime('00:01.100')).toBe(0.1812692469220183)
    expect(gain.$valueAtTime('00:02.000')).toBe(0.8646647167633873)
    expect(gain.$valueAtTime('00:03.000')).toBe(0.9816843611112658)
    expect(gain.$valueAtTime('00:05.000')).toBe(0.9996645373720975)
    expect(gain.$valueAtTime('00:08.000')).toBe(0.9999991684712809)
    expect(gain.$valueAtTime('00:13.000')).toBe(0.9999999999622486)
    expect(gain.$valueAtTime('01:00.000')).toBe(1)
    expect(gain.$valueAtTime('23:59.999')).toBe(1)
  })

  test('setValueAtTime with setValueCurveAtTime', () => {
    const waveArray0 = Float32Array.of(0, 0.2, 0.4, 0.8)

    virtualAudioGraph.update({
      0: V.gain('output', {
        gain: [
          ['setValueAtTime', 0, 0],
          ['setValueCurveAtTime', waveArray0, 1, 1],
        ],
      }),
    })

    const waveArray1 = Float32Array.of(0.5, 0.75, 0.25, 1)

    virtualAudioGraph.update({
      0: V.gain('output', {
        gain: [
          ['setValueAtTime', 0, 0],
          ['setValueCurveAtTime', waveArray1, 1, 1],
        ],
      }),
    })

    expect(audioContext.toJSON()).toMatchSnapshot()

    const gain = virtualAudioGraph.getAudioNodeById(0).gain

    expect(gain.$valueAtTime('00:00.000')).toBe(0)
    expect(gain.$valueAtTime('00:00.999')).toBe(0)
    expect(gain.$valueAtTime('00:01.000')).toBe(0.5)
    expect(gain.$valueAtTime('00:01.240')).toBe(0.5)
    expect(gain.$valueAtTime('00:01.250')).toBe(0.75)
    expect(gain.$valueAtTime('00:01.490')).toBe(0.75)
    expect(gain.$valueAtTime('00:01.500')).toBe(0.25)
    expect(gain.$valueAtTime('00:01.749')).toBe(0.25)
    expect(gain.$valueAtTime('00:01.750')).toBe(1)
    expect(gain.$valueAtTime('23:59.999')).toBe(1)
  })
})
