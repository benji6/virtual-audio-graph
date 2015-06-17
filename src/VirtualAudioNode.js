const createAudioNode = require('./createAudioNode');
const {forEach, keys} = require('ramda');

module.exports = class VirtualAudioNode {
  constructor (audioContext, virtualNodeParams) {
    let {name, id, connections, params} = virtualNodeParams;
    params = params || {};
    const audioNode = createAudioNode(audioContext, name);
    forEach((key) => {
      switch (key) {
        case 'type':
          audioNode[key] = params[key];
          return;
        default:
          audioNode[key].value = params[key];
          return;
      }
    }, keys(params));

    Object.assign(this, {
      audioNode,
      id,
      connections: Array.isArray(connections) ? connections : [connections],
    });
  }
};
