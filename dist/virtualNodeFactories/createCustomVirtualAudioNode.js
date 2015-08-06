'use strict';

var connectAudioNodes = require('../tools/connectAudioNodes');
var createNativeVirtualAudioNode = require('../virtualNodeFactories/createNativeVirtualAudioNode');
var mapObj = require('../tools/mapObj');

module.exports = function createCustomVirtualNode(virtualAudioGraph, _ref) {
  var node = _ref.node;
  var output = _ref.output;
  var params = _ref.params;

  params = params || {};
  var audioGraphParamsFactory = virtualAudioGraph.customNodes[node];
  var virtualNodes = mapObj(function (virtualAudioNodeParam) {
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