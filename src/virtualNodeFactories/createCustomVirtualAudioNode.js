import connectAudioNodes from '../helpers/connectAudioNodes';
import createStandardVirtualAudioNode from '../virtualNodeFactories/createStandardVirtualAudioNode';
import mapObj from '../tools/mapObj';

export default function createCustomVirtualNode (virtualAudioGraph, [node, output, params]) {
  params = params || {};
  const audioGraphParamsFactory = virtualAudioGraph.customNodes[node];
  const virtualNodes = mapObj(virtualAudioNodeParam => {
    if (virtualAudioGraph.customNodes[virtualAudioNodeParam[0]]) {
      return createCustomVirtualNode(virtualAudioGraph, virtualAudioNodeParam);
    }
    return createStandardVirtualAudioNode(virtualAudioGraph, virtualAudioNodeParam);
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
}
