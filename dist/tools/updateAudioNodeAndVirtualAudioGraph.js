'use strict';

var createVirtualAudioNode = require('./createVirtualAudioNode');
var disconnect = require('./disconnect');
var update = require('./update');

function checkOutputsEqual(output0, output1) {
  if (Array.isArray(output0)) {
    if (!Array.isArray(output1)) {
      return false;
    }
    return output0.every(function (x) {
      return output1.indexOf(x) !== -1;
    });
  }
  return output0 === output1;
}

module.exports = function (virtualAudioNode, virtualAudioNodeParam, id) {
  if (virtualAudioNodeParam.node !== virtualAudioNode.node) {
    disconnect(virtualAudioNode);
    this.virtualNodes[id] = createVirtualAudioNode.call(this, virtualAudioNodeParam);
    return;
  }

  if (!checkOutputsEqual(virtualAudioNodeParam.output, virtualAudioNode.output)) {
    disconnect(virtualAudioNode);
    virtualAudioNode.output = virtualAudioNodeParam.output;
  }

  update(virtualAudioNode, virtualAudioNodeParam.params);
};