const {concat, differenceWith, eqProps, find, findIndex, forEach, intersectionWith, map, prop, propEq, remove} = require('ramda');
const VirtualAudioNode = require('./VirtualAudioNode');

class VirtualAudioGraph {
  constructor (params = {}) {
    this.audioContext = params.audioContext || new AudioContext();
    this.destination = params.destination || this.audioContext.destination;
    this.virtualAudioGraph = [];
  }

  connectAudioNodes () {
    forEach(({audioNode, connections}) => {
      forEach((connection) => {
        if (connection === 0) {
          audioNode.connect(this.destination);
        } else {
          audioNode.connect(prop("audioNode", find(propEq("id", connection))(this.virtualAudioGraph)));
        }
      }, connections);
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
