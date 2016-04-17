import map from 'ramda/src/map'
import values from 'ramda/src/values'
import connectAudioNodes from '../connectAudioNodes'
import {asArray, filter, forEach, forEachIndexed} from '../utils'
import createVirtualAudioNode from '../createVirtualAudioNode'

const connect = function (...connectArgs) {
  forEach(
    filter(
      ({output}) => asArray(output).indexOf('output') !== -1,
      values(this.virtualNodes)
    ),
    childVirtualNode => childVirtualNode.connect(...filter(Boolean, connectArgs))
  )
  this.connected = true
}

const disconnect = function () {
  forEach(
    filter(
      ({output}) => asArray(output).indexOf('output') !== -1,
      values(this.virtualNodes)
    ),
    virtualNode => virtualNode.disconnect()
  )
  this.connected = false
}

const disconnectAndDestroy = function () {
  forEach(values(this.virtualNodes), virtualNode => virtualNode.disconnectAndDestroy())
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
