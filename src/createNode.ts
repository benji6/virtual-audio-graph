import CustomVirtualAudioNode from './VirtualAudioNodes/CustomVirtualAudioNode'
import { CustomVirtualAudioNodeFactory, Output, VirtualAudioNodeParams } from './types'

export default (node: CustomVirtualAudioNodeFactory) =>
  (output: Output, params?: VirtualAudioNodeParams) =>
    new CustomVirtualAudioNode(node, output, params)
