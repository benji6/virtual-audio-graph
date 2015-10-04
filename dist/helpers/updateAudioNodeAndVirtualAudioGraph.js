'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _createVirtualAudioNode = require('./createVirtualAudioNode');

var _createVirtualAudioNode2 = _interopRequireDefault(_createVirtualAudioNode);

var _disconnect = require('./disconnect');

var _disconnect2 = _interopRequireDefault(_disconnect);

var _update = require('./update');

var _update2 = _interopRequireDefault(_update);

var checkOutputsEqual = function checkOutputsEqual(output0, output1) {
  if (Array.isArray(output0)) {
    if (!Array.isArray(output1)) {
      return false;
    }
    return output0.every(function (x) {
      return output1.indexOf(x) !== -1;
    });
  }
  return output0 === output1;
};

exports['default'] = function (audioContext, virtualNodes, customNodes, virtualAudioNode, virtualAudioNodeParam, id) {
  if (virtualAudioNodeParam[0] !== virtualAudioNode.node) {
    (0, _disconnect2['default'])(virtualAudioNode);
    virtualNodes[id] = (0, _createVirtualAudioNode2['default'])(audioContext, customNodes, virtualAudioNodeParam);
    return;
  }

  if (!checkOutputsEqual(virtualAudioNodeParam[1], virtualAudioNode.output)) {
    (0, _disconnect2['default'])(virtualAudioNode, true);
    virtualAudioNode.output = virtualAudioNodeParam[1];
  }

  (0, _update2['default'])(virtualAudioNode, virtualAudioNodeParam[2]);
};

module.exports = exports['default'];