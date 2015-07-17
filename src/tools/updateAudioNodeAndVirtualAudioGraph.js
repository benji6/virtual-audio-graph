const {append, equals} = require('ramda');
const createVirtualAudioNode = require('./createVirtualAudioNode');
const disconnectAndRemoveVirtualAudioNode = require('./disconnectAndRemoveVirtualAudioNode');
const disconnect = require('./disconnect');

module.exports = function (virtualAudioNode, virtualAudioNodeParam) {
  if (virtualAudioNodeParam.node !== virtualAudioNode.node) {
    disconnectAndRemoveVirtualAudioNode.call(this, virtualAudioNode);
    this.virtualNodes = append(createVirtualAudioNode.call(this, virtualAudioNodeParam), this.virtualNodes);
    return;
  }

  if (!equals(virtualAudioNodeParam.output, virtualAudioNode.output)) {
    disconnect(virtualAudioNode);
    virtualAudioNode.output = virtualAudioNodeParam.output;
  }

  virtualAudioNode.updateAudioNode(virtualAudioNodeParam.params);
};
