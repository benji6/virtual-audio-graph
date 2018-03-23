import VirtualAudioGraph from './VirtualAudioGraph'

export default (config?: {audioContext?: AudioContext, output?: AudioDestinationNode}) => {
  const audioContext = config && config.audioContext || new AudioContext
  const output = config && config.output || audioContext.destination
  return new VirtualAudioGraph(audioContext, output)
}
