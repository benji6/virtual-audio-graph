const {differenceWith, eqProps, forEach} = require('ramda');
const disconnectAndRemoveVirtualAudioNode = require('./disconnectAndRemoveVirtualAudioNode');

module.exports = function (virtualAudioNodeParams) {
  const virtualNodesToBeRemoved = differenceWith(eqProps('id'), this.virtualNodes, virtualAudioNodeParams);

  forEach(disconnectAndRemoveVirtualAudioNode.bind(this), virtualNodesToBeRemoved);

  return virtualAudioNodeParams;
};
