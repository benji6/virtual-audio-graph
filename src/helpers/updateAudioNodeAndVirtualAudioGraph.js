import createVirtualAudioNode from './createVirtualAudioNode';
import disconnect from  './disconnect';
import update from './update';

const checkOutputsEqual = (output0, output1) => {
  if (Array.isArray(output0)) {
    if (!Array.isArray(output1)) {
      return false;
    }
    return output0.every(x => output1.indexOf(x) !== -1);
  }
  return output0 === output1;
};

export default function (virtualAudioNode, virtualAudioNodeParam, id) {
  if (virtualAudioNodeParam[0] !== virtualAudioNode.node) {
    disconnect(virtualAudioNode);
    this.virtualNodes[id] = createVirtualAudioNode.call(this, virtualAudioNodeParam);
    return;
  }

  if (!checkOutputsEqual(virtualAudioNodeParam[1], virtualAudioNode.output)) {
    disconnect(virtualAudioNode, true);
    virtualAudioNode.output = virtualAudioNodeParam[1];
  }

  update(virtualAudioNode, virtualAudioNodeParam[2]);
}
