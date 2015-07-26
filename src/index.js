const {compose, difference, forEach, isNil, keys, tap} = require('ramda');
const capitalize = require('capitalize');
const connect = require('./tools/connect');
const connectAudioNodes = require('./tools/connectAudioNodes');
const createVirtualAudioNode = require('./tools/createVirtualAudioNode');
const updateAudioNodeAndVirtualAudioGraph = require('./tools/updateAudioNodeAndVirtualAudioGraph');
import disconnect from './tools/disconnect';

module.exports = class VirtualAudioGraph {
  constructor (params = {}) {
    this.audioContext = params.audioContext || new AudioContext();
    this.output = params.output || this.audioContext.destination;
    this.virtualNodes = {};
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
    const idsToRemove = difference(keys(this.virtualNodes),
                                   keys(virtualGraphParams));

    forEach(compose(id => delete this.virtualNodes[id],
                    tap(id => disconnect(this.virtualNodes[id]))),
            idsToRemove);

    forEach(id => {
      const virtualAudioNode = this.virtualNodes[id];
      const virtualAudioNodeParam = virtualGraphParams[id];

      if (id === 'output') {
        throw new Error(`'output' is not a valid id`);
      }
      if (isNil(virtualAudioNodeParam.output)) {
        throw new Error(`ouptput not specified for node id ${id}`);
      }

      if (virtualAudioNode) {
        const params = virtualAudioNode.params || {};
        const {startTime, stopTime} = params;
        const virtualAudioNodeParamParams = virtualAudioNodeParam.params || {};
        const paramStartTime = virtualAudioNodeParamParams.startTime;
        const paramStopTime = virtualAudioNodeParamParams.stopTime;
        if (paramStartTime !== startTime || paramStopTime !== stopTime) {
          disconnect(virtualAudioNode);
          delete this.virtualNodes[id];
        }
        updateAudioNodeAndVirtualAudioGraph.call(this, virtualAudioNode, virtualAudioNodeParam);
      } else {
        this.virtualNodes[id] = createVirtualAudioNode.call(this, virtualAudioNodeParam);
      }
    }, keys(virtualGraphParams));

    connectAudioNodes(this.virtualNodes,
                      virtualAudioNode => connect(virtualAudioNode,
                                                  this.output));

    return this;
  }
};
