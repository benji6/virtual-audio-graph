import createStandardVirtualAudioNode from '../virtualNodeFactories/createStandardVirtualAudioNode';
import createCustomVirtualAudioNode from '../virtualNodeFactories/createCustomVirtualAudioNode';

export default (audioContext, customNodes, virtualAudioNodeParam) => customNodes[virtualAudioNodeParam[0]] ?
  createCustomVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParam) :
  createStandardVirtualAudioNode(audioContext, virtualAudioNodeParam);
