import filter from 'ramda/src/filter'
import forEach from 'ramda/src/forEach'
import map from 'ramda/src/map'
import values from 'ramda/src/values'
import connectAudioNodes from '../connectAudioNodes'
import {asArray, forEachIndexed} from '../tools'
import createVirtualAudioNode from '../createVirtualAudioNode'

const connect = function (...connectArgs) {
  forEach(
    childVirtualNode => childVirtualNode.connect(...filter(Boolean, connectArgs)),
    filter(
      ({output}) => asArray(output).indexOf('output') !== -1,
      values(this.virtualNodes)
    )
  )
  this.connected = true
}

const disconnect = function () {
  forEach(
    virtualNode => virtualNode.disconnect(),
    filter(
      ({output}) => asArray(output).indexOf('output') !== -1,
      values(this.virtualNodes)
    )
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

const createCustomVirtualAudioNode = (audioContext, customNodes, [node, output, params]) => {
  params = params || {}
  const audioGraphParamsFactory = customNodes[node]
  const virtualNodes = map(virtualAudioNodeParam => createVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParam),
                              audioGraphParamsFactory(params))

  connectAudioNodes(virtualNodes)

  return {
    audioGraphParamsFactory,
    connect,
    connected: false,
    disconnect,
    disconnectAndDestroy,
    isCustomVirtualNode: true,
    node,
    output,
    params,
    update,
    virtualNodes
  }
}

export default createCustomVirtualAudioNode
