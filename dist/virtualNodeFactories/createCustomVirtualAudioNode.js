'use strict';

var _require = require('ramda');

var map = _require.map;

var connectAudioNodes = require('../tools/connectAudioNodes');
var createNativeVirtualAudioNode = require('../virtualNodeFactories/createNativeVirtualAudioNode');

module.exports = function createCustomVirtualNode(virtualAudioGraph, _ref) {
  var node = _ref.node;
  var id = _ref.id;
  var output = _ref.output;
  var params = _ref.params;

  params = params || {};
  var audioGraphParamsFactory = virtualAudioGraph.customNodes[node];
  var virtualNode = {
    audioGraphParamsFactory: audioGraphParamsFactory,
    connected: false,
    id: id,
    isCustomVirtualNode: true,
    node: node,
    output: output,
    params: params,
    virtualNodes: map(function createVirtualAudioNode(virtualAudioNodeParam) {
      if (virtualAudioGraph.customNodes[virtualAudioNodeParam.node]) {
        return createCustomVirtualNode(virtualAudioGraph, virtualAudioNodeParam);
      }

      return createNativeVirtualAudioNode(virtualAudioGraph, virtualAudioNodeParam);
    }, audioGraphParamsFactory(params))
  };

  connectAudioNodes(virtualNode.virtualNodes);

  return virtualNode;
};