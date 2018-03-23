import { equals } from './utils'
import connectAudioNodes from './connectAudioNodes'
import createVirtualAudioNode from './createVirtualAudioNode'
import VirtualAudioNode from './VirtualAudioNode'
import CustomVirtualAudioNode from './VirtualAudioNodes/CustomVirtualAudioNode'
import StandardVirtualAudioNode from './VirtualAudioNodes/StandardVirtualAudioNode'

interface VirtualAudioNodes {
  [key: string]: VirtualAudioNode
}

export default class VirtualAudioGraph {
  virtualNodes: VirtualAudioNodes = {}

  constructor (
    public readonly audioContext: AudioContext,
    public readonly output: AudioDestinationNode,
  ) {}

  get currentTime (): number {
    return this.audioContext.currentTime
  }

  disconnectParents (vNode: VirtualAudioNode): void {
    const {virtualNodes} = this

    for (const key of Object.keys(virtualNodes)) {
      (virtualNodes[key] as StandardVirtualAudioNode).disconnect(vNode)
    }
  }

  getAudioNodeById (id: string): AudioNode | void {
    const vNode = this.virtualNodes[id]
    return vNode && (vNode as StandardVirtualAudioNode).audioNode
  }

  update (newGraph): this {
    for (const id of Object.keys(this.virtualNodes)) {
      if (newGraph.hasOwnProperty(id)) continue
      const virtualAudioNode = this.virtualNodes[id]
      virtualAudioNode.disconnectAndDestroy()
      this.disconnectParents(virtualAudioNode)
      delete this.virtualNodes[id]
    }

    for (const key of Object.keys(newGraph)) {
      if (key === 'output') throw new Error('"output" is not a valid id')
      const newNodeParams = newGraph[key]
      const [paramsNodeName, paramsOutput, paramsParams] = newNodeParams
      if (paramsOutput == null && paramsNodeName !== 'mediaStreamDestination') {
        throw new Error(`output not specified for node key ${key}`)
      }
      const virtualAudioNode = this.virtualNodes[key]
      if (virtualAudioNode == null) {
        this.virtualNodes[key] = createVirtualAudioNode(this.audioContext, newNodeParams)
        continue
      }
      if (
        (paramsParams && paramsParams.startTime) !==
          (virtualAudioNode.params && virtualAudioNode.params.startTime) ||
        (paramsParams && paramsParams.stopTime) !==
          (virtualAudioNode.params && virtualAudioNode.params.stopTime) ||
        paramsNodeName !== virtualAudioNode.node
      ) {
        virtualAudioNode.disconnectAndDestroy()
        this.disconnectParents(virtualAudioNode)
        this.virtualNodes[key] = createVirtualAudioNode(this.audioContext, newNodeParams)
        continue
      }
      if (!equals(paramsOutput, virtualAudioNode.output)) {
        (virtualAudioNode as CustomVirtualAudioNode).disconnect()
        this.disconnectParents(virtualAudioNode)
        virtualAudioNode.output = paramsOutput
      }

      virtualAudioNode.update(paramsParams)
    }

    connectAudioNodes(
      this.virtualNodes,
      (vNode: VirtualAudioNode) => vNode.connect(this.output),
    )

    return this
  }
}
