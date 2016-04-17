import forEach from 'lodash.foreach'
import filter from 'ramda/src/filter'
import values from 'ramda/src/values'
import {asArray} from './tools'

export default (virtualGraph, handleConnectionToOutput = () => {}) =>
  forEach(Object.keys(virtualGraph), id => {
    const virtualNode = virtualGraph[id]
    const {output} = virtualNode
    if (virtualNode.connected || output == null) return
    forEach(asArray(output), output => {
      if (output === 'output') return handleConnectionToOutput(virtualNode)

      if (Object.prototype.toString.call(output) === '[object Object]') {
        const {key, destination, inputs, outputs} = output

        if (key == null) {
          throw new Error(`id: ${id} - output object requires a key property`)
        }
        if (inputs) {
          if (inputs.length !== outputs.length) {
            throw new Error(`id: ${id} - outputs and inputs arrays are not the same length`)
          }
          return forEach(
            inputs,
            (input, i) => virtualNode.connect(virtualGraph[key].audioNode, outputs[i], input)
          )
        }
        return virtualNode.connect(virtualGraph[key].audioNode[destination])
      }

      const destinationVirtualAudioNode = virtualGraph[output]

      if (destinationVirtualAudioNode.isCustomVirtualNode) {
        return forEach(
          filter(
            ({input}) => input === 'input',
            values(destinationVirtualAudioNode.virtualNodes)
          ),
          node => virtualNode.connect(node.audioNode)
        )
      }

      virtualNode.connect(destinationVirtualAudioNode.audioNode)
    })
  })
