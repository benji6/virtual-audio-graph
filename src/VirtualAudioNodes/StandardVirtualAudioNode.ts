import { capitalize, equals, find, values } from '../utils'
import {
  audioParamProperties,
  constructorParamsKeys,
  setters,
  startAndStopNodes,
} from '../data'
import CustomVirtualAudioNode from './CustomVirtualAudioNode'
import {
  AudioNodeFactoryParam,
  AudioNodePropertyLookup,
  Output,
  VirtualAudioNode,
  VirtualAudioNodeGraph,
  VirtualAudioNodeParams,
} from '../types'

interface TimeParameters {
  offsetTime: number
  startTime: number
  stopTime: number
}

interface AudioContextFactoryLookup {
  [_: string]: any
}

const createAudioNode = (
  audioContext: AudioContext,
  name: string,
  audioNodeFactoryParam: AudioNodeFactoryParam,
  { offsetTime, startTime, stopTime }: TimeParameters,
) => {
  offsetTime = offsetTime || 0 // tslint:disable-line no-parameter-reassignment
  const audioNodeFactoryName = `create${capitalize(name)}`
  if (typeof (audioContext as AudioContextFactoryLookup)[audioNodeFactoryName] !== 'function') {
    throw new Error(`Unknown node type: ${name}`)
  }

  const audioNode = audioNodeFactoryParam
    ? (audioContext as AudioContextFactoryLookup)[audioNodeFactoryName](audioNodeFactoryParam)
    : (audioContext as AudioContextFactoryLookup)[audioNodeFactoryName]()

  if (startAndStopNodes.indexOf(name) !== -1) {
    if (startTime == null) audioNode.start(audioContext.currentTime, offsetTime)
    else audioNode.start(startTime, offsetTime)
    if (stopTime != null) audioNode.stop(stopTime)
  }
  return audioNode
}

export default class StandardVirtualAudioNode {
  public audioNode: AudioNode
  public connected: boolean = false
  private connections: AudioNode[]
  private stopCalled: boolean

  constructor (
    public readonly node: string,
    public output?: Output,
    public params?: VirtualAudioNodeParams,
    public readonly input?: string,
  ) {
    const stopTime = params && params.stopTime
    this.connections = []
    this.stopCalled = stopTime !== undefined
  }

  connect (...connectArgs: any[]): void {
    const { audioNode } = this
    const filteredConnectArgs = connectArgs.filter(Boolean)
    const [firstArg, ...rest] = filteredConnectArgs
    audioNode.connect && audioNode.connect(firstArg, ...rest)
    this.connections = this.connections.concat(filteredConnectArgs)
    this.connected = true
  }

  disconnect (node?: VirtualAudioNode): void {
    const { audioNode } = this
    if (node) {
      if (node instanceof CustomVirtualAudioNode) {
        for (const childNode of values(node.virtualNodes)) {
          if (!this.connections.some(x => x === childNode.audioNode)) continue
          this.connections = this.connections.filter(x => x !== childNode.audioNode)
        }
      } else {
        if (!this.connections.some(x => x === node.audioNode)) return
        this.connections = this.connections
          .filter(x => x !== node.audioNode)
      }
    }
    audioNode.disconnect && audioNode.disconnect()
    this.connected = false
  }

  disconnectAndDestroy (): void {
    const { audioNode, stopCalled } = this
    if ((audioNode as OscillatorNode).stop && !stopCalled) (audioNode as OscillatorNode).stop()
    audioNode.disconnect && audioNode.disconnect()
    this.connected = false
  }

  initialize (audioContext: AudioContext): this {
    const params = this.params || {}
    const constructorParam = params[find(
      key => constructorParamsKeys.indexOf(key) !== -1,
      Object.keys(params),
    )]
    const { offsetTime, startTime, stopTime } = params

    this.audioNode = createAudioNode(
      audioContext,
      this.node,
      constructorParam,
      { offsetTime, startTime, stopTime },
    )

    this.params = undefined

    return this.update(params)
  }

  update (params: VirtualAudioNodeParams = {}): this {
    const audioNode: AudioNodePropertyLookup = this.audioNode
    for (const key of Object.keys(params)) {
      if (constructorParamsKeys.indexOf(key) !== -1) continue
      const param = params[key]
      if (this.params && this.params[key] === param) continue
      if (audioParamProperties.indexOf(key) !== -1) {
        if (Array.isArray(param)) {
          if (this.params && !equals(param, this.params[key])) {
            audioNode[key].cancelScheduledValues(0)
          }
          const callMethod = ([methodName, ...args]) => audioNode[key][methodName](...args)
          Array.isArray(param[0]) ? param.forEach(callMethod) : callMethod(param)
          continue
        }
        audioNode[key].value = param
        continue
      }
      if (setters.indexOf(key) !== -1) {
        audioNode[`set${capitalize(key)}`](...param)
        continue
      }
      audioNode[key] = param
    }
    this.params = params
    return this
  }
}
