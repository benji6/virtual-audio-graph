/* global AudioContext */
import forEach from 'lodash.foreach'
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

const disconnectParents = (virtualNode, virtualNodes) => forEach(
  Object.keys(virtualNodes),
  key => virtualNodes[key].disconnect(virtualNode)
)

export default ({
  audioContext = new AudioContext(),
  output = audioContext.destination
} = {}) => {
  return {
    audioContext,
    virtualNodes: {},
    get currentTime () {
      return audioContext.currentTime
    },
    getAudioNodeById (id) {
      return this.virtualNodes[id].audioNode
    },
    update (virtualGraphParams) {
      const virtualGraphParamsKeys = Object.keys(virtualGraphParams)

      forEach(Object.keys(this.virtualNodes), id => {
        if (virtualGraphParamsKeys.indexOf(id) === -1) {
          const virtualAudioNode = this.virtualNodes[id]
          virtualAudioNode.disconnectAndDestroy()
          disconnectParents(virtualAudioNode, this.virtualNodes)
          delete this.virtualNodes[id]
        }
      })

      forEach(virtualGraphParamsKeys, key => {
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
          disconnectParents(virtualAudioNode, this.virtualNodes)
          this.virtualNodes[key] = createVirtualAudioNode(
            audioContext,
            virtualAudioNodeParams
          )
          return
        }
        if (!checkOutputsEqual(paramsOutput, virtualAudioNode.output)) {
          virtualAudioNode.disconnect()
          disconnectParents(virtualAudioNode, this.virtualNodes)
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
