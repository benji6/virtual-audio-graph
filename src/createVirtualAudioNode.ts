import StandardVirtualAudioNode from './VirtualAudioNodes/StandardVirtualAudioNode'
import CustomVirtualAudioNode from './VirtualAudioNodes/CustomVirtualAudioNode'
import VirtualAudioNode from './VirtualAudioNode'

export default (audioContext: AudioContext, [node, output, params, input]): VirtualAudioNode =>
  typeof node === 'function'
    ? new CustomVirtualAudioNode(audioContext, node, output, params)
    : new StandardVirtualAudioNode(audioContext, node, output, params, input)
