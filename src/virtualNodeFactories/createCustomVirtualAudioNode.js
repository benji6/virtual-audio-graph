import filter from 'ramda/src/filter'
import map from 'ramda/src/map'
import values from 'ramda/src/values'
import connectAudioNodes from '../connectAudioNodes'
import {asArray} from '../tools'
import createVirtualAudioNode from '../createVirtualAudioNode'

const connect = function (...connectArgs) {
  filter(
    ({output}) => asArray(output).indexOf('output') !== -1,
    values(this.virtualNodes)
  )
    .forEach(childVirtualNode =>
      childVirtualNode.connect(...filter(Boolean, connectArgs)))
  this.connected = true
}

const disconnect = function () {
  filter(
    ({output}) => asArray(output).indexOf('output') !== -1,
    values(this.virtualNodes)
  )
    .forEach(virtualNode => virtualNode.disconnect())
  this.connected = false
}

const disconnectAndDestroy = function () {
  values(this.virtualNodes)
    .forEach(virtualNode => virtualNode.disconnectAndDestroy())
  this.connected = false
}

const update = function (params = {}) {
  const audioGraphParamsFactoryValues = values(this.audioGraphParamsFactory(params))
  values(this.virtualNodes)
    .forEach((childVirtualNode, i) => childVirtualNode
      .update(audioGraphParamsFactoryValues[i][2]))
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
