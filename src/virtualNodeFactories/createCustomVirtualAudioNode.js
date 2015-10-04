import connectAudioNodes from '../helpers/connectAudioNodes';
import createStandardVirtualAudioNode from '../virtualNodeFactories/createStandardVirtualAudioNode';
import mapObj from '../tools/mapObj';

const createCustomVirtualAudioNode = (audioContext, customNodes, [node, output, params]) => {
  params = params || {};
  const audioGraphParamsFactory = customNodes[node];
  const virtualNodes = mapObj(virtualAudioNodeParam => customNodes[virtualAudioNodeParam[0]] ?
    createCustomVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParam) :
    createStandardVirtualAudioNode(audioContext, virtualAudioNodeParam),
                              audioGraphParamsFactory(params));

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

export default createCustomVirtualAudioNode;
