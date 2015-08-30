import asArray from '../tools/asArray';
import connect from './connect';

export default (virtualGraph, handleConnectionToOutput = () => {}) =>
  Object.keys(virtualGraph).forEach(id => {
    const virtualNode = virtualGraph[id];
    if (virtualNode.connected) {
      return;
    }
    asArray(virtualNode.output)
      .forEach(output => {
        if (output === 'output') {
          return handleConnectionToOutput(virtualNode);
        }

        if (Object.prototype.toString.call(output) === '[object Object]') {
          const {key, destination} = output;
          if (key == null) {
            throw new Error(`id: ${id} - output object requires a key property`);
          }
          return connect(virtualNode,
                         virtualGraph[key].audioNode[destination]);
        }

        const destinationVirtualAudioNode = virtualGraph[output];

        if (destinationVirtualAudioNode.isCustomVirtualNode) {
          const {virtualNodes} = destinationVirtualAudioNode;
          return Object.keys(destinationVirtualAudioNode.virtualNodes)
            .forEach(key => {
              const node = virtualNodes[key];
              if (node.input !== 'input') {
                return;
              }
              connect(virtualNode, node.audioNode);
            });
        }

        connect(virtualNode, destinationVirtualAudioNode.audioNode);
      });
  });
