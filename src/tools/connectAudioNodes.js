const asArray = require('./asArray');
const connect = require('./connect');

const isPlainOldObject = x => Object.prototype.toString.call(x) === '[object Object]';

module.exports = (virtualGraph, handleConnectionToOutput = () => {}) =>
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

        if (isPlainOldObject(output)) {
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
          return Object.keys(destinationVirtualAudioNode.virtualNodes).map(key => virtualNodes[key])
            .forEach(node => {
              if (node.input !== 'input') {
                return;
              }
              connect(virtualNode, node.audioNode)
            });
        }

        connect(virtualNode, destinationVirtualAudioNode.audioNode);
      });
  });
