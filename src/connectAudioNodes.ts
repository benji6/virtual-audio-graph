import { forEach, values } from './utils'

export default (virtualGraph, handleConnectionToOutput) =>
  forEach(id => {
    const virtualNode = virtualGraph[id]
    const {output} = virtualNode
    if (virtualNode.connected || output == null) return
    forEach(output => {
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
            (input, i) => virtualNode.connect(virtualGraph[key].audioNode, outputs[i], input),
            inputs,
          )
        }
        return virtualNode.connect(virtualGraph[key].audioNode[destination])
      }

      const destinationVirtualAudioNode = virtualGraph[output]

      if (destinationVirtualAudioNode.isCustomVirtualNode) {
        return forEach(
          node => node.input === 'input' && virtualNode.connect(node.audioNode),
          values(destinationVirtualAudioNode.virtualNodes),
        )
      }

      virtualNode.connect(destinationVirtualAudioNode.audioNode)
    }, Array.isArray(output) ? output : [output])
  }, Object.keys(virtualGraph))
