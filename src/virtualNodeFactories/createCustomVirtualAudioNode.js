import connectAudioNodes from '../helpers/connectAudioNodes';
import createNativeVirtualAudioNode from '../virtualNodeFactories/createNativeVirtualAudioNode';
import mapObj from '../tools/mapObj';

export default function createCustomVirtualNode (virtualAudioGraph, {node, output, params}) {
  params = params || {};
  const audioGraphParamsFactory = virtualAudioGraph.customNodes[node];
  const virtualNodes = mapObj(virtualAudioNodeParam => {
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
}
