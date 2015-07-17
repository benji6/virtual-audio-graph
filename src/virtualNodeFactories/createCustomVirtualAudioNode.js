const {map} = require('ramda');
const connectAudioNodes = require('../tools/connectAudioNodes');
const createNativeVirtualAudioNode = require('../virtualNodeFactories/createNativeVirtualAudioNode');

module.exports = function createCustomVirtualNode (virtualAudioGraph, {node, id, output, params}) {
    params = params || {};
    const audioGraphParamsFactory = virtualAudioGraph.customNodes[node];
    const virtualNode = {
      audioGraphParamsFactory,
      connected: false,
      id,
      isCustomVirtualNode: true,
      node,
      output,
      params,
      virtualNodes: map(function createVirtualAudioNode (virtualAudioNodeParam) {
        if (virtualAudioGraph.customNodes[virtualAudioNodeParam.node]) {
          return createCustomVirtualNode(virtualAudioGraph, virtualAudioNodeParam);
        }

        return createNativeVirtualAudioNode(virtualAudioGraph, virtualAudioNodeParam);
      }, audioGraphParamsFactory(params)),
    };

    connectAudioNodes(virtualNode.virtualNodes);

    return virtualNode;
};
