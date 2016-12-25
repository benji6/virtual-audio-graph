import createStandardVirtualAudioNode from './virtualNodeFactories/createStandardVirtualAudioNode'
import createCustomVirtualAudioNode from './virtualNodeFactories/createCustomVirtualAudioNode'

export default (audioContext, virtualAudioNodeParam) => virtualAudioNodeParam.isCustomVirtualNode === true
  ? createCustomVirtualAudioNode(audioContext, virtualAudioNodeParam)
  : createStandardVirtualAudioNode(audioContext, virtualAudioNodeParam)
