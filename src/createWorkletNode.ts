import AudioWorkletVirtualAudioNode from './VirtualAudioNodes/AudioWorkletVirtualAudioNode'
import { Output, VirtualAudioNodeParams } from './types'

export default (nodeName: string) =>
  (output: Output, params?: VirtualAudioNodeParams) =>
    new AudioWorkletVirtualAudioNode(nodeName, output, params)
