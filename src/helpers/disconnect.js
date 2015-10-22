export default function disconnect (virtualNode, doNotStop) {
  if (virtualNode.isCustomVirtualNode) {
    Object.values(virtualNode.virtualNodes).forEach(disconnect);
  } else {
    const {audioNode} = virtualNode;
    if (audioNode.stop && !virtualNode.stopCalled && !doNotStop) {
      audioNode.stop();
    }
    audioNode.disconnect && audioNode.disconnect();
  }
  virtualNode.connected = false;
}
