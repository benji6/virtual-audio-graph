import {
  IVirtualAudioNodeGraph,
  IVirtualAudioNodeParams,
  Output,
  VirtualAudioNode,
} from '../types'
import { equals, find, values } from '../utils'
import CustomVirtualAudioNode from './CustomVirtualAudioNode'

interface IWindow {
  AudioWorkletNode?: any
}

export default class AudioWorkletVirtualAudioNode {
  public audioNode: AudioNode
  public connected: boolean = false
  private connections: AudioNode[] = []

  constructor(
    public readonly node: string,
    public output?: Output,
    public params?: IVirtualAudioNodeParams,
    public readonly input?: string,
  ) {}

  public connect(...connectArgs: any[]): void {
    const { audioNode } = this
    const filteredConnectArgs = connectArgs.filter(Boolean)
    const [firstArg, ...rest] = filteredConnectArgs
    if (audioNode.connect) {
      audioNode.connect(firstArg, ...rest)
    }
    this.connections = this.connections.concat(filteredConnectArgs)
    this.connected = true
  }

  public disconnect(node?: VirtualAudioNode): void {
    const { audioNode } = this
    if (node) {
      if (node instanceof CustomVirtualAudioNode) {
        for (const childNode of values(node.virtualNodes)) {
          if (!this.connections.some(x => x === childNode.audioNode)) continue
          this.connections = this.connections.filter(
            x => x !== childNode.audioNode,
          )
        }
      } else {
        if (!this.connections.some(x => x === node.audioNode)) return
        this.connections = this.connections.filter(x => x !== node.audioNode)
      }
    }
    if (audioNode.disconnect) audioNode.disconnect()
    this.connected = false
  }

  public disconnectAndDestroy(): void {
    const { audioNode } = this
    if (audioNode.disconnect) audioNode.disconnect()
    this.connected = false
  }

  public initialize(audioContext: AudioContext): this {
    const params = this.params || {}
    this.audioNode = new (window as IWindow).AudioWorkletNode(
      audioContext,
      this.node,
    )

    this.params = undefined

    return this.update(params)
  }

  public update(params: IVirtualAudioNodeParams = {}): this {
    const audioNode = this.audioNode
    for (const key of Object.keys(params)) {
      const param = params[key]

      if (this.params && this.params[key] === param) continue

      const paramInstance = (audioNode as any).parameters.get(key)

      if (Array.isArray(param)) {
        if (this.params && !equals(param, this.params[key])) {
          ;(audioNode as any).parameters.get(key).cancelScheduledValues(0)
        }
        const callMethod = ([methodName, ...args]) =>
          paramInstance[methodName](...args)
        Array.isArray(param[0]) ? param.forEach(callMethod) : callMethod(param)
        continue
      }
      paramInstance.value = param
    }
    this.params = params
    return this
  }
}
