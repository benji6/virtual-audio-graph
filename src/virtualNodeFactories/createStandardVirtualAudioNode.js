import createAudioNode from '../helpers/createAudioNode';
import update from '../helpers/update';
import constructorParamsKeys from '../data/constructorParamsKeys';

export default (virtualAudioGraph, {node, input, output, params}) => {
  params = params || {};
  const {startTime, stopTime} = params;
  const constructorParam = params[Object.keys(params)
    .filter(key => constructorParamsKeys.indexOf(key) !== -1)[0]];
  const virtualNode = {
    audioNode: createAudioNode(virtualAudioGraph.audioContext, node, constructorParam, {startTime, stopTime}),
    connected: false,
    isCustomVirtualNode: false,
    input,
    node,
    output,
    stopCalled: stopTime !== undefined,
  };
  return update(virtualNode, params);
};
