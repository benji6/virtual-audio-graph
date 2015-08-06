"use strict";

module.exports = function disconnect(virtualNode) {
  if (virtualNode.isCustomVirtualNode) {
    (function () {
      var virtualNodes = virtualNode.virtualNodes;

      Object.keys(virtualNodes).map(function (key) {
        return virtualNodes[key];
      }).forEach(function (childVirtualNode) {
        return disconnect(childVirtualNode);
      });
    })();
  } else {
    virtualNode.audioNode.disconnect();
  }
  virtualNode.connected = false;
};