const createAudioNode = require('./createAudioNode');
const {forEach, keys, pick, omit} = require('ramda');

const constructorParamsKeys = [
  'maxDelayTime',
];

module.exports = class VirtualAudioNode {
  constructor (audioContext, virtualNodeParams) {
    let {name, id, connections, params} = virtualNodeParams;
    params = params || {};
    const constructorParams = pick(constructorParamsKeys, params);
    params = omit(constructorParamsKeys, params);
    this.audioNode = createAudioNode(audioContext, name, constructorParams);
    this.updateAudioNode(params);

    Object.assign(this, {
      audioNode: this.audioNode,
      id,
      connections: Array.isArray(connections) ? connections : [connections],
    });
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
