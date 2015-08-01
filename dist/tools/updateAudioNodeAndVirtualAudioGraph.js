'use strict';

var _require = require('ramda');

var equals = _require.equals;

var createVirtualAudioNode = require('./createVirtualAudioNode');
var disconnect = require('./disconnect');
var update = require('./update');

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