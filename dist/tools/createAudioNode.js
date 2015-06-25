'use strict';

var capitalizeFirst = require('./capitalizeFirst');

var namesToParamsKey = {
  delay: 'maxDelayTime'
};

module.exports = function (audioContext, name, constructorParams) {
  var constructorParamsKey = namesToParamsKey[name];
  var audioNode = constructorParamsKey ? audioContext['create' + capitalizeFirst(name)](constructorParams[constructorParamsKey]) : audioContext['create' + capitalizeFirst(name)]();
  if (name === 'oscillator') {
    audioNode.start();
  }
  return audioNode;
};