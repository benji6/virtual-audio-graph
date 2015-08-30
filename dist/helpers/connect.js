'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _toolsAsArray = require('../tools/asArray');

var _toolsAsArray2 = _interopRequireDefault(_toolsAsArray);

var _toolsMapObj = require('../tools/mapObj');

var _toolsMapObj2 = _interopRequireDefault(_toolsMapObj);

exports['default'] = function (virtualNode, destination) {
  if (virtualNode.isCustomVirtualNode) {
    (0, _toolsMapObj2['default'])(function (childVirtualNode) {
      if ((0, _toolsAsArray2['default'])(childVirtualNode.output).indexOf('output') !== -1) {
        childVirtualNode.audioNode.connect(destination);
      }
    }, virtualNode.virtualNodes);
  } else {
    virtualNode.audioNode.connect(destination);
  }
  virtualNode.connected = true;
};

module.exports = exports['default'];