'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = createCustomVirtualNode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersConnectAudioNodes = require('../helpers/connectAudioNodes');

var _helpersConnectAudioNodes2 = _interopRequireDefault(_helpersConnectAudioNodes);

var _virtualNodeFactoriesCreateStandardVirtualAudioNode = require('../virtualNodeFactories/createStandardVirtualAudioNode');

var _virtualNodeFactoriesCreateStandardVirtualAudioNode2 = _interopRequireDefault(_virtualNodeFactoriesCreateStandardVirtualAudioNode);

var _toolsMapObj = require('../tools/mapObj');

var _toolsMapObj2 = _interopRequireDefault(_toolsMapObj);

function createCustomVirtualNode(virtualAudioGraph, _ref) {
  var node = _ref.node;
  var output = _ref.output;
  var params = _ref.params;

  params = params || {};
  var audioGraphParamsFactory = virtualAudioGraph.customNodes[node];
  var virtualNodes = (0, _toolsMapObj2['default'])(function (virtualAudioNodeParam) {
    if (virtualAudioGraph.customNodes[virtualAudioNodeParam.node]) {
      return createCustomVirtualNode(virtualAudioGraph, virtualAudioNodeParam);
    }
    return (0, _virtualNodeFactoriesCreateStandardVirtualAudioNode2['default'])(virtualAudioGraph, virtualAudioNodeParam);
  }, audioGraphParamsFactory(params));

  (0, _helpersConnectAudioNodes2['default'])(virtualNodes);

  return {
    audioGraphParamsFactory: audioGraphParamsFactory,
    connected: false,
    isCustomVirtualNode: true,
    node: node,
    output: output,
    params: params,
    virtualNodes: virtualNodes
  };
}

module.exports = exports['default'];