import connectAudioNodes from './connectAudioNodes';
import createVirtualAudioNode from './createVirtualAudioNode';

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
          this.virtualNodes[id].disconnect();
          delete this.virtualNodes[id];
        }
      });

      virtualGraphParamsKeys
        .forEach(key => {
          if (key === 'output') {
            throw new Error(`'output' is not a valid id`);
          }
          const virtualAudioNodeParams = virtualGraphParams[key];
          const [paramsNodeName, paramsOutput, paramsParams] = virtualAudioNodeParams;
          if (paramsOutput == null && paramsNodeName !== 'mediaStreamDestination') {
            throw new Error(`output not specified for node key ${key}`);
          }
          const virtualAudioNode = this.virtualNodes[key];
          if (virtualAudioNode == null) {
            this.virtualNodes[key] = createVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParams);
            return;
          }
          if (
            startTimePathParams(virtualAudioNodeParams) !==
              startTimePathStored(virtualAudioNode) ||
            stopTimePathParams(virtualAudioNodeParams) !==
              stopTimePathStored(virtualAudioNode) ||
            paramsNodeName !== virtualAudioNode.node
          ) {
            virtualAudioNode.disconnect();
            this.virtualNodes[key] = createVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParams);
            return;
          }
          if (!checkOutputsEqual(paramsOutput, virtualAudioNode.output)) {
            virtualAudioNode.disconnect(true);
            virtualAudioNode.output = paramsOutput;
          }

          virtualAudioNode.update(paramsParams);
        });

      connectAudioNodes(this.virtualNodes,
                        virtualNode => virtualNode.connect(output));

      return this;
    },
  };
};
