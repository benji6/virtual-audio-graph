import { Output } from './types'
import StandardVirtualAudioNode from './VirtualAudioNodes/StandardVirtualAudioNode'

const createNodeConstructor = (nodeName: string) => (
  output?: Output,
  ...rest: any[]
): StandardVirtualAudioNode => {
  if (nodeName === 'mediaStreamDestination') {
    return new StandardVirtualAudioNode(nodeName)
  }
  if (output == null) {
    throw new Error(`Output not specified for ${nodeName}`)
  }
  return new StandardVirtualAudioNode(nodeName, output, ...rest)
}

export const analyser = createNodeConstructor('analyser')
export const biquadFilter = createNodeConstructor('biquadFilter')
export const bufferSource = createNodeConstructor('bufferSource')
export const channelMerger = createNodeConstructor('channelMerger')
export const channelSplitter = createNodeConstructor('channelSplitter')
export const convolver = createNodeConstructor('convolver')
export const delay = createNodeConstructor('delay')
export const dynamicsCompressor = createNodeConstructor('dynamicsCompressor')
export const gain = createNodeConstructor('gain')
export const mediaElementSource = createNodeConstructor('mediaElementSource')
export const mediaStreamDestination = createNodeConstructor(
  'mediaStreamDestination',
)
export const mediaStreamSource = createNodeConstructor('mediaStreamSource')
export const oscillator = createNodeConstructor('oscillator')
export const panner = createNodeConstructor('panner')
export const stereoPanner = createNodeConstructor('stereoPanner')
export const waveShaper = createNodeConstructor('waveShaper')
