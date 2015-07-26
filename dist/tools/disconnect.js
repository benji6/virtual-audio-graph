'use strict';

var _require = require('ramda');

var forEach = _require.forEach;
var values = _require.values;

// VirtualNode -> nil
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