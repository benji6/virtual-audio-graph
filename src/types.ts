import CustomVirtualAudioNode from './VirtualAudioNodes/CustomVirtualAudioNode'
import StandardVirtualAudioNode from './VirtualAudioNodes/StandardVirtualAudioNode'

export interface AudioNodePropertyLookup {
  [_: string]: any
}

export interface AudioNodeFactoryParam {
  [_: string]: any
}

export type CustomVirtualAudioNodeFactory = (_: VirtualAudioNodeParams) => VirtualAudioNodeGraph

export type Output = string
  | number
  | { key: string, destination: string }
  | (string | number | { key: string, destination: string })[]

export type VirtualAudioNode = CustomVirtualAudioNode | StandardVirtualAudioNode

export interface VirtualAudioNodeGraph {
  [_: string]: VirtualAudioNode
}

export interface VirtualAudioNodeParams {
  [_: string]: any
}
