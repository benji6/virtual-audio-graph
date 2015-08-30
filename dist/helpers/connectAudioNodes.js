'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _toolsAsArray = require('../tools/asArray');

var _toolsAsArray2 = _interopRequireDefault(_toolsAsArray);

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

exports['default'] = function (virtualGraph) {
  var handleConnectionToOutput = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
  return Object.keys(virtualGraph).forEach(function (id) {
    var virtualNode = virtualGraph[id];
    if (virtualNode.connected) {
      return;
    }
    (0, _toolsAsArray2['default'])(virtualNode.output).forEach(function (output) {
      if (output === 'output') {
        return handleConnectionToOutput(virtualNode);
      }

      if (Object.prototype.toString.call(output) === '[object Object]') {
        var key = output.key;
        var destination = output.destination;

        if (key == null) {
          throw new Error('id: ' + id + ' - output object requires a key property');
        }
        return (0, _connect2['default'])(virtualNode, virtualGraph[key].audioNode[destination]);
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
              (0, _connect2['default'])(virtualNode, node.audioNode);
            })
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }

      (0, _connect2['default'])(virtualNode, destinationVirtualAudioNode.audioNode);
    });
  });
};

module.exports = exports['default'];