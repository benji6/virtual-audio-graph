import connect from './helpers/connect';
import connectAudioNodes from './helpers/connectAudioNodes';
import createVirtualAudioNode from './helpers/createVirtualAudioNode';
import disconnect from './helpers/disconnect';
import update from './helpers/update';

const startTimePathParams = params => params[2] && params[2].startTime;
const stopTimePathParams = params => params[2] && params[2].stopTime;
const startTimePathStored = virtualNode => virtualNode.params && virtualNode.params.startTime;
const stopTimePathStored = virtualNode => virtualNode.params && virtualNode.params.stopTime;
const checkOutputsEqual = (output0, output1) => {
  if (Array.isArray(output0)) {
    if (!Array.isArray(output1)) {
      return false;
    }
    return output0.every(x => output1.indexOf(x) !== -1);
  }
  return output0 === output1;
};

export default ({audioContext = new AudioContext(),
                 output = audioContext.destination} = {}) => {
  const customNodes = {};
  return {
    audioContext,
    virtualNodes: {},
    get currentTime () {
      return audioContext.currentTime;
    },
    defineNodes (customNodeParams) {
      Object.keys(customNodeParams)
        .forEach(name => customNodes[name] = customNodeParams[name]);
      return this;
    },
    getAudioNodeById (id) {
      return this.virtualNodes[id].audioNode;
    },
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
          const [node, output, params] = virtualAudioNodeParams;
          if (output == null && node !== 'mediaStreamDestination') {
            throw new Error(`output not specified for node key ${key}`);
          }
          const virtualAudioNode = this.virtualNodes[key];
          if (virtualAudioNode == null) {
            this.virtualNodes[key] = createVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParams);
            return;
          }
          if (startTimePathParams(virtualAudioNodeParams) !== startTimePathStored(virtualAudioNode) ||
            stopTimePathParams(virtualAudioNodeParams) !== stopTimePathStored(virtualAudioNode)) {
            disconnect(virtualAudioNode);
            delete this.virtualNodes[key];
            this.virtualNodes[key] = createVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParams);
            return;
          }
          if (node !== virtualAudioNode.node) {
            disconnect(virtualAudioNode);
            this.virtualNodes[key] = createVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParams);
            return;
          }
          if (!checkOutputsEqual(output, virtualAudioNode.output)) {
            disconnect(virtualAudioNode, true);
            virtualAudioNode.output = output;
          }

          update(virtualAudioNode, params);
        });

      connectAudioNodes(this.virtualNodes,
                        virtualNode => connect(virtualNode, output));

      return this;
    },
  };
};
