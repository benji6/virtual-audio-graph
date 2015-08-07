'use strict';

var asArray = require('../tools/asArray');
var connect = require('./connect');

module.exports = function (virtualGraph) {
  var handleConnectionToOutput = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
  return Object.keys(virtualGraph).forEach(function (id) {
    var virtualNode = virtualGraph[id];
    if (virtualNode.connected) {
      return;
    }
    asArray(virtualNode.output).forEach(function (output) {
      if (output === 'output') {
        return handleConnectionToOutput(virtualNode);
      }

      if (Object.prototype.toString.call(output) === '[object Object]') {
        var key = output.key;
        var destination = output.destination;

        if (key == null) {
          throw new Error('id: ' + id + ' - output object requires a key property');
        }
        return connect(virtualNode, virtualGraph[key].audioNode[destination]);
      }

      var destinationVirtualAudioNode = virtualGraph[output];

      if (destinationVirtualAudioNode.isCustomVirtualNode) {
        var _ret = (function () {
          var virtualNodes = destinationVirtualAudioNode.virtualNodes;

          return {
            v: Object.keys(destinationVirtualAudioNode.virtualNodes).forEach(function (key) {
              var node = virtualNodes[key];
              if (node.input !== 'input') {
                return;
              }
              connect(virtualNode, node.audioNode);
            })
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }

      connect(virtualNode, destinationVirtualAudioNode.audioNode);
    });
  });
};