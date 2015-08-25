import createNativeVirtualAudioNode from '../virtualNodeFactories/createNativeVirtualAudioNode';
import createCustomVirtualAudioNode from '../virtualNodeFactories/createCustomVirtualAudioNode';

export default function (virtualAudioNodeParam) {
  if (this.customNodes[virtualAudioNodeParam.node]) {
    return createCustomVirtualAudioNode(this, virtualAudioNodeParam);
  }
  return createNativeVirtualAudioNode(this, virtualAudioNodeParam);
}
