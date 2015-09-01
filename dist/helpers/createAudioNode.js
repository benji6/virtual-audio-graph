'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _capitalize = require('capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

var _dataStartAndStopNodes = require('../data/startAndStopNodes');

var _dataStartAndStopNodes2 = _interopRequireDefault(_dataStartAndStopNodes);

exports['default'] = function (audioContext, name, constructorParam, _ref) {
  var startTime = _ref.startTime;
  var stopTime = _ref.stopTime;

  var audioNode = constructorParam ? audioContext['create' + (0, _capitalize2['default'])(name)](constructorParam) : audioContext['create' + (0, _capitalize2['default'])(name)]();
  if (_dataStartAndStopNodes2['default'].indexOf(name) !== -1) {
    if (startTime == null) {
      audioNode.start();
    } else {
      audioNode.start(startTime);
    }
    if (stopTime != null) {
      audioNode.stop(stopTime);
    }
  }
  return audioNode;
};

module.exports = exports['default'];