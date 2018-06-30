import {
  CustomVirtualAudioNodeFactory,
  IVirtualAudioNodeParams,
  Output,
} from './types'
import CustomVirtualAudioNode from './VirtualAudioNodes/CustomVirtualAudioNode'

export default (node: CustomVirtualAudioNodeFactory) => (
  output: Output,
  params?: IVirtualAudioNodeParams,
) => new CustomVirtualAudioNode(node, output, params)
