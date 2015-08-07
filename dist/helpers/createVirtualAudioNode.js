'use strict';

var createNativeVirtualAudioNode = require('../virtualNodeFactories/createNativeVirtualAudioNode');
var createCustomVirtualAudioNode = require('../virtualNodeFactories/createCustomVirtualAudioNode');

module.exports = function (virtualAudioNodeParam) {
  if (this.customNodes[virtualAudioNodeParam.node]) {
    return createCustomVirtualAudioNode(this, virtualAudioNodeParam);
  }
  return createNativeVirtualAudioNode(this, virtualAudioNodeParam);
};