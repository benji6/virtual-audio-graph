import createStandardVirtualAudioNode from '../virtualNodeFactories/createStandardVirtualAudioNode';
import createCustomVirtualAudioNode from '../virtualNodeFactories/createCustomVirtualAudioNode';

export default function (virtualAudioNodeParam) {
  if (this.customNodes[virtualAudioNodeParam.node]) {
    return createCustomVirtualAudioNode(this, virtualAudioNodeParam);
  }
  return createStandardVirtualAudioNode(this, virtualAudioNodeParam);
}
