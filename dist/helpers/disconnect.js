"use strict";

module.exports = function disconnect(virtualNode) {
  if (virtualNode.isCustomVirtualNode) {
    (function () {
      var virtualNodes = virtualNode.virtualNodes;

      Object.keys(virtualNodes).forEach(function (key) {
        var childVirtualNode = virtualNodes[key];
        disconnect(childVirtualNode);
      });
    })();
  } else {
    virtualNode.audioNode.disconnect();
  }
  virtualNode.connected = false;
};