import map from 'ramda/src/map'
import connectAudioNodes from '../connectAudioNodes'
import {asArray, filter, forEach, forEachIndexed, values} from '../utils'
import createVirtualAudioNode from '../createVirtualAudioNode'

const connect = function (...connectArgs) {
  forEach(
    childVirtualNode => asArray(childVirtualNode.output).indexOf('output') !== -1 &&
      childVirtualNode.connect(...filter(Boolean, connectArgs)),
    values(this.virtualNodes)
  )
  this.connected = true
}

const disconnect = function () {
  forEach(
    virtualNode => asArray(virtualNode.output).indexOf('output') !== -1 && virtualNode.disconnect(),
    values(this.virtualNodes)
  )
  this.connected = false
}

const disconnectAndDestroy = function () {
  forEach(virtualNode => virtualNode.disconnectAndDestroy(), values(this.virtualNodes))
  this.connected = false
}

const update = function (params = {}) {
  const audioGraphParamsFactoryValues = values(this.audioGraphParamsFactory(params))
  forEachIndexed(
    (childVirtualNode, i) => childVirtualNode.update(audioGraphParamsFactoryValues[i][2]),
    values(this.virtualNodes)
  )
  this.params = params
  return this
}

const createCustomVirtualAudioNode = (audioContext, [audioGraphParamsFactory, output, params]) => {
  params = params || {}

  const virtualNodes = map(
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
    virtualNodes
  }
}

export default createCustomVirtualAudioNode
