import asArray from '../tools/asArray';
import connect from './connect';

export default (virtualGraph, handleConnectionToOutput = () => {}) =>
  Object.keys(virtualGraph).forEach(id => {
    const virtualNode = virtualGraph[id];
    const {output} = virtualNode;
    if (virtualNode.connected || output == null) {
      return;
    }
    asArray(output)
      .forEach(output => {
        if (output === 'output') {
          return handleConnectionToOutput(virtualNode);
        }

        if (Object.prototype.toString.call(output) === '[object Object]') {
          const {key, destination, inputs, outputs} = output;

          if (key == null) {
            throw new Error(`id: ${id} - output object requires a key property`);
          }
          if (inputs) {
            if (inputs.length !== outputs.length) {
              throw new Error(`id: ${id} - outputs and inputs arrays are not the same length`);
            }
            return inputs.forEach((input, i) =>
              connect(virtualNode, virtualGraph[key].audioNode, outputs[i], input));
          }
          return connect(virtualNode, virtualGraph[key].audioNode[destination]);
        }

        const destinationVirtualAudioNode = virtualGraph[output];

        if (destinationVirtualAudioNode.isCustomVirtualNode) {
          return Object.values(destinationVirtualAudioNode.virtualNodes)
            .forEach(node => {
              if (node.input !== 'input') {
                return;
              }
              connect(virtualNode, node.audioNode);
            });
        }

        connect(virtualNode, destinationVirtualAudioNode.audioNode);
      });
  });
