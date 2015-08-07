module.exports = function disconnect (virtualNode) {
  if (virtualNode.isCustomVirtualNode) {
    const {virtualNodes} = virtualNode;
    Object.keys(virtualNodes)
      .forEach(key => {
        const childVirtualNode = virtualNodes[key];
        disconnect(childVirtualNode);
      });
  } else {
    virtualNode.audioNode.disconnect();
  }
  virtualNode.connected = false;
};
