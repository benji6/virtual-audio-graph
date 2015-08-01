const {equals} = require('ramda');
const createVirtualAudioNode = require('./createVirtualAudioNode');
const disconnect = require('./disconnect');
const update = require('./update');

module.exports = function (virtualAudioNode, virtualAudioNodeParam, id) {
  if (virtualAudioNodeParam.node !== virtualAudioNode.node) {
    disconnect(virtualAudioNode);
    this.virtualNodes[id] = createVirtualAudioNode.call(this, virtualAudioNodeParam);
    return;
  }

  if (!equals(virtualAudioNodeParam.output, virtualAudioNode.output)) {
    disconnect(virtualAudioNode);
    virtualAudioNode.output = virtualAudioNodeParam.output;
  }

  update(virtualAudioNode, virtualAudioNodeParam.params);
};
