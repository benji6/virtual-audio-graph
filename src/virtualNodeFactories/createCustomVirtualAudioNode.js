import connectAudioNodes from '../connectAudioNodes';
import {asArray, mapObj, values} from '../tools';
import createVirtualAudioNode from '../createVirtualAudioNode';

const connect = function (...connectArgs) {
  mapObj(childVirtualNode => {
    if (asArray(childVirtualNode.output).indexOf('output') !== -1) {
      childVirtualNode.connect(...connectArgs.filter(Boolean));
    }
  }, this.virtualNodes);
  this.connected = true;
};

const disconnect = function (doNotStop) {
  values(this.virtualNodes)
    .forEach(virtualNode => virtualNode.disconnect(doNotStop));
  this.connected = false;
};

const update = function (params = {}) {
  const audioGraphParamsFactoryValues = values(this.audioGraphParamsFactory(params));
  values(this.virtualNodes)
    .forEach((childVirtualNode, i) => childVirtualNode.update(audioGraphParamsFactoryValues[i][2]));
  this.params = params;
  return this;
};

const createCustomVirtualAudioNode = (audioContext, customNodes, [node, output, params]) => {
  params = params || {};
  const audioGraphParamsFactory = customNodes[node];
  const virtualNodes = mapObj(virtualAudioNodeParam => createVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParam),
                              audioGraphParamsFactory(params));

  connectAudioNodes(virtualNodes);

  return {
    audioGraphParamsFactory,
    connect,
    connected: false,
    disconnect,
    isCustomVirtualNode: true,
    node,
    output,
    params,
    update,
    virtualNodes,
  };
};

export default createCustomVirtualAudioNode;
