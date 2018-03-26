import CustomVirtualAudioNode from './VirtualAudioNodes/CustomVirtualAudioNode'
import StandardVirtualAudioNode from './VirtualAudioNodes/StandardVirtualAudioNode'

export type Output = string
  | number
  | { key: string, destination: string }
  | (string | number | { key: string, destination: string })[]

export type VirtualAudioNode = CustomVirtualAudioNode | StandardVirtualAudioNode

export interface VirtualAudioNodeGraph {
  [key: string]: VirtualAudioNode
}
