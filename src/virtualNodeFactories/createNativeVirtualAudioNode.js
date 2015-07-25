const {pick} = require('ramda');
const createAudioNode = require('../tools/createAudioNode');
const update = require('../tools/update');

const constructorParamsKeys = [
  'maxDelayTime',
];

module.exports = (virtualAudioGraph, {node, input, output, params}) => {
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
