const {forEach} = require('ramda');

// VirtualNode -> nil
module.exports = function disconnect (virtualNode) {
  if (virtualNode.isCustomVirtualNode) {
    forEach((childVirtualNode) => disconnect(childVirtualNode), virtualNode.virtualNodes);
  } else {
    virtualNode.audioNode.disconnect();
  }
  virtualNode.connected = false;
};
