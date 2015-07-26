'use strict';

var _require = require('ramda');

var mapObj = _require.mapObj;

var connectAudioNodes = require('../tools/connectAudioNodes');
var createNativeVirtualAudioNode = require('../virtualNodeFactories/createNativeVirtualAudioNode');

module.exports = function createCustomVirtualNode(virtualAudioGraph, _ref) {
  var node = _ref.node;
  var output = _ref.output;
  var params = _ref.params;

  params = params || {};
  var audioGraphParamsFactory = virtualAudioGraph.customNodes[node];
  var virtualNodes = mapObj(function createVirtualAudioNode(virtualAudioNodeParam) {
    if (virtualAudioGraph.customNodes[virtualAudioNodeParam.node]) {
      return createCustomVirtualNode(virtualAudioGraph, virtualAudioNodeParam);
    }

    return createNativeVirtualAudioNode(virtualAudioGraph, virtualAudioNodeParam);
  }, audioGraphParamsFactory(params));

  connectAudioNodes(virtualNodes);

  return {
    audioGraphParamsFactory: audioGraphParamsFactory,
    connected: false,
    isCustomVirtualNode: true,
    node: node,
    output: output,
    params: params,
    virtualNodes: virtualNodes
  };
};