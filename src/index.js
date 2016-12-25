import createVirtualAudioGraph from './createVirtualAudioGraph'

const createStandardNode = node => (output, params, input) => {
  if (output == null && node !== 'createMediaStreamDestination') {
    throw new Error(`output not specified for ${node} node`)
  }
  return {
    input,
    node,
    output,
    params,
  }
}

export const analyser = createStandardNode('createAnalyser')
export const biquadFilter = createStandardNode('createBiquadFilter')
export const bufferSource = createStandardNode('createBufferSource')
export const channelMerger = createStandardNode('createChannelMerger')
export const channelSplitter = createStandardNode('createChannelSplitter')
export const convolver = createStandardNode('createConvolver')
export const delay = createStandardNode('createDelay')
export const dynamicsCompressor = createStandardNode('createDynamicsCompressor')
export const gain = createStandardNode('createGain')
export const mediaElementSource = createStandardNode('createMediaElementSource')
export const mediaStreamDestination = createStandardNode('createMediaStreamDestination')
export const mediaStreamSource = createStandardNode('createMediaStreamSource')
export const oscillator = createStandardNode('createOscillator')
export const panner = createStandardNode('createPanner')
export const stereoPanner = createStandardNode('createStereoPanner')
export const waveShaper = createStandardNode('createWaveShaper')

export const createNode = audioGraphParamsFactory => (output, params) => ({
  audioGraphParamsFactory,
  isCustomVirtualNode: true,
  output,
  params,
})

export default createVirtualAudioGraph
