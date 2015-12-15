import connectAudioNodes from '../connectAudioNodes';
import {asArray, mapObj, values} from '../tools';
import createVirtualAudioNode from '../createVirtualAudioNode';

const connect = function (...connectArgs) {
  values(this.virtualNodes)
    .filter(({output}) => asArray(output).indexOf('output') !== -1)
    .forEach(childVirtualNode =>
      childVirtualNode.connect(...connectArgs.filter(Boolean)));
  this.connected = true;
};

const disconnect = function () {
  values(this.virtualNodes)
    .filter(({output}) => asArray(output).indexOf('output') !== -1)
    .forEach(virtualNode => virtualNode.disconnect());
  this.connected = false;
};

const disconnectAndDestroy = function () {
  values(this.virtualNodes)
    .forEach(virtualNode => virtualNode.disconnectAndDestroy());
  this.connected = false;
};

const update = function (params = {}) {
  const audioGraphParamsFactoryValues = values(this.audioGraphParamsFactory(params));
  values(this.virtualNodes)
    .forEach((childVirtualNode, i) => childVirtualNode
      .update(audioGraphParamsFactoryValues[i][2]));
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
    disconnectAndDestroy,
    isCustomVirtualNode: true,
    node,
    output,
    params,
    update,
    virtualNodes,
  };
};

export default createCustomVirtualAudioNode;
