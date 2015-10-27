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
    var output = virtualNode.output;

    if (virtualNode.connected || output == null) {
      return;
    }
    (0, _toolsAsArray2['default'])(output).forEach(function (output) {
      if (output === 'output') {
        return handleConnectionToOutput(virtualNode);
      }

      if (Object.prototype.toString.call(output) === '[object Object]') {
        var _ret = (function () {
          var key = output.key;
          var destination = output.destination;
          var inputs = output.inputs;
          var outputs = output.outputs;

          if (key == null) {
            throw new Error('id: ' + id + ' - output object requires a key property');
          }
          if (inputs) {
            if (inputs.length !== outputs.length) {
              throw new Error('id: ' + id + ' - outputs and inputs arrays are not the same length');
            }
            return {
              v: inputs.forEach(function (input, i) {
                return (0, _connect2['default'])(virtualNode, virtualGraph[key].audioNode, outputs[i], input);
              })
            };
          }
          return {
            v: (0, _connect2['default'])(virtualNode, virtualGraph[key].audioNode[destination])
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }

      var destinationVirtualAudioNode = virtualGraph[output];

      if (destinationVirtualAudioNode.isCustomVirtualNode) {
        return Object.values(destinationVirtualAudioNode.virtualNodes).forEach(function (node) {
          if (node.input !== 'input') {
            return;
          }
          (0, _connect2['default'])(virtualNode, node.audioNode);
        });
      }

      (0, _connect2['default'])(virtualNode, destinationVirtualAudioNode.audioNode);
    });
  });
};

module.exports = exports['default'];