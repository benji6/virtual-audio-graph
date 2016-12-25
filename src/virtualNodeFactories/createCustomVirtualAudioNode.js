import connectAudioNodes from '../connectAudioNodes'
import {
  filter,
  forEach,
  mapObj,
  values,
} from '../utils'
import createVirtualAudioNode from '../createVirtualAudioNode'

const connect = function (...connectArgs) {
  forEach(
    childVirtualNode => {
      const {output} = childVirtualNode
      if (
        output === 'output' ||
        Array.isArray(output) && output.indexOf('output') !== -1
      ) childVirtualNode.connect(...filter(Boolean, connectArgs))
    },
    values(this.virtualNodes)
  )
  this.connected = true
}

const disconnect = function () {
  const keys = Object.keys(this.virtualNodes)
  for (let i = 0; i < keys.length; i++) {
    const virtualNode = this.virtualNodes[keys[i]]
    const {output} = virtualNode
    if (
      output === 'output' ||
      Array.isArray(output) && output.indexOf('output') !== -1
    ) virtualNode.disconnect()
  }
  this.connected = false
}

const disconnectAndDestroy = function () {
  const keys = Object.keys(this.virtualNodes)
  for (let i = 0; i < keys.length; i++) this.virtualNodes[keys[i]].disconnectAndDestroy()
  this.connected = false
}

const update = function (params = {}) {
  const audioGraphParamsFactoryValues = values(this.audioGraphParamsFactory(params))
  const keys = Object.keys(this.virtualNodes)
  for (let i = 0; i < keys.length; i++) {
    this.virtualNodes[keys[i]].update(audioGraphParamsFactoryValues[i][2])
  }
  this.params = params
  return this
}

const createCustomVirtualAudioNode = (audioContext, [audioGraphParamsFactory, output, params]) => {
  params = params || {}

  const virtualNodes = mapObj(
    virtualAudioNodeParam => createVirtualAudioNode(audioContext, virtualAudioNodeParam),
    audioGraphParamsFactory(params)
  )

  connectAudioNodes(virtualNodes)

  return {
    audioGraphParamsFactory,
    connect,
    connected: false,
    disconnect,
    disconnectAndDestroy,
    isCustomVirtualNode: true,
    node: audioGraphParamsFactory,
    output,
    params,
    update,
    virtualNodes,
  }
}

export default createCustomVirtualAudioNode
