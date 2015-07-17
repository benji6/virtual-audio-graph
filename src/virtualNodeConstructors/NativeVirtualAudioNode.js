const {pick} = require('ramda');
const createAudioNode = require('../tools/createAudioNode');
const update = require('../tools/update');

const constructorParamsKeys = [
  'maxDelayTime',
];

module.exports = class NativeVirtualAudioNode {
  constructor (virtualAudioGraph, {node, id, input, output, params}) {
    params = params || {};
    const {startTime, stopTime} = params;
    const constructorParams = pick(constructorParamsKeys, params);
    this.audioNode = createAudioNode(virtualAudioGraph.audioContext, node, constructorParams, {startTime, stopTime});
    this.connected = false;
    this.isCustomVirtualNode = false;
    this.id = id;
    this.input = input;
    this.node = node;
    this.output = output;
    update(this, params);
    this.params = params;
  }
};
