import createVirtualAudioGraph, * as V from '..'

describe('virtualAudioGraph instance', () => {
  test('currentTime', () => {
    const audioContext = new AudioContext()
    expect(createVirtualAudioGraph({ audioContext }).currentTime).toBe(
      audioContext.currentTime,
    )
  })

  test('getAudioNodeById', () => {
    const audioContext = new AudioContext()
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext })

    virtualAudioGraph.update({ 0: V.gain('output') })

    expect(virtualAudioGraph.getAudioNodeById(0).constructor).toBe(GainNode)
  })
})
