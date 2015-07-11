const NativeVirtualAudioNode = require('../virtualNodeConstructors/NativeVirtualAudioNode');
const CustomVirtualAudioNode = require('../virtualNodeConstructors/CustomVirtualAudioNode');

module.exports = function (virtualAudioNodeParam) {
  if (this.customNodes[virtualAudioNodeParam.node])
    return new CustomVirtualAudioNode(this, virtualAudioNodeParam);

  return new NativeVirtualAudioNode(this, virtualAudioNodeParam);
};
