const createAudioNode = require('../tools/createAudioNode');
const {contains, forEach, keys, pick, omit} = require('ramda');
const capitalize = require('capitalize');

const constructorParamsKeys = [
  'maxDelayTime',
];

const audioParamProperties = [
 'delayTime',
 'detune',
 'frequency',
 'gain',
 'pan',
 'Q',
];

const setters = [
  'position',
  'orientation',
];

module.exports = class NativeVirtualAudioNode {
  constructor (virtualAudioGraph, virtualNodeParams) {
    let {node, id, input, output, params} = virtualNodeParams;
    params = params || {};
    const constructorParams = pick(constructorParamsKeys, params);
    this.audioNode = createAudioNode(virtualAudioGraph.audioContext, node, constructorParams);
    this.connected = false;
    this.node = node;
    this.updateAudioNode(params);
    this.id = id;
    this.input = input;
    this.output = output;
    this.params = params;
  }

  connect (destination) {
    this.audioNode.connect(destination);
    this.connected = true;
  }

  disconnect () {
    this.audioNode.disconnect();
    this.connected = false;
  }

  updateAudioNode (params) {
    params = omit(constructorParamsKeys, params);
    forEach((key) => {
      const param = params[key];
      if (this.params && this.params[key] === param) return;
      if (contains(key, audioParamProperties)) {
        this.audioNode[key].value = param;
        return;
      }
      if (contains(key, setters)) {
        this.audioNode[`set${capitalize(key)}`].apply(this.audioNode, param);
        return;
      }
      this.audioNode[key] = param;
    }, keys(omit(constructorParamsKeys, params)));
  }
};
