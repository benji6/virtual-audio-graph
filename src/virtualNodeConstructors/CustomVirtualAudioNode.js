const {contains, filter, forEach, keys, pick, pluck, propEq, omit} = require('ramda');
const connectAudioNodes = require('../tools/connectAudioNodes');
// if you use the below extract it
// const constructorParamsKeys = [
//   'maxDelayTime',
// ];

module.exports = class CustomVirtualAudioNode {
  constructor (virtualAudioGraph, virtualNodeParams) {
    let {node, id, output} = virtualNodeParams;
    // params = params || {};
    // const constructorParams = pick(constructorParamsKeys, params);
    // params = omit(constructorParamsKeys, params);
    // this.updateAudioNode(params);
    this.virtualAudioGraph = virtualAudioGraph.customNodes[node]();
    this.virtualAudioGraph = virtualAudioGraph.createVirtualAudioNodes(this.virtualAudioGraph);
    connectAudioNodes(CustomVirtualAudioNode, this.virtualAudioGraph);
    this.id = id;
    this.output = Array.isArray(output) ? output : [output];
  }

  connect (destination) {
    const outputVirtualNodes = filter(({output}) => contains('output', output), this.virtualAudioGraph);
    forEach((audioNode) => audioNode.connect(destination), pluck('audioNode', outputVirtualNodes));
  }

  get inputs () {
    return pluck('audioNode', filter(propEq('input', 'input'), this.virtualAudioGraph));
  }

  updateAudioNode (params) {
    // need to implement some update logic here
  }
};
