'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _toolsAsArray = require('../tools/asArray');

var _toolsAsArray2 = _interopRequireDefault(_toolsAsArray);

var _toolsMapObj = require('../tools/mapObj');

var _toolsMapObj2 = _interopRequireDefault(_toolsMapObj);

exports['default'] = function (virtualNode) {
  for (var _len = arguments.length, connectArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    connectArgs[_key - 1] = arguments[_key];
  }

  if (virtualNode.isCustomVirtualNode) {
    (0, _toolsMapObj2['default'])(function (childVirtualNode) {
      if ((0, _toolsAsArray2['default'])(childVirtualNode.output).indexOf('output') !== -1) {
        var audioNode = childVirtualNode.audioNode;

        audioNode.connect && audioNode.connect.apply(audioNode, _toConsumableArray(connectArgs.filter(function (x) {
          return x;
        })));
      }
    }, virtualNode.virtualNodes);
  } else {
    var audioNode = virtualNode.audioNode;

    audioNode.connect && audioNode.connect.apply(audioNode, _toConsumableArray(connectArgs.filter(function (x) {
      return x;
    })));
  }
  virtualNode.connected = true;
};

module.exports = exports['default'];