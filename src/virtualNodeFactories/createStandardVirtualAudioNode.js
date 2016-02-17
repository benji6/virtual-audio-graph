import {capitalize} from '../tools'
import {
  audioParamProperties,
  constructorParamsKeys,
  setters,
  startAndStopNodes
} from '../data'
import deepEqual from 'deep-equal'

const connect = function (...connectArgs) {
  const {audioNode} = this
  audioNode.connect && audioNode.connect(...connectArgs.filter(Boolean))
  this.connected = true
}

const createAudioNode = (audioContext, name, constructorParam, {startTime, stopTime}) => {
  const audioNode = constructorParam
    ? audioContext[`create${capitalize(name)}`](constructorParam)
    : audioContext[`create${capitalize(name)}`]()
  if (startAndStopNodes.indexOf(name) !== -1) {
    if (startTime == null) audioNode.start(); else audioNode.start(startTime)
    if (stopTime != null) audioNode.stop(stopTime)
  }
  return audioNode
}

const disconnect = function () {
  const {audioNode} = this
  audioNode.disconnect && audioNode.disconnect()
  this.connected = false
}

const disconnectAndDestroy = function () {
  const {audioNode, stopCalled} = this
  if (audioNode.stop && !stopCalled) audioNode.stop()
  audioNode.disconnect && audioNode.disconnect()
  this.connected = false
}

const update = function (params = {}) {
  Object.keys(params).forEach(key => {
    if (constructorParamsKeys.indexOf(key) !== -1) return
    const param = params[key]
    if (this.params && this.params[key] === param) return
    if (audioParamProperties.indexOf(key) !== -1) {
      if (Array.isArray(param)) {
        if (this.params && !deepEqual(param, this.params[key], {strict: true})) {
          this.audioNode[key].cancelScheduledValues(0)
        }
        const callMethod = ([methodName, ...args]) => this.audioNode[key][methodName](...args)
        Array.isArray(param[0]) ? param.forEach(callMethod) : callMethod(param)
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
  })
  this.params = params
  return this
}

export default (audioContext, [node, output, params, input]) => {
  params = params || {}
  const {startTime, stopTime} = params
  const constructorParam = params[Object.keys(params).filter(key => constructorParamsKeys.indexOf(key) !== -1)[0]]
  const virtualNode = {
    audioNode: createAudioNode(audioContext, node, constructorParam, {startTime, stopTime}),
    connect,
    connected: false,
    disconnect,
    disconnectAndDestroy,
    isCustomVirtualNode: false,
    input,
    node,
    output,
    stopCalled: stopTime !== undefined,
    update
  }
  return virtualNode.update(params)
}
