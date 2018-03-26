import connectAudioNodes from '../connectAudioNodes'
import {
  GenericObject,
  mapObj,
  values,
} from '../utils'
import createVirtualAudioNode from '../createVirtualAudioNode'
import { VirtualAudioNode, VirtualAudioNodeGraph } from '../types'

export default class CustomVirtualAudioNode {
  public readonly audioNode = undefined
  connected: boolean
  params: object
  virtualNodes: VirtualAudioNodeGraph

  constructor (
    audioContext: AudioContext,
    public readonly node: any,
    public output?: any,
    params?: any,
  ) {
    this.connected = false
    this.params = params || {}

    this.virtualNodes = mapObj(
      (virtualAudioNodeParam: [any, any, any, any]) => createVirtualAudioNode(
        audioContext,
        virtualAudioNodeParam,
      ),
      node(params),
    )

    connectAudioNodes(this.virtualNodes, () => {})
  }

  connect (...connectArgs): void {
    for (const childVirtualNode of values(this.virtualNodes)) {
      const { output } = childVirtualNode
      if (
        output === 'output' ||
        Array.isArray(output) && output.indexOf('output') !== -1
      ) childVirtualNode.connect(...connectArgs.filter(Boolean))
    }

    this.connected = true
  }

  disconnect (node?: VirtualAudioNode): void {
    const keys = Object.keys(this.virtualNodes)
    for (let i = 0; i < keys.length; i++) {
      const virtualNode = this.virtualNodes[keys[i]]
      const { output } = virtualNode
      if (
        output === 'output' ||
        Array.isArray(output) && output.indexOf('output') !== -1
      ) virtualNode.disconnect()
    }
    this.connected = false
  }

  disconnectAndDestroy (): void {
    const keys = Object.keys(this.virtualNodes)
    for (let i = 0; i < keys.length; i++) this.virtualNodes[keys[i]].disconnectAndDestroy()
    this.connected = false
  }

  update (params = {}): this {
    const audioGraphParamsFactoryValues = values(this.node(params))
    const keys = Object.keys(this.virtualNodes)
    for (let i = 0; i < keys.length; i++) {
      this.virtualNodes[keys[i]].update(audioGraphParamsFactoryValues[i][2])
    }
    this.params = params
    return this
  }
}
