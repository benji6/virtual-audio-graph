const {any, concat, differenceWith, eqProps, find, findIndex, forEach, intersectionWith, map, prop, propEq, remove} = require('ramda');
const VirtualAudioNode = require('./VirtualAudioNode');

class VirtualAudioGraph {
  constructor (params = {}) {
    this.audioContext = params.audioContext || new AudioContext();
    this.output = params.output || this.audioContext.destination;
    this.virtualAudioGraph = [];
  }

  connectAudioNodes () {
    forEach(({audioNode, output}) => {
      forEach((connection) => {
        if (connection === 'output') {
          audioNode.connect(this.output);
        } else {
          audioNode.connect(prop("audioNode", find(propEq("id", connection))(this.virtualAudioGraph)));
        }
      }, output);
    }, this.virtualAudioGraph);
    return this;
  }

  createAudioNode (nodeParams) {
    return new VirtualAudioNode(this.audioContext, nodeParams);
  }

  createAudioNodes (virtualAudioNodeParams) {
    this.virtualAudioGraph = concat(this.virtualAudioGraph, map(this.createAudioNode.bind(this), virtualAudioNodeParams));
    return this;
  }

  removeAudioNodes (virtualAudioNodes) {
    forEach(({audioNode, id}) => {
      audioNode.stop && audioNode.stop();
      audioNode.disconnect();
      this.virtualAudioGraph = remove(findIndex(propEq("id", id))(this.virtualAudioGraph), 1, this.virtualAudioGraph);
    }, virtualAudioNodes);
    return this;
  }

  update (virtualAudioNodeParams) {
    if (any(propEq('id', undefined), virtualAudioNodeParams)) {
      throw new Error('Every virtualAudioNode needs an id for efficient diffing and determining relationships between nodes');
    }
    const newAudioNodes = differenceWith(eqProps('id'), virtualAudioNodeParams, this.virtualAudioGraph);
    const oldAudioNodes = differenceWith(eqProps('id'), this.virtualAudioGraph, virtualAudioNodeParams);
    const sameAudioNodes = intersectionWith(eqProps('id'), virtualAudioNodeParams, this.virtualAudioGraph);

    return this
      .removeAudioNodes(oldAudioNodes)
      .updateAudioNodes(sameAudioNodes)
      .createAudioNodes(newAudioNodes)
      .connectAudioNodes();
  }

  updateAudioNodes (virtualAudioNodeParams) {
    forEach((virtualAudioNodeParam) => {
      const virtualAudioNode = find(propEq("id", virtualAudioNodeParam.id))(this.virtualAudioGraph);
      virtualAudioNode.updateAudioNode(virtualAudioNodeParam.params);
    }, virtualAudioNodeParams);
    return this;
  }
}

module.exports = VirtualAudioGraph;
