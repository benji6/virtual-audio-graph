import CustomVirtualAudioNode from './VirtualAudioNodes/CustomVirtualAudioNode'
import StandardVirtualAudioNode from './VirtualAudioNodes/StandardVirtualAudioNode'

export type VirtualAudioNode = CustomVirtualAudioNode | StandardVirtualAudioNode

export interface VirtualAudioNodeGraph {
  [key: string]: VirtualAudioNode
}
