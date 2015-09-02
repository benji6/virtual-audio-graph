import asArray from '../tools/asArray';
import mapObj from '../tools/mapObj';

export default (virtualNode, destination, output, input) => {
  if (virtualNode.isCustomVirtualNode) {
    mapObj(childVirtualNode => {
      if (asArray(childVirtualNode.output).indexOf('output') !== -1) {
        const {audioNode} = childVirtualNode;
        audioNode.connect && audioNode.connect(destination, output, input);
      }
    }, virtualNode.virtualNodes);
  } else {
    const {audioNode} = virtualNode;
    audioNode.connect && audioNode.connect(destination, output, input);
  }
  virtualNode.connected = true;
};
