const {mapObj} = require('ramda');
const connectAudioNodes = require('../tools/connectAudioNodes');
const createNativeVirtualAudioNode = require('../virtualNodeFactories/createNativeVirtualAudioNode');

module.exports = function createCustomVirtualNode (virtualAudioGraph, {node, output, params}) {
  params = params || {};
  const audioGraphParamsFactory = virtualAudioGraph.customNodes[node];
  const virtualNodes = mapObj(function createVirtualAudioNode (virtualAudioNodeParam) {
    if (virtualAudioGraph.customNodes[virtualAudioNodeParam.node]) {
      return createCustomVirtualNode(virtualAudioGraph, virtualAudioNodeParam);
    }

    return createNativeVirtualAudioNode(virtualAudioGraph, virtualAudioNodeParam);
  }, audioGraphParamsFactory(params));

  connectAudioNodes(virtualNodes);

  return {
    audioGraphParamsFactory,
    connected: false,
    isCustomVirtualNode: true,
    node,
    output,
    params,
    virtualNodes,
  };
};
