import connectAudioNodes from '../connectAudioNodes'
import { mapObj, values } from '../utils'
import {
  CustomVirtualAudioNodeFactory,
  Output,
  VirtualAudioNode,
  VirtualAudioNodeGraph,
  VirtualAudioNodeParams,
} from '../types'

export default class CustomVirtualAudioNode {
  public readonly audioNode: undefined = undefined
  public connected: boolean
  public params: VirtualAudioNodeParams
  public virtualNodes: VirtualAudioNodeGraph

  constructor (
    public readonly node: CustomVirtualAudioNodeFactory,
    public output?: Output,
    params?: VirtualAudioNodeParams,
  ) {
    this.connected = false
    this.params = params || {}
  }

  connect (...connectArgs: any[]): void {
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
    for (const virtualNode of values(this.virtualNodes)) {
      const { output } = virtualNode
      if (
        output === 'output' ||
        Array.isArray(output) && output.indexOf('output') !== -1
      ) virtualNode.disconnect()
    }
    this.connected = false
  }

  disconnectAndDestroy (): void {
    for (const virtualNode of values(this.virtualNodes)) virtualNode.disconnectAndDestroy()
    this.connected = false
  }

  initialize (audioContext: AudioContext): this {
    this.virtualNodes = mapObj(
      (virtualAudioNodeParam: VirtualAudioNode) => virtualAudioNodeParam.initialize(
        audioContext,
      ),
      this.node(this.params),
    )

    connectAudioNodes(this.virtualNodes, () => {})

    return this
  }

  update (params: VirtualAudioNodeParams = {}): this {
    const audioGraphParamsFactoryValues = values(this.node(params))
    const keys = Object.keys(this.virtualNodes)
    for (let i = 0; i < keys.length; i++) {
      const p = audioGraphParamsFactoryValues[i]
      this.virtualNodes[keys[i]].update(p.params)
    }
    this.params = params
    return this
  }
}
