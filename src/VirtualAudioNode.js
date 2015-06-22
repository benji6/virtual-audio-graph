const createAudioNode = require('./createAudioNode');
const {forEach, keys, pick, omit} = require('ramda');

const constructorParamsKeys = [
  'maxDelayTime',
];

module.exports = class VirtualAudioNode {
  constructor (audioContext, virtualNodeParams) {
    let {node, id, output, params} = virtualNodeParams;
    params = params || {};
    const constructorParams = pick(constructorParamsKeys, params);
    params = omit(constructorParamsKeys, params);
    this.audioNode = createAudioNode(audioContext, node, constructorParams);
    this.updateAudioNode(params);
    this.id = id;
    this.output = Array.isArray(output) ? output : [output];
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
