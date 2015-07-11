'use strict';

var NativeVirtualAudioNode = require('../virtualNodeConstructors/NativeVirtualAudioNode');
var CustomVirtualAudioNode = require('../virtualNodeConstructors/CustomVirtualAudioNode');

module.exports = function (virtualAudioNodeParam) {
  if (this.customNodes[virtualAudioNodeParam.node]) return new CustomVirtualAudioNode(this, virtualAudioNodeParam);

  return new NativeVirtualAudioNode(this, virtualAudioNodeParam);
};