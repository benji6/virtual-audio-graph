const createNativeVirtualAudioNode = require('../virtualNodeFactories/createNativeVirtualAudioNode');
const createCustomVirtualAudioNode = require('../virtualNodeFactories/createCustomVirtualAudioNode');

module.exports = function (virtualAudioNodeParam) {
  if (this.customNodes[virtualAudioNodeParam.node]) {
    return createCustomVirtualAudioNode(this, virtualAudioNodeParam);
  }
  return createNativeVirtualAudioNode(this, virtualAudioNodeParam);
};
