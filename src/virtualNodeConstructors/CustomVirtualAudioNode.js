const {map} = require('ramda');
const connectAudioNodes = require('../tools/connectAudioNodes');
const NativeVirtualAudioNode = require('../virtualNodeConstructors/NativeVirtualAudioNode');

module.exports = class CustomVirtualAudioNode {
  constructor (virtualAudioGraph, {node, id, output, params}) {
    params = params || {};
    this.audioGraphParamsFactory = virtualAudioGraph.customNodes[node];
    this.connected = false;
    this.node = node;
    this.virtualNodes = map(function createVirtualAudioNode (virtualAudioNodeParam) {
      if (this.customNodes[virtualAudioNodeParam.node]) {
        return new CustomVirtualAudioNode(this, virtualAudioNodeParam);
      }

      return new NativeVirtualAudioNode(this, virtualAudioNodeParam);
    }.bind(virtualAudioGraph), this.audioGraphParamsFactory(params));

    connectAudioNodes(this.virtualNodes);
    this.id = id;
    this.output = output;
    this.isCustomVirtualNode = true;
  }
};
