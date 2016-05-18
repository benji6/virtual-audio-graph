/* global AudioContext */
import {equals} from 'ramda'
import {forEach} from './utils'
import connectAudioNodes from './connectAudioNodes'
import createVirtualAudioNode from './createVirtualAudioNode'

const disconnectParents = (virtualNode, virtualNodes) => forEach(
  key => virtualNodes[key].disconnect(virtualNode),
  Object.keys(virtualNodes)
)

export default ({
  audioContext = new AudioContext(),
  output = audioContext.destination
} = {}) => {
  return {
    audioContext,
    virtualNodes: {},
    get currentTime () { return audioContext.currentTime },
    getAudioNodeById (id) { return this.virtualNodes[id].audioNode },
    update (newGraph) {
      forEach(id => {
        if (newGraph.hasOwnProperty(id)) return
        const virtualAudioNode = this.virtualNodes[id]
        virtualAudioNode.disconnectAndDestroy()
        disconnectParents(virtualAudioNode, this.virtualNodes)
        delete this.virtualNodes[id]
      }, Object.keys(this.virtualNodes))

      forEach(key => {
        if (key === 'output') throw new Error('"output" is not a valid id')
        const newNodeParams = newGraph[key]
        const [paramsNodeName, paramsOutput, paramsParams] = newNodeParams
        if (paramsOutput == null && paramsNodeName !== 'mediaStreamDestination') {
          throw new Error(`output not specified for node key ${key}`)
        }
        const virtualAudioNode = this.virtualNodes[key]
        if (virtualAudioNode == null) {
          this.virtualNodes[key] = createVirtualAudioNode(
            audioContext,
            newNodeParams
          )
          return
        }
        if (
          (paramsParams && paramsParams.startTime) !==
            (virtualAudioNode.params && virtualAudioNode.params.startTime) ||
          (paramsParams && paramsParams.stopTime) !==
            (virtualAudioNode.params && virtualAudioNode.params.stopTime) ||
          paramsNodeName !== virtualAudioNode.node
        ) {
          virtualAudioNode.disconnectAndDestroy()
          disconnectParents(virtualAudioNode, this.virtualNodes)
          this.virtualNodes[key] = createVirtualAudioNode(
            audioContext,
            newNodeParams
          )
          return
        }
        if (!equals(paramsOutput, virtualAudioNode.output)) {
          virtualAudioNode.disconnect()
          disconnectParents(virtualAudioNode, this.virtualNodes)
          virtualAudioNode.output = paramsOutput
        }

        virtualAudioNode.update(paramsParams)
      }, Object.keys(newGraph))

      connectAudioNodes(
        this.virtualNodes,
        virtualNode => virtualNode.connect(output)
      )

      return this
    }
  }
}
