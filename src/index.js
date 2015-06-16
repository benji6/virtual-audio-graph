const {find, forEach, map, prop, propEq} = require('ramda');

const namesToConstructors = {
  oscillator: require('./nodeConstructors/Oscillator'),
  gain: require('./nodeConstructors/Gain'),
};

class VirtualAudioGraph {
  constructor (params = {}) {
    Object.assign(this, {
      audioContext: params.audioContext,
      destination: params.destination,
      virtualAudioGraph: null,
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
  }

  createAudioNode (nodeParams) {
    const constructor = namesToConstructors[nodeParams.name];
    if (constructor === undefined) {
      throw new Error(`${name} is not recognised as an virtual-audio-node name`);
    }
    return new constructor(this.audioContext, nodeParams);
  }

  createAudioNodes (virtualAudioNodeParams) {
    if (Array.isArray(virtualAudioNodeParams)) {
      this.virtualAudioGraph = map(this.createAudioNode.bind(this), virtualAudioNodeParams);
    } else {
      this.virtualAudioGraph = [this.createAudioNode(virtualAudioNodeParams)];
    }
    return this;
  }

  update (virtualAudioNodeParams) {
    this
      .createAudioNodes(virtualAudioNodeParams)
      .connectAudioNodes();
    return this;
  }
}

module.exports = VirtualAudioGraph;
