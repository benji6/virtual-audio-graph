'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersCreateAudioNode = require('../helpers/createAudioNode');

var _helpersCreateAudioNode2 = _interopRequireDefault(_helpersCreateAudioNode);

var _helpersUpdate = require('../helpers/update');

var _helpersUpdate2 = _interopRequireDefault(_helpersUpdate);

var _dataConstructorParamsKeys = require('../data/constructorParamsKeys');

var _dataConstructorParamsKeys2 = _interopRequireDefault(_dataConstructorParamsKeys);

exports['default'] = function (virtualAudioGraph, _ref) {
  var node = _ref.node;
  var input = _ref.input;
  var output = _ref.output;
  var params = _ref.params;

  params = params || {};
  var _params = params;
  var startTime = _params.startTime;
  var stopTime = _params.stopTime;

  var constructorParam = params[Object.keys(params).filter(function (key) {
    return _dataConstructorParamsKeys2['default'].indexOf(key) !== -1;
  })[0]];
  var virtualNode = {
    audioNode: (0, _helpersCreateAudioNode2['default'])(virtualAudioGraph.audioContext, node, constructorParam, { startTime: startTime, stopTime: stopTime }),
    connected: false,
    isCustomVirtualNode: false,
    input: input,
    node: node,
    output: output,
    stopCalled: stopTime !== undefined
  };
  return (0, _helpersUpdate2['default'])(virtualNode, params);
};

module.exports = exports['default'];