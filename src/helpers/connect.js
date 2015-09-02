import asArray from '../tools/asArray';
import mapObj from '../tools/mapObj';

export default (virtualNode, ...connectArgs) => {
  if (virtualNode.isCustomVirtualNode) {
    mapObj(childVirtualNode => {
      if (asArray(childVirtualNode.output).indexOf('output') !== -1) {
        const {audioNode} = childVirtualNode;
        audioNode.connect && audioNode.connect(...connectArgs.filter(x => x));
      }
    }, virtualNode.virtualNodes);
  } else {
    const {audioNode} = virtualNode;
    audioNode.connect && audioNode.connect(...connectArgs.filter(x => x));
  }
  virtualNode.connected = true;
};
