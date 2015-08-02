'use strict';

var _require = require('ramda');

// VirtualNode -> nil
var forEach = _require.forEach;
var values = _require.values;
module.exports = function disconnect(virtualNode) {
  if (virtualNode.isCustomVirtualNode) {
    forEach(function (childVirtualNode) {
      return disconnect(childVirtualNode);
    }, values(virtualNode.virtualNodes));
  } else {
    virtualNode.audioNode.disconnect();
  }
  virtualNode.connected = false;
};