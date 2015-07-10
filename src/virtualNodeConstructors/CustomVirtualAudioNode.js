const {contains, filter, forEach, keys, pick, pluck, propEq, omit, zipWith} = require('ramda');
const asArray = require('../tools/asArray');
const connectAudioNodes = require('../tools/connectAudioNodes');

module.exports = class CustomVirtualAudioNode {
  constructor (virtualAudioGraph, {node, id, output, params}) {
    params = params || {};
    this.audioGraphParamsFactory = virtualAudioGraph.customNodes[node];
    this.connected = false;
    this.node = node;
    this.virtualNodes = this.audioGraphParamsFactory(params);
    this.virtualNodes = virtualAudioGraph.createVirtualAudioNodes(this.virtualNodes);
    connectAudioNodes(CustomVirtualAudioNode, this.virtualNodes);
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
