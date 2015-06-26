const {contains, filter, forEach, keys, pick, pluck, propEq, omit, zipWith} = require('ramda');
const connectAudioNodes = require('../tools/connectAudioNodes');

module.exports = class CustomVirtualAudioNode {
  constructor (virtualAudioGraph, {node, id, output, params}) {
    params = params || {};
    this.audioGraphParamsFactory = virtualAudioGraph.customNodes[node];
    this.virtualNodes = this.audioGraphParamsFactory(params);
    this.virtualNodes = virtualAudioGraph.createVirtualAudioNodes(this.virtualNodes);
    connectAudioNodes(CustomVirtualAudioNode, this.virtualNodes);
    this.id = id;
    this.output = Array.isArray(output) ? output : [output];
  }

  connect (destination) {
    const outputVirtualNodes = filter(({output}) => contains('output', output), this.virtualNodes);
    forEach((audioNode) => audioNode.connect(destination), pluck('audioNode', outputVirtualNodes));
  }

  disconnect () {
    forEach((virtualNode) => virtualNode.disconnect(), this.virtualNodes);
  }

  get inputs () {
    return pluck('audioNode', filter(propEq('input', 'input'), this.virtualNodes));
  }

  updateAudioNode (params) {
    zipWith((virtualNode, {params}) => virtualNode.updateAudioNode(params), this.virtualNodes, this.audioGraphParamsFactory(params));
  }
};
