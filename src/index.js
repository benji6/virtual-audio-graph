/* global AudioContext */
import connectAudioNodes from './connectAudioNodes'
import createVirtualAudioNode from './createVirtualAudioNode'

const startTimePathParams = params => params[2] && params[2].startTime
const stopTimePathParams = params => params[2] && params[2].stopTime
const startTimePathStored = virtualNode => virtualNode.params && virtualNode.params.startTime
const stopTimePathStored = virtualNode => virtualNode.params && virtualNode.params.stopTime
const checkOutputsEqual = (output0, output1) => Array.isArray(output0)
  ? Array.isArray(output1)
      ? output0.every(x => output1.indexOf(x) !== -1)
      : false
  : output0 === output1

export default ({
  audioContext = new AudioContext(),
  output = audioContext.destination
} = {}) => {
  const customNodes = {}
  return {
    audioContext,
    virtualNodes: {},
    get currentTime () {
      return audioContext.currentTime
    },
    defineNodes (customNodeParams) {
      Object.keys(customNodeParams)
        .forEach(name => customNodes[name] = customNodeParams[name])
      return this
    },
    getAudioNodeById (id) {
      return this.virtualNodes[id].audioNode
    },
    update (virtualGraphParams) {
      const virtualGraphParamsKeys = Object.keys(virtualGraphParams)

      Object.keys(this.virtualNodes).forEach(id => {
        if (virtualGraphParamsKeys.indexOf(id) === -1) {
          const virtualAudioNode = this.virtualNodes[id]
          virtualAudioNode.disconnectAndDestroy()
          Object.keys(this.virtualNodes)
            .forEach(key => this.virtualNodes[key].disconnect(virtualAudioNode))
          delete this.virtualNodes[id]
        }
      })

      virtualGraphParamsKeys.forEach(key => {
        if (key === 'output') throw new Error(`'output' is not a valid id`)
        const virtualAudioNodeParams = virtualGraphParams[key]
        const [paramsNodeName, paramsOutput, paramsParams] = virtualAudioNodeParams
        if (paramsOutput == null && paramsNodeName !== 'mediaStreamDestination') {
          throw new Error(`output not specified for node key ${key}`)
        }
        const virtualAudioNode = this.virtualNodes[key]
        if (virtualAudioNode == null) {
          this.virtualNodes[key] = createVirtualAudioNode(
            audioContext,
            customNodes,
            virtualAudioNodeParams
          )
          return
        }
        if (
          startTimePathParams(virtualAudioNodeParams) !==
            startTimePathStored(virtualAudioNode) ||
          stopTimePathParams(virtualAudioNodeParams) !==
            stopTimePathStored(virtualAudioNode) ||
          paramsNodeName !== virtualAudioNode.node
        ) {
          virtualAudioNode.disconnectAndDestroy()
          Object.keys(this.virtualNodes)
            .forEach(key => this.virtualNodes[key].disconnect(virtualAudioNode))
          this.virtualNodes[key] = createVirtualAudioNode(
            audioContext,
            customNodes,
            virtualAudioNodeParams
          )
          return
        }
        if (!checkOutputsEqual(paramsOutput, virtualAudioNode.output)) {
          virtualAudioNode.disconnect()
          Object.keys(this.virtualNodes)
            .forEach(key => this.virtualNodes[key].disconnect(virtualAudioNode))
          virtualAudioNode.output = paramsOutput
        }

        virtualAudioNode.update(paramsParams)
      })

      connectAudioNodes(
        this.virtualNodes,
        virtualNode => virtualNode.connect(output)
      )

      return this
    }
  }
}
