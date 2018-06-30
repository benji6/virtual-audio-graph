import connectAudioNodes from '../connectAudioNodes'
import {
  CustomVirtualAudioNodeFactory,
  IVirtualAudioNodeGraph,
  IVirtualAudioNodeParams,
  Output,
  VirtualAudioNode,
} from '../types'
import { mapObj, values } from '../utils'

export default class CustomVirtualAudioNode {
  public readonly audioNode: undefined = undefined
  public connected: boolean = false
  public params: IVirtualAudioNodeParams
  public virtualNodes: IVirtualAudioNodeGraph

  constructor(
    public readonly node: CustomVirtualAudioNodeFactory,
    public output?: Output,
    params?: IVirtualAudioNodeParams,
  ) {
    this.params = params || {}
  }

  public connect(...connectArgs: any[]): void {
    for (const childVirtualNode of values(this.virtualNodes)) {
      const { output } = childVirtualNode
      if (
        output === 'output' ||
        (Array.isArray(output) && output.indexOf('output') !== -1)
      ) {
        childVirtualNode.connect(...connectArgs.filter(Boolean))
      }
    }

    this.connected = true
  }

  public disconnect(node?: VirtualAudioNode): void {
    for (const virtualNode of values(this.virtualNodes)) {
      const { output } = virtualNode
      if (
        output === 'output' ||
        (Array.isArray(output) && output.indexOf('output') !== -1)
      ) {
        virtualNode.disconnect()
      }
    }
    this.connected = false
  }

  public disconnectAndDestroy(): void {
    for (const virtualNode of values(this.virtualNodes)) {
      virtualNode.disconnectAndDestroy()
    }
    this.connected = false
  }

  public initialize(audioContext: AudioContext): this {
    this.virtualNodes = mapObj(
      (virtualAudioNodeParam: VirtualAudioNode) =>
        virtualAudioNodeParam.initialize(audioContext),
      this.node(this.params),
    )

    connectAudioNodes(this.virtualNodes, () => {})

    return this
  }

  public update(params: IVirtualAudioNodeParams = {}): this {
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
