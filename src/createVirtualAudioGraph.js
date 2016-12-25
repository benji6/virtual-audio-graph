/* global AudioContext */
import {equals, forEach} from './utils'
import connectAudioNodes from './connectAudioNodes'
import createVirtualAudioNode from './createVirtualAudioNode'

const disconnectParents = (virtualNode, virtualNodes) => forEach(
  key => virtualNodes[key].disconnect(virtualNode),
  Object.keys(virtualNodes)
)

export default ({
  audioContext = new AudioContext(),
  output = audioContext.destination,
} = {}) => {
  return {
    audioContext,
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
        const {node, output, params} = newNodeParams
        const virtualAudioNode = this.virtualNodes[key]
        if (virtualAudioNode == null) {
          this.virtualNodes[key] = createVirtualAudioNode(audioContext, newNodeParams)
          return
        }
        if (
          (params && params.startTime) !==
            (virtualAudioNode.params && virtualAudioNode.params.startTime) ||
          (params && params.stopTime) !==
            (virtualAudioNode.params && virtualAudioNode.params.stopTime) ||
          node !== virtualAudioNode.node
        ) {
          virtualAudioNode.disconnectAndDestroy()
          disconnectParents(virtualAudioNode, this.virtualNodes)
          this.virtualNodes[key] = createVirtualAudioNode(audioContext, newNodeParams)
          return
        }
        if (!equals(output, virtualAudioNode.output)) {
          virtualAudioNode.disconnect()
          disconnectParents(virtualAudioNode, this.virtualNodes)
          virtualAudioNode.output = output
        }

        virtualAudioNode.update(params)
      }, Object.keys(newGraph))

      connectAudioNodes(
        this.virtualNodes,
        virtualNode => virtualNode.connect(output)
      )

      return this
    },
    virtualNodes: {},
  }
}
