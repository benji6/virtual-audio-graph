'use strict';

var capitalize = function (a) { return a.charAt(0).toUpperCase() + a.substring(1); };
var equals = function (a, b) {
  if (a === b) { return true }
  var typeA = typeof a;
  if (typeA !== typeof b || typeA !== 'object') { return false }
  if (Array.isArray(a)) {
    if (a.length !== b.length) { return false }
    for (var i = 0; i < a.length; i++) { if (!equals(a[i], b[i])) { return false } }
    return true
  }
  var keysA = Object.keys(a);
  var keysB = Object.keys(b);
  if (keysA.length !== keysB.length) { return false }
  for (var i$1 = 0; i$1 < keysA.length; i$1++) {
    var key = keysA[i$1];
    if (!equals(a[key], b[key])) { return false }
  }
  return true
};
var forEach = function (f, xs) { for (var i = 0; i < xs.length; i++) { f(xs[i]); } };
var filter = function (f, xs) {
  var ys = [];
  for (var i = 0; i < xs.length; i++) { f(xs[i]) && ys.push(xs[i]); }
  return ys
};
var find = function (f, xs) { for (var i = 0; i < xs.length; i++) { if (f(xs[i])) { return xs[i] } } };
var mapObj = function (f, o) {
  var p = {};
  for (var key in o) { if (Object.prototype.hasOwnProperty.call(o, key)) { p[key] = f(o[key]); } }
  return p
};
var values = function (obj) {
  var keys = Object.keys(obj);
  var ret = [];
  for (var i = 0; i < keys.length; i++) { ret[i] = obj[keys[i]]; }
  return ret
};

var connectAudioNodes = function (virtualGraph, handleConnectionToOutput) {
    if ( handleConnectionToOutput === void 0 ) handleConnectionToOutput = function () {};

    return forEach(function (id) {
    var virtualNode = virtualGraph[id];
    var output = virtualNode.output;
    if (virtualNode.connected || output == null) { return }
    forEach(function (output) {
      if (output === 'output') { return handleConnectionToOutput(virtualNode) }

      if (Object.prototype.toString.call(output) === '[object Object]') {
        var key = output.key;
        var destination = output.destination;
        var inputs = output.inputs;
        var outputs = output.outputs;

        if (key == null) {
          throw new Error(("id: " + id + " - output object requires a key property"))
        }
        if (inputs) {
          if (inputs.length !== outputs.length) {
            throw new Error(("id: " + id + " - outputs and inputs arrays are not the same length"))
          }
          return forEach(
            function (input, i) { return virtualNode.connect(virtualGraph[key].audioNode, outputs[i], input); },
            inputs
          )
        }
        return virtualNode.connect(virtualGraph[key].audioNode[destination])
      }

      var destinationVirtualAudioNode = virtualGraph[output];

      if (destinationVirtualAudioNode.isCustomVirtualNode) {
        return forEach(
          function (node) { return node.input === 'input' && virtualNode.connect(node.audioNode); },
          values(destinationVirtualAudioNode.virtualNodes)
        )
      }

      virtualNode.connect(destinationVirtualAudioNode.audioNode);
    }, Array.isArray(output) ? output : [output]);
  }, Object.keys(virtualGraph));
};

var audioParamProperties = [
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
  'Q' ];

var constructorParamsKeys = [
  'maxDelayTime',
  'mediaElement',
  'mediaStream',
  'numberOfOutputs' ];

var setters = [
  'position',
  'orientation' ];

var startAndStopNodes = [
  'oscillator',
  'bufferSource' ];

var connect = function () {
  var connectArgs = [], len = arguments.length;
  while ( len-- ) connectArgs[ len ] = arguments[ len ];

  var ref = this;
  var audioNode = ref.audioNode;
  var filteredConnectArgs = filter(Boolean, connectArgs);
  audioNode.connect && audioNode.connect.apply(audioNode, filteredConnectArgs);
  this.connections = this.connections.concat(filteredConnectArgs);
  this.connected = true;
};

var createAudioNode = function (audioContext, name, constructorParam, ref) {
  var offsetTime = ref.offsetTime;
  var startTime = ref.startTime;
  var stopTime = ref.stopTime;

  offsetTime = offsetTime || 0;
  var audioNode = constructorParam
    ? audioContext[("create" + (capitalize(name)))](constructorParam)
    : audioContext[("create" + (capitalize(name)))]();
  if (startAndStopNodes.indexOf(name) !== -1) {
    if (startTime == null) { audioNode.start(audioContext.currentTime, offsetTime); } else { audioNode.start(startTime, offsetTime); }
    if (stopTime != null) { audioNode.stop(stopTime); }
  }
  return audioNode
};

var disconnect = function (node) {
  var this$1 = this;

  var ref = this;
  var audioNode = ref.audioNode;
  if (node) {
    if (node.isCustomVirtualNode) {
      forEach(function (key) {
        var childNode = node.virtualNodes[key];
        if (!this$1.connections.some(function (x) { return x === childNode.audioNode; })) { return }
        this$1.connections = filter(
          function (x) { return x !== childNode.audioNode; },
          this$1.connections
        );
      }, Object.keys(node.virtualNodes));
    } else {
      if (!this.connections.some(function (x) { return x === node.audioNode; })) { return }
      this.connections = filter(function (x) { return x !== node.audioNode; }, this.connections);
    }
  }
  audioNode.disconnect && audioNode.disconnect();
  this.connected = false;
};

var disconnectAndDestroy = function () {
  var ref = this;
  var audioNode = ref.audioNode;
  var stopCalled = ref.stopCalled;
  if (audioNode.stop && !stopCalled) { audioNode.stop(); }
  audioNode.disconnect && audioNode.disconnect();
  this.connected = false;
};

var update = function (params) {
  var this$1 = this;
  if ( params === void 0 ) params = {};

  forEach(function (key) {
    if (constructorParamsKeys.indexOf(key) !== -1) { return }
    var param = params[key];
    if (this$1.params && this$1.params[key] === param) { return }
    if (audioParamProperties.indexOf(key) !== -1) {
      if (Array.isArray(param)) {
        if (this$1.params && !equals(param, this$1.params[key], {strict: true})) {
          this$1.audioNode[key].cancelScheduledValues(0);
        }
        var callMethod = function (ref) {
          var methodName = ref[0];
          var args = ref.slice(1);

          return (ref$1 = this$1.audioNode[key])[methodName].apply(ref$1, args)
          var ref$1;;
        };
        Array.isArray(param[0]) ? forEach(callMethod, param) : callMethod(param);
        return
      }
      this$1.audioNode[key].value = param;
      return
    }
    if (setters.indexOf(key) !== -1) {
      (ref = this$1.audioNode)[("set" + (capitalize(key)))].apply(ref, param);
      return
    }
    this$1.audioNode[key] = param;
    var ref;
  }, Object.keys(params));
  this.params = params;
  return this
};

var createStandardVirtualAudioNode = function (audioContext, ref) {
  var node = ref[0];
  var output = ref[1];
  var params = ref[2];
  var input = ref[3];

  var paramsObj = params || {};
  var offsetTime = paramsObj.offsetTime;
  var startTime = paramsObj.startTime;
  var stopTime = paramsObj.stopTime;
  var constructorParam = paramsObj[find(function (key) { return constructorParamsKeys.indexOf(key) !== -1; }, Object.keys(paramsObj))];
  var virtualNode = {
    audioNode: createAudioNode(audioContext, node, constructorParam, {offsetTime: offsetTime, startTime: startTime, stopTime: stopTime}),
    connect: connect,
    connected: false,
    connections: [],
    disconnect: disconnect,
    disconnectAndDestroy: disconnectAndDestroy,
    input: input,
    isCustomVirtualNode: false,
    node: node,
    output: output,
    stopCalled: stopTime !== undefined,
    update: update,
  };
  return virtualNode.update(paramsObj)
};

var connect$1 = function () {
  var connectArgs = [], len = arguments.length;
  while ( len-- ) connectArgs[ len ] = arguments[ len ];

  forEach(
    function (childVirtualNode) {
      var output = childVirtualNode.output;
      if (
        output === 'output' ||
        Array.isArray(output) && output.indexOf('output') !== -1
      ) { childVirtualNode.connect.apply(childVirtualNode, filter(Boolean, connectArgs)); }
    },
    values(this.virtualNodes)
  );
  this.connected = true;
};

var disconnect$1 = function () {
  var this$1 = this;

  var keys = Object.keys(this.virtualNodes);
  for (var i = 0; i < keys.length; i++) {
    var virtualNode = this$1.virtualNodes[keys[i]];
    var output = virtualNode.output;
    if (
      output === 'output' ||
      Array.isArray(output) && output.indexOf('output') !== -1
    ) { virtualNode.disconnect(); }
  }
  this.connected = false;
};

var disconnectAndDestroy$1 = function () {
  var this$1 = this;

  var keys = Object.keys(this.virtualNodes);
  for (var i = 0; i < keys.length; i++) { this$1.virtualNodes[keys[i]].disconnectAndDestroy(); }
  this.connected = false;
};

var update$1 = function (params) {
  var this$1 = this;
  if ( params === void 0 ) params = {};

  var audioGraphParamsFactoryValues = values(this.node(params));
  var keys = Object.keys(this.virtualNodes);
  for (var i = 0; i < keys.length; i++) {
    this$1.virtualNodes[keys[i]].update(audioGraphParamsFactoryValues[i][2]);
  }
  this.params = params;
  return this
};

var createCustomVirtualAudioNode = function (audioContext, ref) {
  var node = ref[0];
  var output = ref[1];
  var params = ref[2];

  var virtualNodes = mapObj(
    function (virtualAudioNodeParam) { return createVirtualAudioNode(audioContext, virtualAudioNodeParam); },
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
    virtualNodes: virtualNodes,
  }
};

var createVirtualAudioNode = function (audioContext, virtualAudioNodeParam) { return typeof virtualAudioNodeParam[0] === 'function'
  ? createCustomVirtualAudioNode(audioContext, virtualAudioNodeParam)
  : createStandardVirtualAudioNode(audioContext, virtualAudioNodeParam); };

/* global AudioContext */
var disconnectParents = function (virtualNode, virtualNodes) { return forEach(
  function (key) { return virtualNodes[key].disconnect(virtualNode); },
  Object.keys(virtualNodes)
); };

var index = function (ref) {
  if ( ref === void 0 ) ref = {};
  var audioContext = ref.audioContext; if ( audioContext === void 0 ) audioContext = new AudioContext();
  var output = ref.output; if ( output === void 0 ) output = audioContext.destination;

  return {
    audioContext: audioContext,
    get currentTime () { return audioContext.currentTime },
    getAudioNodeById: function getAudioNodeById (id) { return this.virtualNodes[id].audioNode },
    update: function update (newGraph) {
      var this$1 = this;

      forEach(function (id) {
        if (newGraph.hasOwnProperty(id)) { return }
        var virtualAudioNode = this$1.virtualNodes[id];
        virtualAudioNode.disconnectAndDestroy();
        disconnectParents(virtualAudioNode, this$1.virtualNodes);
        delete this$1.virtualNodes[id];
      }, Object.keys(this.virtualNodes));

      forEach(function (key) {
        if (key === 'output') { throw new Error('"output" is not a valid id') }
        var newNodeParams = newGraph[key];
        var paramsNodeName = newNodeParams[0];
        var paramsOutput = newNodeParams[1];
        var paramsParams = newNodeParams[2];
        if (paramsOutput == null && paramsNodeName !== 'mediaStreamDestination') {
          throw new Error(("output not specified for node key " + key))
        }
        var virtualAudioNode = this$1.virtualNodes[key];
        if (virtualAudioNode == null) {
          this$1.virtualNodes[key] = createVirtualAudioNode(audioContext, newNodeParams);
          return
        }
        if (
          (paramsParams && paramsParams.startTime) !==
            (virtualAudioNode.params && virtualAudioNode.params.startTime) ||
          (paramsParams && paramsParams.stopTime) !==
            (virtualAudioNode.params && virtualAudioNode.params.stopTime) ||
          paramsNodeName !== virtualAudioNode.node
        ) {
          virtualAudioNode.disconnectAndDestroy();
          disconnectParents(virtualAudioNode, this$1.virtualNodes);
          this$1.virtualNodes[key] = createVirtualAudioNode(audioContext, newNodeParams);
          return
        }
        if (!equals(paramsOutput, virtualAudioNode.output)) {
          virtualAudioNode.disconnect();
          disconnectParents(virtualAudioNode, this$1.virtualNodes);
          virtualAudioNode.output = paramsOutput;
        }

        virtualAudioNode.update(paramsParams);
      }, Object.keys(newGraph));

      connectAudioNodes(
        this.virtualNodes,
        function (virtualNode) { return virtualNode.connect(output); }
      );

      return this
    },
    virtualNodes: {},
  }
};

module.exports = index;

