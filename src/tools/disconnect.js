const {forEach, values} = require('ramda');

// VirtualNode -> nil
module.exports = function disconnect (virtualNode) {
  if (virtualNode.isCustomVirtualNode) {
    forEach(childVirtualNode => disconnect(childVirtualNode), values(virtualNode.virtualNodes));
  } else {
    virtualNode.audioNode.disconnect();
  }
  virtualNode.connected = false;
};
