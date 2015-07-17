'use strict';

var _require = require('ramda');

var pick = _require.pick;

var createAudioNode = require('../tools/createAudioNode');
var update = require('../tools/update');

var constructorParamsKeys = ['maxDelayTime'];

module.exports = function (virtualAudioGraph, _ref) {
  var node = _ref.node;
  var id = _ref.id;
  var input = _ref.input;
  var output = _ref.output;
  var params = _ref.params;

  params = params || {};
  var startTime = params.startTime;
  var stopTime = params.stopTime;

  var constructorParams = pick(constructorParamsKeys, params);
  var virtualNode = {
    audioNode: createAudioNode(virtualAudioGraph.audioContext, node, constructorParams, { startTime: startTime, stopTime: stopTime }),
    connected: false,
    isCustomVirtualNode: false,
    id: id,
    input: input,
    node: node,
    output: output
  };
  return update(virtualNode, params);
};