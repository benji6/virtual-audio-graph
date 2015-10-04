'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _virtualNodeFactoriesCreateStandardVirtualAudioNode = require('../virtualNodeFactories/createStandardVirtualAudioNode');

var _virtualNodeFactoriesCreateStandardVirtualAudioNode2 = _interopRequireDefault(_virtualNodeFactoriesCreateStandardVirtualAudioNode);

var _virtualNodeFactoriesCreateCustomVirtualAudioNode = require('../virtualNodeFactories/createCustomVirtualAudioNode');

var _virtualNodeFactoriesCreateCustomVirtualAudioNode2 = _interopRequireDefault(_virtualNodeFactoriesCreateCustomVirtualAudioNode);

exports['default'] = function (audioContext, customNodes, virtualAudioNodeParam) {
  return customNodes[virtualAudioNodeParam[0]] ? (0, _virtualNodeFactoriesCreateCustomVirtualAudioNode2['default'])(audioContext, customNodes, virtualAudioNodeParam) : (0, _virtualNodeFactoriesCreateStandardVirtualAudioNode2['default'])(audioContext, virtualAudioNodeParam);
};

module.exports = exports['default'];