'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = disconnect;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _toolsValues = require('../tools/values');

var _toolsValues2 = _interopRequireDefault(_toolsValues);

function disconnect(virtualNode, doNotStop) {
  if (virtualNode.isCustomVirtualNode) {
    (0, _toolsValues2['default'])(virtualNode.virtualNodes).forEach(disconnect);
  } else {
    var audioNode = virtualNode.audioNode;

    if (audioNode.stop && !virtualNode.stopCalled && !doNotStop) {
      audioNode.stop();
    }
    audioNode.disconnect && audioNode.disconnect();
  }
  virtualNode.connected = false;
}

module.exports = exports['default'];