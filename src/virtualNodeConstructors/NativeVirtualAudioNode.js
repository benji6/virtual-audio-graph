const createAudioNode = require('../tools/createAudioNode');
const {forEach, keys, pick, omit} = require('ramda');

const constructorParamsKeys = [
  'maxDelayTime',
];

module.exports = class NativeVirtualAudioNode {
  constructor (virtualAudioGraph, virtualNodeParams) {
    let {node, id, input, output, params} = virtualNodeParams;
    params = params || {};
    const constructorParams = pick(constructorParamsKeys, params);
    params = omit(constructorParamsKeys, params);
    this.audioNode = createAudioNode(virtualAudioGraph.audioContext, node, constructorParams);
    this.updateAudioNode(params);
    this.id = id;
    this.input = input;
    this.output = Array.isArray(output) ? output : [output];
    this.params = params;
  }

  connect (destination) {
    this.audioNode.connect(destination);
  }

  disconnect () {
    this.audioNode.stop && this.audioNode.stop();
    this.audioNode.disconnect();
  }

  updateAudioNode (params) {
    params = omit(constructorParamsKeys, params);
    forEach((key) => {
      switch (key) {
        case 'type':
          this.audioNode[key] = params[key];
          return;
        default:
          this.audioNode[key].value = params[key];
          return;
      }
    }, keys(params));
  }
};
