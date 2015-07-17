const {pick} = require('ramda');
const createAudioNode = require('../tools/createAudioNode');
const update = require('../tools/update');

const constructorParamsKeys = [
  'maxDelayTime',
];

module.exports = class NativeVirtualAudioNode {
  constructor (virtualAudioGraph, virtualNodeParams) {
    let {node, id, input, output, params} = virtualNodeParams;
    params = params || {};
    const {startTime, stopTime} = params;
    const constructorParams = pick(constructorParamsKeys, params);
    this.audioNode = createAudioNode(virtualAudioGraph.audioContext, node, constructorParams, {startTime, stopTime});
    this.connected = false;
    this.node = node;
    update(this, params);
    this.id = id;
    this.input = input;
    this.output = output;
    this.params = params;
    this.isCustomVirtualNode = false;
  }
};
