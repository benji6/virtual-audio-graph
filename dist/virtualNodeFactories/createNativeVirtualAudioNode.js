'use strict';

var createAudioNode = require('../tools/createAudioNode');
var update = require('../tools/update');

var pick = function pick(names, obj) {
  var result = {};
  var idx = 0;
  while (idx < names.length) {
    if (names[idx] in obj) {
      result[names[idx]] = obj[names[idx]];
    }
    idx += 1;
  }
  return result;
};

var constructorParamsKeys = ['maxDelayTime'];

module.exports = function (virtualAudioGraph, _ref) {
  var node = _ref.node;
  var input = _ref.input;
  var output = _ref.output;
  var params = _ref.params;

  params = params || {};
  var _params = params;
  var startTime = _params.startTime;
  var stopTime = _params.stopTime;

  var constructorParams = pick(constructorParamsKeys, params);
  var virtualNode = {
    audioNode: createAudioNode(virtualAudioGraph.audioContext, node, constructorParams, { startTime: startTime, stopTime: stopTime }),
    connected: false,
    isCustomVirtualNode: false,
    input: input,
    node: node,
    output: output
  };
  return update(virtualNode, params);
};