'use strict';

var _require = require('ramda');

var append = _require.append;
var equals = _require.equals;

var createVirtualAudioNode = require('./createVirtualAudioNode');
var disconnectAndRemoveVirtualAudioNode = require('./disconnectAndRemoveVirtualAudioNode');
var disconnect = require('./disconnect');
var update = require('./update');

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

  update(virtualAudioNode, virtualAudioNodeParam.params);
};