const {contains, filter, forEach, pluck, propEq, map, zipWith} = require('ramda');
const asArray = require('../tools/asArray');
const connectAudioNodes = require('../tools/connectAudioNodes');
const NativeVirtualAudioNode = require('../virtualNodeConstructors/NativeVirtualAudioNode');

module.exports = class CustomVirtualAudioNode {
  constructor (virtualAudioGraph, {node, id, output, params}) {
    params = params || {};
    this.audioGraphParamsFactory = virtualAudioGraph.customNodes[node];
    this.connected = false;
    this.node = node;
    this.virtualNodes = map(function createVirtualAudioNode (virtualAudioNodeParam) {
      if (this.customNodes[virtualAudioNodeParam.node])
        return new CustomVirtualAudioNode(this, virtualAudioNodeParam);

      return new NativeVirtualAudioNode(this, virtualAudioNodeParam);
    }.bind(virtualAudioGraph), this.audioGraphParamsFactory(params));

    connectAudioNodes.call(this, CustomVirtualAudioNode);
    this.id = id;
    this.output = output;
  }

  connect (destination) {
    const outputVirtualNodes = filter(({output}) => contains('output', asArray(output)), this.virtualNodes);
    forEach((audioNode) => audioNode.connect(destination), pluck('audioNode', outputVirtualNodes));
    this.connected = true;
  }

  disconnect () {
    forEach((virtualNode) => virtualNode.disconnect(), this.virtualNodes);
    this.connected = false;
  }

  get inputs () {
    return pluck('audioNode', filter(propEq('input', 'input'), this.virtualNodes));
  }

  updateAudioNode (params) {
    zipWith((virtualNode, {params}) => virtualNode.updateAudioNode(params), this.virtualNodes, this.audioGraphParamsFactory(params));
  }
};
