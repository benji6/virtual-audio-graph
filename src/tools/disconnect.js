module.exports = function disconnect (virtualNode) {
  if (virtualNode.isCustomVirtualNode) {
    const {virtualNodes} = virtualNode;
    Object.keys(virtualNodes)
      .map(key => virtualNodes[key])
      .forEach(childVirtualNode => disconnect(childVirtualNode));
  } else {
    virtualNode.audioNode.disconnect();
  }
  virtualNode.connected = false;
};
