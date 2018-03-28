import { entries, values } from './utils'
import { AudioNodePropertyLookup, VirtualAudioNode, VirtualAudioNodeGraph } from './types'
import CustomVirtualAudioNode from './VirtualAudioNodes/CustomVirtualAudioNode'
import StandardVirtualAudioNode from './VirtualAudioNodes/StandardVirtualAudioNode'

export default (
  virtualGraph: VirtualAudioNodeGraph,
  handleConnectionToOutput: (_: VirtualAudioNode) => void,
) => {
  for (const [id, virtualNode] of entries(virtualGraph)) {
    if (virtualNode.connected || virtualNode.output == null) continue

    for (const output of [].concat(virtualNode.output)) {
      if (output === 'output') {
        handleConnectionToOutput(virtualNode)
        continue
      }

      if (Object.prototype.toString.call(output) === '[object Object]') {
        const { key, destination, inputs, outputs } = output

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
        virtualNode.connect((virtualGraph[key].audioNode as AudioNodePropertyLookup)[destination])
        continue
      }

      const destinationVirtualAudioNode = virtualGraph[output]

      if (destinationVirtualAudioNode instanceof CustomVirtualAudioNode) {
        for (const node of values(destinationVirtualAudioNode.virtualNodes)) {
          if (node instanceof StandardVirtualAudioNode && node.input === 'input') {
            virtualNode.connect(node.audioNode)
          }
        }
        continue
      }

      virtualNode.connect(destinationVirtualAudioNode.audioNode)
    }
  }
}
