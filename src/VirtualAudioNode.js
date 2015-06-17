const createAudioNode = require('./createAudioNode');
const {forEach, keys} = require('ramda');

module.exports = class VirtualAudioNode {
  constructor (audioContext, virtualNodeParams) {
    let {name, id, connections, params} = virtualNodeParams;
    params = params || {};
    this.audioNode = createAudioNode(audioContext, name);
    this.updateAudioNode(params);

    Object.assign(this, {
      audioNode: this.audioNode,
      id,
      connections: Array.isArray(connections) ? connections : [connections],
    });
  }

  updateAudioNode (params) {
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
