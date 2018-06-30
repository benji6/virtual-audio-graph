import createVirtualAudioGraph, * as V from '..'

const audioContext: any = new AudioContext()

describe('createVirtualAudioGraph', () => {
  test('optionally takes audioContext property', () => {
    expect(createVirtualAudioGraph({ audioContext }).audioContext).toBe(
      audioContext,
    )
    expect(createVirtualAudioGraph().audioContext).not.toBe(audioContext)
    expect(createVirtualAudioGraph().audioContext).toBeInstanceOf(AudioContext)
  })

  test('optionally takes output parameter', () => {
    const gain: any = audioContext.createGain()

    createVirtualAudioGraph({ audioContext, output: gain }).update({
      0: V.gain('output', { gain: 0.2 }),
    })

    expect(gain.toJSON()).toMatchSnapshot()

    createVirtualAudioGraph({ audioContext }).update({
      0: V.gain('output', { gain: 0.2 }),
    })

    expect(audioContext.toJSON()).toMatchSnapshot()
  })
})
