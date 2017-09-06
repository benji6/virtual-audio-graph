'use strict';

const capitalize = a => a.charAt(0).toUpperCase() + a.substring(1);
const equals = (a, b) => {
  if (a === b) return true
  const typeA = typeof a;
  if (typeA !== typeof b || typeA !== 'object') return false
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) if (!equals(a[i], b[i])) return false
    return true
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!equals(a[key], b[key])) return false
  }
  return true
};
const forEach = (f, xs) => { for (let i = 0; i < xs.length; i++) f(xs[i]); };
const filter = (f, xs) => {
  const ys = [];
  for (let i = 0; i < xs.length; i++) f(xs[i]) && ys.push(xs[i]);
  return ys
};
const find = (f, xs) => { for (let i = 0; i < xs.length; i++) if (f(xs[i])) return xs[i] };
const mapObj = (f, o) => {
  const p = {};
  for (const key in o) if (Object.prototype.hasOwnProperty.call(o, key)) p[key] = f(o[key]);
  return p
};
const values = obj => {
  const keys = Object.keys(obj);
  const ret = [];
  for (let i = 0; i < keys.length; i++) ret[i] = obj[keys[i]];
  return ret
};

var connectAudioNodes = (virtualGraph, handleConnectionToOutput = () => {}) =>
  forEach(id => {
    const virtualNode = virtualGraph[id];
    const {output} = virtualNode;
    if (virtualNode.connected || output == null) return
    forEach(output => {
      if (output === 'output') return handleConnectionToOutput(virtualNode)

      if (Object.prototype.toString.call(output) === '[object Object]') {
        const {key, destination, inputs, outputs} = output;

        if (key == null) {
          throw new Error(`id: ${id} - output object requires a key property`)
        }
        if (inputs) {
          if (inputs.length !== outputs.length) {
            throw new Error(`id: ${id} - outputs and inputs arrays are not the same length`)
          }
          return forEach(
            (input, i) => virtualNode.connect(virtualGraph[key].audioNode, outputs[i], input),
            inputs
          )
        }
        return virtualNode.connect(virtualGraph[key].audioNode[destination])
      }

      const destinationVirtualAudioNode = virtualGraph[output];

      if (destinationVirtualAudioNode.isCustomVirtualNode) {
        return forEach(
          node => node.input === 'input' && virtualNode.connect(node.audioNode),
          values(destinationVirtualAudioNode.virtualNodes)
        )
      }

      virtualNode.connect(destinationVirtualAudioNode.audioNode);
    }, Array.isArray(output) ? output : [output]);
  }, Object.keys(virtualGraph));

const audioParamProperties = [
  'attack',
  'delayTime',
  'detune',
  'frequency',
  'gain',
  'knee',
  'pan',
  'playbackRate',
  'ratio',
  'reduction',
  'release',
  'threshold',
  'Q',
];

const constructorParamsKeys = [
  'maxDelayTime',
  'mediaElement',
  'mediaStream',
  'numberOfOutputs',
];

const setters = [
  'position',
  'orientation',
];

const startAndStopNodes = [
  'oscillator',
  'bufferSource',
];

const connect = function (...connectArgs) {
  const {audioNode} = this;
  const filteredConnectArgs = filter(Boolean, connectArgs);
  audioNode.connect && audioNode.connect(...filteredConnectArgs);
  this.connections = this.connections.concat(filteredConnectArgs);
  this.connected = true;
};

const createAudioNode = (audioContext, name, constructorParam, {offsetTime, startTime, stopTime}) => {
  offsetTime = offsetTime || 0;
  const audioNode = constructorParam
    ? audioContext[`create${capitalize(name)}`](constructorParam)
    : audioContext[`create${capitalize(name)}`]();
  if (startAndStopNodes.indexOf(name) !== -1) {
    if (startTime == null) audioNode.start(audioContext.currentTime, offsetTime); else audioNode.start(startTime, offsetTime);
    if (stopTime != null) audioNode.stop(stopTime);
  }
  return audioNode
};

const disconnect = function (node) {
  const {audioNode} = this;
  if (node) {
    if (node.isCustomVirtualNode) {
      forEach(key => {
        const childNode = node.virtualNodes[key];
        if (!this.connections.some(x => x === childNode.audioNode)) return
        this.connections = filter(
          x => x !== childNode.audioNode,
          this.connections
        );
      }, Object.keys(node.virtualNodes));
    } else {
      if (!this.connections.some(x => x === node.audioNode)) return
      this.connections = filter(x => x !== node.audioNode, this.connections);
    }
  }
  audioNode.disconnect && audioNode.disconnect();
  this.connected = false;
};

const disconnectAndDestroy = function () {
  const {audioNode, stopCalled} = this;
  if (audioNode.stop && !stopCalled) audioNode.stop();
  audioNode.disconnect && audioNode.disconnect();
  this.connected = false;
};

const update = function (params = {}) {
  forEach(key => {
    if (constructorParamsKeys.indexOf(key) !== -1) return
    const param = params[key];
    if (this.params && this.params[key] === param) return
    if (audioParamProperties.indexOf(key) !== -1) {
      if (Array.isArray(param)) {
        if (this.params && !equals(param, this.params[key], {strict: true})) {
          this.audioNode[key].cancelScheduledValues(0);
        }
        const callMethod = ([methodName, ...args]) => this.audioNode[key][methodName](...args);
        Array.isArray(param[0]) ? forEach(callMethod, param) : callMethod(param);
        return
      }
      this.audioNode[key].value = param;
      return
    }
    if (setters.indexOf(key) !== -1) {
      this.audioNode[`set${capitalize(key)}`](...param);
      return
    }
    this.audioNode[key] = param;
  }, Object.keys(params));
  this.params = params;
  return this
};

var createStandardVirtualAudioNode = (audioContext, [node, output, params, input]) => {
  const paramsObj = params || {};
  const {offsetTime, startTime, stopTime} = paramsObj;
  const constructorParam = paramsObj[find(key => constructorParamsKeys.indexOf(key) !== -1, Object.keys(paramsObj))];
  const virtualNode = {
    audioNode: createAudioNode(audioContext, node, constructorParam, {offsetTime, startTime, stopTime}),
    connect,
    connected: false,
    connections: [],
    disconnect,
    disconnectAndDestroy,
    input,
    isCustomVirtualNode: false,
    node,
    output,
    stopCalled: stopTime !== undefined,
    update,
  };
  return virtualNode.update(paramsObj)
};

const connect$1 = function (...connectArgs) {
  forEach(
    childVirtualNode => {
      const {output} = childVirtualNode;
      if (
        output === 'output' ||
        Array.isArray(output) && output.indexOf('output') !== -1
      ) childVirtualNode.connect(...filter(Boolean, connectArgs));
    },
    values(this.virtualNodes)
  );
  this.connected = true;
};

const disconnect$1 = function () {
  const keys = Object.keys(this.virtualNodes);
  for (let i = 0; i < keys.length; i++) {
    const virtualNode = this.virtualNodes[keys[i]];
    const {output} = virtualNode;
    if (
      output === 'output' ||
      Array.isArray(output) && output.indexOf('output') !== -1
    ) virtualNode.disconnect();
  }
  this.connected = false;
};

const disconnectAndDestroy$1 = function () {
  const keys = Object.keys(this.virtualNodes);
  for (let i = 0; i < keys.length; i++) this.virtualNodes[keys[i]].disconnectAndDestroy();
  this.connected = false;
};

const update$1 = function (params = {}) {
  const audioGraphParamsFactoryValues = values(this.node(params));
  const keys = Object.keys(this.virtualNodes);
  for (let i = 0; i < keys.length; i++) {
    this.virtualNodes[keys[i]].update(audioGraphParamsFactoryValues[i][2]);
  }
  this.params = params;
  return this
};

const createCustomVirtualAudioNode = (audioContext, [node, output, params]) => {
  const virtualNodes = mapObj(
    virtualAudioNodeParam => createVirtualAudioNode(audioContext, virtualAudioNodeParam),
    node(params)
  );

  connectAudioNodes(virtualNodes);

  return {
    connect: connect$1,
    connected: false,
    disconnect: disconnect$1,
    disconnectAndDestroy: disconnectAndDestroy$1,
    isCustomVirtualNode: true,
    node: node,
    output: output,
    params: params || {},
    update: update$1,
    virtualNodes: virtualNodes
  };
};

var createVirtualAudioNode = (function (audioContext, virtualAudioNodeParam) {
  return typeof virtualAudioNodeParam[0] === 'function' ? createCustomVirtualAudioNode(audioContext, virtualAudioNodeParam) : createStandardVirtualAudioNode(audioContext, virtualAudioNodeParam);
});

/* global AudioContext */
var disconnectParents = function disconnectParents(virtualNode, virtualNodes) {
  return forEach(function (key) {
    return virtualNodes[key].disconnect(virtualNode);
  }, Object.keys(virtualNodes));
};

var index = (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$audioContext = _ref.audioContext,
      audioContext = _ref$audioContext === undefined ? new AudioContext() : _ref$audioContext,
      _ref$output = _ref.output,
      output = _ref$output === undefined ? audioContext.destination : _ref$output;

  return {
    audioContext: audioContext,
    get currentTime() {
      return audioContext.currentTime;
    },
    getAudioNodeById: function getAudioNodeById(id) {
      return this.virtualNodes[id].audioNode;
    },
    update: function update(newGraph) {
      var _this = this;

      forEach(function (id) {
        if (newGraph.hasOwnProperty(id)) return;
        var virtualAudioNode = _this.virtualNodes[id];
        virtualAudioNode.disconnectAndDestroy();
        disconnectParents(virtualAudioNode, _this.virtualNodes);
        delete _this.virtualNodes[id];
      }, Object.keys(this.virtualNodes));

      forEach(function (key) {
        if (key === 'output') throw new Error('"output" is not a valid id');
        var newNodeParams = newGraph[key];

        var _newNodeParams = slicedToArray(newNodeParams, 3),
            paramsNodeName = _newNodeParams[0],
            paramsOutput = _newNodeParams[1],
            paramsParams = _newNodeParams[2];

        if (paramsOutput == null && paramsNodeName !== 'mediaStreamDestination') {
          throw new Error('output not specified for node key ' + key);
        }
        var virtualAudioNode = _this.virtualNodes[key];
        if (virtualAudioNode == null) {
          _this.virtualNodes[key] = createVirtualAudioNode(audioContext, newNodeParams);
          return;
        }
        if ((paramsParams && paramsParams.startTime) !== (virtualAudioNode.params && virtualAudioNode.params.startTime) || (paramsParams && paramsParams.stopTime) !== (virtualAudioNode.params && virtualAudioNode.params.stopTime) || paramsNodeName !== virtualAudioNode.node) {
          virtualAudioNode.disconnectAndDestroy();
          disconnectParents(virtualAudioNode, _this.virtualNodes);
          _this.virtualNodes[key] = createVirtualAudioNode(audioContext, newNodeParams);
          return;
        }
        if (!equals(paramsOutput, virtualAudioNode.output)) {
          virtualAudioNode.disconnect();
          disconnectParents(virtualAudioNode, _this.virtualNodes);
          virtualAudioNode.output = paramsOutput;
        }

        virtualAudioNode.update(paramsParams);
      }, Object.keys(newGraph));

      connectAudioNodes(this.virtualNodes, function (virtualNode) {
        return virtualNode.connect(output);
      });

      return this;
    },

    virtualNodes: {}
  };
});

module.exports = index;
