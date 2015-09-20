import capitalize from 'capitalize';
import connect from './helpers/connect';
import connectAudioNodes from './helpers/connectAudioNodes';
import createVirtualAudioNode from './helpers/createVirtualAudioNode';
import updateAudioNodeAndVirtualAudioGraph from './helpers/updateAudioNodeAndVirtualAudioGraph';
import disconnect from './helpers/disconnect';

const startTimePath = params => params[2] && params[2].startTime;
const stopTimePath = params => params[2] && params[2].stopTime;

export default class VirtualAudioGraph {
  constructor ({audioContext = new AudioContext(),
                output = audioContext.destination} = {}) {
    this.audioContext = audioContext;
    this.output = output;
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

  getAudioNodeById (id) {
    return this.virtualNodes[id].audioNode;
  }

  update (virtualGraphParams) {
    const virtualGraphParamsKeys = Object.keys(virtualGraphParams);

    Object.keys(this.virtualNodes).forEach(id => {
      if (virtualGraphParamsKeys.indexOf(id) === -1) {
        disconnect(this.virtualNodes[id]);
        delete this.virtualNodes[id];
      }
    });

    virtualGraphParamsKeys
      .forEach(key => {
        if (key === 'output') {
          throw new Error(`'output' is not a valid id`);
        }
        const virtualAudioNodeParams = virtualGraphParams[key];
        const [node, output] = virtualAudioNodeParams;
        if (output == null && node !== 'mediaStreamDestination') {
          throw new Error(`output not specified for node key ${key}`);
        }
        const virtualAudioNode = this.virtualNodes[key];
        if (virtualAudioNode == null) {
          this.virtualNodes[key] = createVirtualAudioNode.call(this, virtualAudioNodeParams);
          return;
        }
        if (startTimePath(virtualAudioNodeParams) !== startTimePath(virtualAudioNode) ||
          stopTimePath(virtualAudioNodeParams) !== stopTimePath(virtualAudioNode)) {
          disconnect(virtualAudioNode);
          delete this.virtualNodes[key];
        }
        updateAudioNodeAndVirtualAudioGraph.call(this, virtualAudioNode, virtualAudioNodeParams, key);
      });

    connectAudioNodes(this.virtualNodes,
                      virtualNode => connect(virtualNode, this.output));

    return this;
  }
}
