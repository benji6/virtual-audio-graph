'use strict';

var asArray = require('./asArray');
var mapObj = require('./mapObj');

module.exports = function (virtualNode, destination) {
  if (virtualNode.isCustomVirtualNode) {
    mapObj(function (childVirtualNode) {
      if (asArray(childVirtualNode.output).indexOf('output') !== -1) {
        childVirtualNode.audioNode.connect(destination);
      }
    }, virtualNode.virtualNodes);
  } else {
    virtualNode.audioNode.connect(destination);
  }
  virtualNode.connected = true;
};