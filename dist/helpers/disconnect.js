"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = disconnect;

function disconnect(virtualNode, doNotStop) {
  if (virtualNode.isCustomVirtualNode) {
    Object.values(virtualNode.virtualNodes).forEach(disconnect);
  } else {
    var audioNode = virtualNode.audioNode;

    if (audioNode.stop && !virtualNode.stopCalled && !doNotStop) {
      audioNode.stop();
    }
    audioNode.disconnect && audioNode.disconnect();
  }
  virtualNode.connected = false;
}

module.exports = exports["default"];