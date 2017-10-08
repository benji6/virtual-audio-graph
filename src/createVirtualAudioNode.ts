import StandardVirtualAudioNode from './VirtualAudioNodes/StandardVirtualAudioNode'
import CustomVirtualAudioNode from './VirtualAudioNodes/CustomVirtualAudioNode'

export default (audioContext, virtualAudioNodeParam) => typeof virtualAudioNodeParam[0] === 'function'
  ? new CustomVirtualAudioNode(audioContext, virtualAudioNodeParam)
  : new StandardVirtualAudioNode(audioContext, virtualAudioNodeParam)
