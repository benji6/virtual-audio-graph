import createAudioNode from '../helpers/createAudioNode';
import constructorParamsKeys from '../data/constructorParamsKeys';
import update from '../helpers/update';

export default (audioContext, [node, output, params, input]) => {
  params = params || {};
  const {startTime, stopTime} = params;
  const constructorParam = params[Object.keys(params)
    .filter(key => constructorParamsKeys.indexOf(key) !== -1)[0]];
  const virtualNode = {
    audioNode: createAudioNode(audioContext, node, constructorParam, {startTime, stopTime}),
    connected: false,
    isCustomVirtualNode: false,
    input,
    node,
    output,
    stopCalled: stopTime !== undefined,
  };
  return update(virtualNode, params);
};
