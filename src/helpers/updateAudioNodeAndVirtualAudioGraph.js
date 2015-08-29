import createVirtualAudioNode from './createVirtualAudioNode';
import disconnect from  './disconnect';
import update from './update';

function checkOutputsEqual (output0, output1) {
  if (Array.isArray(output0)) {
    if (!Array.isArray(output1)) {
      return false;
    }
    return output0.every(x => output1.indexOf(x) !== -1);
  }
  return output0 === output1;
}

export default function (virtualAudioNode, virtualAudioNodeParam, id) {
  if (virtualAudioNodeParam.node !== virtualAudioNode.node) {
    disconnect(virtualAudioNode);
    this.virtualNodes[id] = createVirtualAudioNode.call(this, virtualAudioNodeParam);
    return;
  }

  if (!checkOutputsEqual(virtualAudioNodeParam.output, virtualAudioNode.output)) {
    disconnect(virtualAudioNode, true);
    virtualAudioNode.output = virtualAudioNodeParam.output;
  }

  update(virtualAudioNode, virtualAudioNodeParam.params);
}
