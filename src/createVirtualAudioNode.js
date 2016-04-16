import createStandardVirtualAudioNode from './virtualNodeFactories/createStandardVirtualAudioNode'
import createCustomVirtualAudioNode from './virtualNodeFactories/createCustomVirtualAudioNode'

export default (audioContext, virtualAudioNodeParam) => typeof virtualAudioNodeParam[0] === 'function'
  ? createCustomVirtualAudioNode(audioContext, virtualAudioNodeParam)
  : createStandardVirtualAudioNode(audioContext, virtualAudioNodeParam)
