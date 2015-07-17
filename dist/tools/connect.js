'use strict';

var _require = require('ramda');

var contains = _require.contains;
var curry = _require.curry;
var filter = _require.filter;
var forEach = _require.forEach;
var pluck = _require.pluck;

var asArray = require('./asArray');

module.exports = curry(function (virtualNode, destination) {
  if (virtualNode.isCustomVirtualNode) {
    var outputVirtualNodes = filter(function (_ref) {
      var output = _ref.output;
      return contains('output', asArray(output));
    }, virtualNode.virtualNodes);
    forEach(function (audioNode) {
      return audioNode.connect(destination);
    }, pluck('audioNode', outputVirtualNodes));
  } else {
    virtualNode.audioNode.connect(destination);
  }
  virtualNode.connected = true;
});