const {append, forEach, isNil, keys} = require('ramda');
const capitalize = require('capitalize');
const connect = require('./tools/connect');
const connectAudioNodes = require('./tools/connectAudioNodes');
const createVirtualAudioNode = require('./tools/createVirtualAudioNode');
const disconnectAndRemoveVirtualAudioNode = require('./tools/disconnectAndRemoveVirtualAudioNode');
const updateAudioNodeAndVirtualAudioGraph = require('./tools/updateAudioNodeAndVirtualAudioGraph');

const testWhetherNodeDoesNotNeedRemoving = (virtualNode, {id, params = {}}) => {
  const {startTime, stopTime} = params;
  if (virtualNode.id !== id) {
    return false;
  }
  if (virtualNode.params.startTime !== startTime) {
    return false;
  }
  if (virtualNode.params.stopTime !== stopTime) {
    return false;
  }
  return true;
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
    if (this.audioContext[`create${capitalize(name)}`]) {
      throw new Error(`${name} is a standard audio node name and cannot be overwritten`);
    }

    this.customNodes[name] = customNodeParamsFactory;
    return this;
  }

  update (virtualGraphParams) {
    // const virtualNodesToBeRemoved = differenceWith(testWhetherNodeDoesNotNeedRemoving,
    //                                                this.virtualNodes,
    //                                                virtualGraphParams);
    //
    // forEach(disconnectAndRemoveVirtualAudioNode.bind(this), virtualNodesToBeRemoved);

    forEach((id) => {
      const virtualAudioNode = this.virtualNodes[id];
      const virtualAudioNodeParam = virtualGraphParams[id];

      if (id === 'output') {
        throw new Error(`'output' is not a valid id`);
      }
      if (isNil(virtualAudioNodeParam.output)) {
        throw new Error(`ouptput not specified for node id ${id}`);
      }


      if (virtualAudioNode) {
        updateAudioNodeAndVirtualAudioGraph.call(this, virtualAudioNode, virtualAudioNodeParam);
      } else {
        this.virtualNodes = append(createVirtualAudioNode.call(this, virtualAudioNodeParam), this.virtualNodes);
        this.virtualNodes[id] = createVirtualAudioNode.call(this, virtualAudioNodeParam);
      }
    }, keys(virtualGraphParams));

    connectAudioNodes(this.virtualNodes,
                      virtualAudioNode => connect(virtualAudioNode,
                                                  this.output));

    return this;
  }
}

module.exports = VirtualAudioGraph;
