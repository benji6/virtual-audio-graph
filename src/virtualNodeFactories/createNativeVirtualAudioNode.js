import createAudioNode from '../helpers/createAudioNode';
import update from '../helpers/update';

const pick = (names, obj) => {
  const result = {};
  let idx = 0;
  while (idx < names.length) {
    if (names[idx] in obj) {
      result[names[idx]] = obj[names[idx]];
    }
    idx += 1;
  }
  return result;
}

const constructorParamsKeys = [
  'maxDelayTime',
];

export default (virtualAudioGraph, {node, input, output, params}) => {
  params = params || {};
  const {startTime, stopTime} = params;
  const constructorParams = pick(constructorParamsKeys, params);
  const virtualNode = {
    audioNode: createAudioNode(virtualAudioGraph.audioContext, node, constructorParams, {startTime, stopTime}),
    connected: false,
    isCustomVirtualNode: false,
    input,
    node,
    output,
  };
  return update(virtualNode, params);
};
