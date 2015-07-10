const {any, assoc, concat, compose, differenceWith, eqProps, equals, find, findIndex,
  forEach, intersectionWith, isNil, map, partition, propEq, remove} = require('ramda');
const capitalize = require('capitalize');
const NativeVirtualAudioNode = require('./virtualNodeConstructors/NativeVirtualAudioNode');
const CustomVirtualAudioNode = require('./virtualNodeConstructors/CustomVirtualAudioNode');
const connectAudioNodes = require('./tools/connectAudioNodes');

const disconnectAndRemoveVirtualAudioNode = function (virtualNode) {
  virtualNode.disconnect();
  this.virtualNodes = remove(findIndex(propEq("id", virtualNode.id))(this.virtualNodes), 1, this.virtualNodes);
};

const createVirtualAudioNodesAndUpdateVirtualAudioGraph = function (virtualAudioNodeParams) {
  const newVirtualAudioNodeParams = differenceWith(eqProps('id'), virtualAudioNodeParams, this.virtualNodes);

  this.virtualNodes = concat(this.virtualNodes, this.createVirtualAudioNodes(newVirtualAudioNodeParams));

  return virtualAudioNodeParams;
};

const removeAudioNodesAndUpdateVirtualAudioGraph = function (virtualAudioNodeParams) {
  const virtualNodesToBeRemoved = differenceWith(eqProps('id'), this.virtualNodes, virtualAudioNodeParams);

  forEach(disconnectAndRemoveVirtualAudioNode.bind(this), virtualNodesToBeRemoved);

  return virtualAudioNodeParams;
};

const updateAudioNodesAndUpdateVirtualAudioGraph = function (virtualAudioNodeParams) {
  const updateParams = intersectionWith(eqProps('id'), virtualAudioNodeParams, this.virtualNodes);

  forEach((virtualAudioNodeParam) => {
    const virtualAudioNode = find(propEq("id", virtualAudioNodeParam.id))(this.virtualNodes);
    if (virtualAudioNodeParam.node !== virtualAudioNode.node)
      disconnectAndRemoveVirtualAudioNode.call(this, virtualAudioNode);

    if (!equals(virtualAudioNodeParam.output, virtualAudioNode.output)) {
      virtualAudioNode.disconnect();
      virtualAudioNode.output = virtualAudioNodeParam.output;
    }

    virtualAudioNode.updateAudioNode(virtualAudioNodeParam.params);
  }, updateParams);

  return virtualAudioNodeParams;
};

class VirtualAudioGraph {
  constructor (params = {}) {
    this.audioContext = params.audioContext || new AudioContext();
    this.output = params.output || this.audioContext.destination;
    this.virtualNodes = [];
    this.customNodes = {};

    this._removeUpdateAndCreate = compose(
      createVirtualAudioNodesAndUpdateVirtualAudioGraph.bind(this),
      updateAudioNodesAndUpdateVirtualAudioGraph.bind(this),
      removeAudioNodesAndUpdateVirtualAudioGraph.bind(this)
    );
  }

  createVirtualAudioNodes (virtualAudioNodesParams) {
    const partitionedVirtualAudioNodeParams = partition(({node}) =>
      isNil(this.customNodes[node]), virtualAudioNodesParams);

    const nativeVirtualAudioNodeParams = partitionedVirtualAudioNodeParams[0];
    const customVirtualAudioNodeParams = partitionedVirtualAudioNodeParams[1];

    const nativeVirtualAudioNodes = map((virtualAudioNodeParams) =>
      new NativeVirtualAudioNode(this, virtualAudioNodeParams), nativeVirtualAudioNodeParams);
    const customVirtualAudioNodes = map((virtualAudioNodeParams) =>
      new CustomVirtualAudioNode(this, virtualAudioNodeParams), customVirtualAudioNodeParams);

    return concat(nativeVirtualAudioNodes, customVirtualAudioNodes);
  }

  defineNode (customNodeParamsFactory, name) {
    if (this.audioContext[`create${capitalize(name)}`])
      throw new Error(`${name} is a standard audio node name and cannot be overwritten`);

    this.customNodes[name] = customNodeParamsFactory;
    return this;
  }

  update (virtualAudioNodeParams) {
    if (any(propEq('id', undefined), virtualAudioNodeParams))
      throw new Error('Every virtualAudioNode needs an id for efficient diffing and determining relationships between nodes');

    this._removeUpdateAndCreate(virtualAudioNodeParams);

    connectAudioNodes(CustomVirtualAudioNode, this.virtualNodes, (virtualAudioNode) =>
      virtualAudioNode.connect(this.output));

    return this;
  }
}

module.exports = VirtualAudioGraph;
