'use strict';

var capitalize = require('capitalize');

var _require = require('ramda');

var isNil = _require.isNil;

var namesToParamsKey = {
  delay: 'maxDelayTime'
};

module.exports = function (audioContext, name, constructorParams, _ref) {
  var startTime = _ref.startTime;
  var stopTime = _ref.stopTime;

  var constructorParamsKey = namesToParamsKey[name];
  var audioNode = constructorParamsKey ? audioContext['create' + capitalize(name)](constructorParams[constructorParamsKey]) : audioContext['create' + capitalize(name)]();
  if (name === 'oscillator') {
    if (isNil(startTime)) {
      audioNode.start();
    } else {
      audioNode.start(startTime);
    }
    if (!isNil(stopTime)) {
      audioNode.stop(stopTime);
    }
  }
  return audioNode;
};