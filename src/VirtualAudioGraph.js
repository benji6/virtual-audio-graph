const {append, concat, differenceWith, eqProps, equals, find, findIndex, forEach, isNil, map, partition, propEq, remove} = require('ramda');
const capitalize = require('capitalize');
const NativeVirtualAudioNode = require('./virtualNodeConstructors/NativeVirtualAudioNode');
const CustomVirtualAudioNode = require('./virtualNodeConstructors/CustomVirtualAudioNode');
const connectAudioNodes = require('./tools/connectAudioNodes');
const createVirtualAudioNode = require('./tools/createVirtualAudioNode');

const disconnectAndRemoveVirtualAudioNode = function (virtualNode) {
  virtualNode.disconnect();
  this.virtualNodes = remove(findIndex(propEq('id', virtualNode.id))(this.virtualNodes), 1, this.virtualNodes);
};

const removeAudioNodesAndUpdateVirtualAudioGraph = function (virtualAudioNodeParams) {
  const virtualNodesToBeRemoved = differenceWith(eqProps('id'), this.virtualNodes, virtualAudioNodeParams);

  forEach(disconnectAndRemoveVirtualAudioNode.bind(this), virtualNodesToBeRemoved);

  return virtualAudioNodeParams;
};

const updateAudioNodeAndVirtualAudioGraph = function (virtualAudioNode, virtualAudioNodeParam) {
  if (virtualAudioNodeParam.node !== virtualAudioNode.node) {
    disconnectAndRemoveVirtualAudioNode.call(this, virtualAudioNode);
    this.virtualNodes = append(createVirtualAudioNode.call(this, virtualAudioNodeParam), this.virtualNodes);
    return;
  }

  if (!equals(virtualAudioNodeParam.output, virtualAudioNode.output)) {
    virtualAudioNode.disconnect();
    virtualAudioNode.output = virtualAudioNodeParam.output;
  }

  virtualAudioNode.updateAudioNode(virtualAudioNodeParam.params);
};

class VirtualAudioGraph {
  constructor (params = {}) {
    this.audioContext = params.audioContext || new AudioContext();
    this.output = params.output || this.audioContext.destination;
    this.virtualNodes = [];
    this.customNodes = {};
  }

  get currentTime () {
    return this.audioContext.currentTime;
  }

  defineNode (customNodeParamsFactory, name) {
    if (this.audioContext[`create${capitalize(name)}`])
      throw new Error(`${name} is a standard audio node name and cannot be overwritten`);

    this.customNodes[name] = customNodeParamsFactory;
    return this;
  }

  update (virtualAudioNodeParams) {
    removeAudioNodesAndUpdateVirtualAudioGraph.call(this, virtualAudioNodeParams);

    forEach((virtualAudioNodeParam) => {
      const {id} = virtualAudioNodeParam;

      if (isNil(id))
        throw new Error('Every virtualAudioNode needs an id for efficient diffing and determining relationships between nodes');
      if (id === 'output')
        throw new Error(`'output' is not a valid id`);

      const virtualAudioNode = find(propEq('id', id))(this.virtualNodes);

      if (virtualAudioNode) updateAudioNodeAndVirtualAudioGraph.call(this, virtualAudioNode, virtualAudioNodeParam);
        else this.virtualNodes = append(createVirtualAudioNode.call(this, virtualAudioNodeParam), this.virtualNodes);
    }, virtualAudioNodeParams);

    connectAudioNodes(CustomVirtualAudioNode, this.virtualNodes, (virtualAudioNode) =>
      virtualAudioNode.connect(this.output));

    return this;
  }
}

module.exports = VirtualAudioGraph;
