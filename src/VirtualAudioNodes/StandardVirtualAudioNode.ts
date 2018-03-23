import { capitalize, equals, find } from '../utils'
import {
  audioParamProperties,
  constructorParamsKeys,
  setters,
  startAndStopNodes,
} from '../data'
import CustomVirtualAudioNode from './CustomVirtualAudioNode'
import VirtualAudioNode from '../VirtualAudioNode'

const createAudioNode = (
  audioContext: AudioContext,
  name: string,
  constructorParam,
  {offsetTime, startTime, stopTime},
) => {
  offsetTime = offsetTime || 0
  const func = `create${capitalize(name)}`
  if (typeof audioContext[func] !== 'function') { throw new Error(`Unknown node type: ${name}`) }

  const audioNode = constructorParam
    ? audioContext[func](constructorParam)
    : audioContext[func]()

  if (startAndStopNodes.indexOf(name) !== -1) {
    if (startTime == null) audioNode.start(audioContext.currentTime, offsetTime); else audioNode.start(startTime, offsetTime)
    if (stopTime != null) audioNode.stop(stopTime)
  }
  return audioNode
}

export default class StandardVirtualAudioNode {
  audioNode: any
  connected: boolean
  connections: any[]
  isCustomVirtualNode: boolean
  params: any
  stopCalled: boolean

  constructor (
    audioContext: AudioContext,
    public readonly node: string,
    public output?: any,
    params?,
    public readonly input?: string,
  ) {
    const paramsObj = params || {}
    const {offsetTime, startTime, stopTime} = paramsObj
    const constructorParam = paramsObj[find(key => constructorParamsKeys.indexOf(key) !== -1, Object.keys(paramsObj))]

    this.audioNode = createAudioNode(audioContext, node, constructorParam, {offsetTime, startTime, stopTime})
    this.connected = false
    this.connections = []
    this.isCustomVirtualNode = false
    this.stopCalled = stopTime !== undefined

    this.update(paramsObj)
  }

  connect (...connectArgs): void {
    const {audioNode} = this
    const filteredConnectArgs = connectArgs.filter(Boolean)
    audioNode.connect && audioNode.connect(...filteredConnectArgs)
    this.connections = this.connections.concat(filteredConnectArgs)
    this.connected = true
  }

  disconnect (node: VirtualAudioNode): void {
    const {audioNode} = this
    if (node) {
      if (node.isCustomVirtualNode) {
        for (const key of Object.keys((node as CustomVirtualAudioNode).virtualNodes)) {
          const childNode = (node as CustomVirtualAudioNode).virtualNodes[key]
          if (!this.connections.some(x => x === childNode.audioNode)) continue
          this.connections = this.connections.filter(x => x !== childNode.audioNode)
        }
      } else {
        if (!this.connections.some(x => x === (node as StandardVirtualAudioNode).audioNode)) return
        this.connections = this.connections.filter(x => x !== (node as StandardVirtualAudioNode).audioNode)
      }
    }
    audioNode.disconnect && audioNode.disconnect()
    this.connected = false
  }

  disconnectAndDestroy (): void {
    const {audioNode, stopCalled} = this
    if (audioNode.stop && !stopCalled) audioNode.stop()
    audioNode.disconnect && audioNode.disconnect()
    this.connected = false
  }

  update (params = {}): this {
    for (const key of Object.keys(params)) {
      if (constructorParamsKeys.indexOf(key) !== -1) continue
      const param = params[key]
      if (this.params && this.params[key] === param) continue
      if (audioParamProperties.indexOf(key) !== -1) {
        if (Array.isArray(param)) {
          if (this.params && !equals(param, this.params[key])) {
            this.audioNode[key].cancelScheduledValues(0)
          }
          const callMethod = ([methodName, ...args]) => this.audioNode[key][methodName](...args)
          Array.isArray(param[0]) ? param.forEach(callMethod) : callMethod(param)
          continue
        }
        this.audioNode[key].value = param
        continue
      }
      if (setters.indexOf(key) !== -1) {
        this.audioNode[`set${capitalize(key)}`](...param)
        continue
      }
      this.audioNode[key] = param
    }
    this.params = params
    return this
  }
}
