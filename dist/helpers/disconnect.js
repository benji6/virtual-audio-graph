"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = disconnect;

function disconnect(virtualNode, doNotStop) {
  if (virtualNode.isCustomVirtualNode) {
    (function () {
      var virtualNodes = virtualNode.virtualNodes;

      Object.keys(virtualNodes).forEach(function (key) {
        var childVirtualNode = virtualNodes[key];
        disconnect(childVirtualNode);
      });
    })();
  } else {
    var audioNode = virtualNode.audioNode;

    if (audioNode.stop && !virtualNode.stopCalled && !doNotStop) {
      audioNode.stop();
    }
    audioNode.disconnect();
  }
  virtualNode.connected = false;
}

module.exports = exports["default"];