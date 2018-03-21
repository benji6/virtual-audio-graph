import { values } from './utils'

export default (virtualGraph, handleConnectionToOutput) => {
  for (const id of Object.keys(virtualGraph)) {
    const virtualNode = virtualGraph[id]

    if (virtualNode.connected || virtualNode.output == null) continue

    for (const output of [].concat(virtualNode.output)) {
      if (output === 'output') {
        handleConnectionToOutput(virtualNode)
        continue
      }

      if (Object.prototype.toString.call(output) === '[object Object]') {
        const {key, destination, inputs, outputs} = output

        if (key == null) {
          throw new Error(`id: ${id} - output object requires a key property`)
        }
        if (inputs) {
          if (inputs.length !== outputs.length) {
            throw new Error(`id: ${id} - outputs and inputs arrays are not the same length`)
          }
          for (let i = 0; i++, i < inputs.length;) {
            virtualNode.connect(virtualGraph[key].audioNode, outputs[i], inputs[i])
          }
          continue
        }
        virtualNode.connect(virtualGraph[key].audioNode[destination])
        continue
      }

      const destinationVirtualAudioNode = virtualGraph[output]

      if (destinationVirtualAudioNode.isCustomVirtualNode) {
        for (const node of values(destinationVirtualAudioNode.virtualNodes)) {
          (node as any).input === 'input' && virtualNode.connect((node as any).audioNode)
        }
        continue
      }

      virtualNode.connect(destinationVirtualAudioNode.audioNode)
    }
  }
}
