'use strict';

var _require = require('ramda');

var contains = _require.contains;
var curry = _require.curry;
var mapObj = _require.mapObj;

var asArray = require('./asArray');

module.exports = curry(function (virtualNode, destination) {
  if (virtualNode.isCustomVirtualNode) {
    mapObj(function (childVirtualNode) {
      var output = childVirtualNode.output;

      if (contains('output', asArray(output))) {
        childVirtualNode.audioNode.connect(destination);
      }
    }, virtualNode.virtualNodes);
  } else {
    virtualNode.audioNode.connect(destination);
  }
  virtualNode.connected = true;
});