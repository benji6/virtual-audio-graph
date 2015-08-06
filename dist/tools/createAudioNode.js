'use strict';

var capitalize = require('capitalize');

var namesToParamsKey = {
  delay: 'maxDelayTime'
};

module.exports = function (audioContext, name, constructorParams, _ref) {
  var startTime = _ref.startTime;
  var stopTime = _ref.stopTime;

  var constructorParamsKey = namesToParamsKey[name];
  var audioNode = constructorParamsKey ? audioContext['create' + capitalize(name)](constructorParams[constructorParamsKey]) : audioContext['create' + capitalize(name)]();
  if (name === 'oscillator') {
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