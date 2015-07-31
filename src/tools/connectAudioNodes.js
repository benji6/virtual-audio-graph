const {equals, filter, forEach, keys, isNil, pluck, propEq, values} = require('ramda');
const asArray = require('./asArray');
const connect = require('./connect');

const isPlainOldObject = x => equals(Object.prototype.toString.call(x),
                                     '[object Object]');

module.exports = (virtualGraph, handleConnectionToOutput = () => {}) =>
  forEach(id => {
            const virtualNode = virtualGraph[id];
            if (isNil(virtualNode) || virtualNode.connected) {
              return;
            }
            forEach(output => {
                      if (output === 'output') {
                        return handleConnectionToOutput(virtualNode);
                      }

                      if (isPlainOldObject(output)) {
                        const {key, destination} = output;
                        if (isNil(key)) {
                          throw new Error(`id: ${id} - output object requires a key property`);
                        }
                        return connect(virtualNode,
                                       virtualGraph[key].audioNode[destination]);
                      }

                      const destinationVirtualAudioNode = virtualGraph[output];

                      if (destinationVirtualAudioNode.isCustomVirtualNode) {
                        return forEach(connect(virtualNode),
                                       pluck('audioNode',
                                             filter(propEq('input', 'input'),
                                                    values(destinationVirtualAudioNode.virtualNodes))));
                      }

                      connect(virtualNode, destinationVirtualAudioNode.audioNode);
                    },
                    asArray(virtualNode.output));
          },
          keys(virtualGraph));
