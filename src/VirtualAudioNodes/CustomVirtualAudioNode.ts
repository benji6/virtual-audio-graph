import connectAudioNodes from '../connectAudioNodes'
import {
  GenericObject,
  mapObj,
  values,
} from '../utils'
import createVirtualAudioNode from '../createVirtualAudioNode'
import VirtualAudioNode from '../VirtualAudioNode'

export default class CustomVirtualAudioNode {
  connected: boolean
  isCustomVirtualNode: boolean
  node: Function
  output: any
  params: object
  virtualNodes: object

  constructor (audioContext: AudioContext, [node, output, params]) {
    this.connected = false
    this.isCustomVirtualNode = true
    this.node = node
    this.output = output
    this.params = params || {}

    this.virtualNodes = mapObj(
      virtualAudioNodeParam => createVirtualAudioNode(audioContext, virtualAudioNodeParam),
      node(params),
    )

    connectAudioNodes(this.virtualNodes, () => {})
  }

  connect (...connectArgs) {
    for (const childVirtualNode of values(this.virtualNodes as GenericObject<any>)) {
      const {output} = childVirtualNode
      if (
        output === 'output' ||
        Array.isArray(output) && output.indexOf('output') !== -1
      ) childVirtualNode.connect(...connectArgs.filter(Boolean))
    }

    this.connected = true
  }

  disconnect () {
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

  disconnectAndDestroy () {
    const keys = Object.keys(this.virtualNodes)
    for (let i = 0; i < keys.length; i++) this.virtualNodes[keys[i]].disconnectAndDestroy()
    this.connected = false
  }

  update (params = {}) {
    const audioGraphParamsFactoryValues = values(this.node(params))
    const keys = Object.keys(this.virtualNodes)
    for (let i = 0; i < keys.length; i++) {
      this.virtualNodes[keys[i]].update(audioGraphParamsFactoryValues[i][2])
    }
    this.params = params
    return this
  }
}
