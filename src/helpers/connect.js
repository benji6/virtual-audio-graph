import {asArray, mapObj} from '../tools';

export default (virtualNode, ...connectArgs) => {
  if (virtualNode.isCustomVirtualNode) {
    mapObj(childVirtualNode => {
      if (asArray(childVirtualNode.output).indexOf('output') !== -1) {
        const {audioNode} = childVirtualNode;
        audioNode.connect && audioNode.connect(...connectArgs.filter(Boolean));
      }
    }, virtualNode.virtualNodes);
  } else {
    const {audioNode} = virtualNode;
    audioNode.connect && audioNode.connect(...connectArgs.filter(Boolean));
  }
  virtualNode.connected = true;
};
