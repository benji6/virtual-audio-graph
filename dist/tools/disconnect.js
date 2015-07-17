'use strict';

var _require = require('ramda');

var forEach = _require.forEach;

module.exports = function disconnect(virtualNode) {
  if (virtualNode.isCustomVirtualNode) {
    forEach(function (childVirtualNode) {
      return disconnect(childVirtualNode);
    }, virtualNode.virtualNodes);
  } else {
    virtualNode.audioNode.disconnect();
  }
  virtualNode.connected = false;
};