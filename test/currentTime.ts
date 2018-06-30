import createVirtualAudioGraph, * as V from '../src'

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

    const node = virtualAudioGraph.getAudioNodeById(0)

    if (!node) throw Error('node not defined')

    expect(node.constructor).toBe(GainNode)
  })
})
