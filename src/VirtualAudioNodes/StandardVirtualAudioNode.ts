import { capitalize, equals, filter, find, forEach } from '../utils'
import {
  audioParamProperties,
  constructorParamsKeys,
  setters,
  startAndStopNodes,
} from '../data'

const createAudioNode = (audioContext, name, constructorParam, {offsetTime, startTime, stopTime}) => {
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
  input: any
  isCustomVirtualNode: boolean
  node: string
  output: any
  params: any
  stopCalled: boolean

  constructor (audioContext: AudioContext, [node, output, params, input]) {
    const paramsObj = params || {}
    const {offsetTime, startTime, stopTime} = paramsObj
    const constructorParam = paramsObj[find(key => constructorParamsKeys.indexOf(key) !== -1, Object.keys(paramsObj))]

    this.audioNode = createAudioNode(audioContext, node, constructorParam, {offsetTime, startTime, stopTime})
    this.connected = false
    this.connections = []
    this.input = input
    this.isCustomVirtualNode = false
    this.node = node
    this.output = output
    this.stopCalled = stopTime !== undefined

    this.update(paramsObj)
  }

  connect (...connectArgs) {
    const {audioNode} = this
    const filteredConnectArgs = filter(Boolean, connectArgs)
    audioNode.connect && audioNode.connect(...filteredConnectArgs)
    this.connections = this.connections.concat(filteredConnectArgs)
    this.connected = true
  }

  disconnect (node) {
    const {audioNode} = this
    if (node) {
      if (node.isCustomVirtualNode) {
        forEach(key => {
          const childNode = node.virtualNodes[key]
          if (!this.connections.some(x => x === childNode.audioNode)) return
          this.connections = filter(
            x => x !== childNode.audioNode,
            this.connections,
          )
        }, Object.keys(node.virtualNodes))
      } else {
        if (!this.connections.some(x => x === node.audioNode)) return
        this.connections = filter(x => x !== node.audioNode, this.connections)
      }
    }
    audioNode.disconnect && audioNode.disconnect()
    this.connected = false
  }

  disconnectAndDestroy () {
    const {audioNode, stopCalled} = this
    if (audioNode.stop && !stopCalled) audioNode.stop()
    audioNode.disconnect && audioNode.disconnect()
    this.connected = false
  }

  update (params = {}) {
    forEach(key => {
      if (constructorParamsKeys.indexOf(key) !== -1) return
      const param = params[key]
      if (this.params && this.params[key] === param) return
      if (audioParamProperties.indexOf(key) !== -1) {
        if (Array.isArray(param)) {
          if (this.params && !equals(param, this.params[key])) {
            this.audioNode[key].cancelScheduledValues(0)
          }
          const callMethod = ([methodName, ...args]) => this.audioNode[key][methodName](...args)
          Array.isArray(param[0]) ? forEach(callMethod, param) : callMethod(param)
          return
        }
        this.audioNode[key].value = param
        return
      }
      if (setters.indexOf(key) !== -1) {
        this.audioNode[`set${capitalize(key)}`](...param)
        return
      }
      this.audioNode[key] = param
    }, Object.keys(params))
    this.params = params
    return this
  }
}
