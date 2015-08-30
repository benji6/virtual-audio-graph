export default function disconnect (virtualNode, doNotStop) {
  if (virtualNode.isCustomVirtualNode) {
    const {virtualNodes} = virtualNode;
    Object.keys(virtualNodes)
      .forEach(key => {
        const childVirtualNode = virtualNodes[key];
        disconnect(childVirtualNode);
      });
  } else {
    const {audioNode} = virtualNode;
    if (audioNode.stop && !virtualNode.stopCalled && !doNotStop) {
      audioNode.stop();
    }
    audioNode.disconnect();
  }
  virtualNode.connected = false;
}
