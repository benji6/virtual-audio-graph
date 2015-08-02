'use strict';

var _require = require('ramda');

var equals = _require.equals;
var filter = _require.filter;
var forEach = _require.forEach;
var keys = _require.keys;
var isNil = _require.isNil;
var pluck = _require.pluck;
var propEq = _require.propEq;
var values = _require.values;

var asArray = require('./asArray');
var connect = require('./connect');

var isPlainOldObject = function isPlainOldObject(x) {
  return equals(Object.prototype.toString.call(x), '[object Object]');
};

module.exports = function (virtualGraph) {
  var handleConnectionToOutput = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
  return forEach(function (id) {
    var virtualNode = virtualGraph[id];
    if (virtualNode.connected) {
      return;
    }
    forEach(function (output) {
      if (output === 'output') {
        return handleConnectionToOutput(virtualNode);
      }

      if (isPlainOldObject(output)) {
        var key = output.key;
        var destination = output.destination;

        if (isNil(key)) {
          throw new Error('id: ' + id + ' - output object requires a key property');
        }
        return connect(virtualNode, virtualGraph[key].audioNode[destination]);
      }

      var destinationVirtualAudioNode = virtualGraph[output];

      if (destinationVirtualAudioNode.isCustomVirtualNode) {
        return forEach(connect(virtualNode), pluck('audioNode', filter(propEq('input', 'input'), values(destinationVirtualAudioNode.virtualNodes))));
      }

      connect(virtualNode, destinationVirtualAudioNode.audioNode);
    }, asArray(virtualNode.output));
  }, keys(virtualGraph));
};