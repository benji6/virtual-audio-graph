const {concat, differenceWith, eqProps, find, findIndex, forEach, map, prop, propEq, remove} = require('ramda');
const VirtualAudioNode = require('./VirtualAudioNode');

class VirtualAudioGraph {
  constructor (params = {}) {
    Object.assign(this, {
      audioContext: params.audioContext,
      destination: params.destination,
      virtualAudioGraph: [],
    });
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
    return this
      .removeAudioNodes(oldAudioNodes)
      //update to go here
      .createAudioNodes(newAudioNodes)
      .connectAudioNodes();
  }
}

module.exports = VirtualAudioGraph;
