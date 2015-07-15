const {append, find, forEach, isNil, propEq} = require('ramda');
const capitalize = require('capitalize');
const CustomVirtualAudioNode = require('./virtualNodeConstructors/CustomVirtualAudioNode');
const connectAudioNodes = require('./tools/connectAudioNodes');
const createVirtualAudioNode = require('./tools/createVirtualAudioNode');
const removeAudioNodesAndUpdateVirtualAudioGraph = require('./tools/removeAudioNodesAndUpdateVirtualAudioGraph');
const updateAudioNodeAndVirtualAudioGraph = require('./tools/updateAudioNodeAndVirtualAudioGraph');

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

      const virtualAudioNode = find(propEq(id, 'id'))(this.virtualNodes);

      if (virtualAudioNode) updateAudioNodeAndVirtualAudioGraph.call(this, virtualAudioNode, virtualAudioNodeParam);
        else this.virtualNodes = append(createVirtualAudioNode.call(this, virtualAudioNodeParam), this.virtualNodes);
    }, virtualAudioNodeParams);

    connectAudioNodes(CustomVirtualAudioNode, this.virtualNodes, (virtualAudioNode) =>
      virtualAudioNode.connect(this.output));

    return this;
  }
}

module.exports = VirtualAudioGraph;
