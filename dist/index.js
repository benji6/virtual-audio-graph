'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





















































var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var capitalize = function capitalize(a) {
  return a.charAt(0).toUpperCase() + a.substring(1);
};
var equals = function equals(a, b) {
  if (a === b) return true;
  var typeA = typeof a === 'undefined' ? 'undefined' : _typeof(a);
  if (typeA !== (typeof b === 'undefined' ? 'undefined' : _typeof(b)) || typeA !== 'object') return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!equals(a[i], b[i])) return false;
    }return true;
  }
  var keysA = Object.keys(a);
  var keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (var _i = 0; _i < keysA.length; _i++) {
    var key = keysA[_i];
    if (!equals(a[key], b[key])) return false;
  }
  return true;
};
var forEach = function forEach(f, xs) {
  for (var i = 0; i < xs.length; i++) {
    f(xs[i]);
  }
};
var filter = function filter(f, xs) {
  var ys = [];
  for (var i = 0; i < xs.length; i++) {
    f(xs[i]) && ys.push(xs[i]);
  }return ys;
};
var find = function find(f, xs) {
  for (var i = 0; i < xs.length; i++) {
    if (f(xs[i])) return xs[i];
  }
};
var mapObj = function mapObj(f, o) {
  var p = {};
  for (var key in o) {
    if (Object.prototype.hasOwnProperty.call(o, key)) p[key] = f(o[key]);
  }return p;
};
var values = function values(obj) {
  var keys = Object.keys(obj);
  var ret = [];
  for (var i = 0; i < keys.length; i++) {
    ret[i] = obj[keys[i]];
  }return ret;
};

var connectAudioNodes = (function (virtualGraph) {
  var handleConnectionToOutput = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  return forEach(function (id) {
    var virtualNode = virtualGraph[id];
    var output = virtualNode.output;

    if (virtualNode.connected || output == null) return;
    forEach(function (output) {
      if (output === 'output') return handleConnectionToOutput(virtualNode);

      if (Object.prototype.toString.call(output) === '[object Object]') {
        var _ret = function () {
          var key = output.key,
              destination = output.destination,
              inputs = output.inputs,
              outputs = output.outputs;


          if (key == null) {
            throw new Error('id: ' + id + ' - output object requires a key property');
          }
          if (inputs) {
            if (inputs.length !== outputs.length) {
              throw new Error('id: ' + id + ' - outputs and inputs arrays are not the same length');
            }
            return {
              v: forEach(function (input, i) {
                return virtualNode.connect(virtualGraph[key].audioNode, outputs[i], input);
              }, inputs)
            };
          }
          return {
            v: virtualNode.connect(virtualGraph[key].audioNode[destination])
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }

      var destinationVirtualAudioNode = virtualGraph[output];

      if (destinationVirtualAudioNode.isCustomVirtualNode) {
        return forEach(function (node) {
          return node.input === 'input' && virtualNode.connect(node.audioNode);
        }, values(destinationVirtualAudioNode.virtualNodes));
      }

      virtualNode.connect(destinationVirtualAudioNode.audioNode);
    }, Array.isArray(output) ? output : [output]);
  }, Object.keys(virtualGraph));
});

var audioParamProperties = ['attack', 'delayTime', 'detune', 'frequency', 'gain', 'knee', 'pan', 'playbackRate', 'ratio', 'reduction', 'release', 'threshold', 'Q'];

var constructorParamsKeys = ['maxDelayTime', 'mediaElement', 'mediaStream', 'numberOfOutputs'];

var setters = ['position', 'orientation'];

var startAndStopNodes = ['createOscillator', 'createBufferSource'];

var connect = function connect() {
  var audioNode = this.audioNode;

  for (var _len = arguments.length, connectArgs = Array(_len), _key = 0; _key < _len; _key++) {
    connectArgs[_key] = arguments[_key];
  }

  var filteredConnectArgs = filter(Boolean, connectArgs);
  audioNode.connect && audioNode.connect.apply(audioNode, toConsumableArray(filteredConnectArgs));
  this.connections = this.connections.concat(filteredConnectArgs);
  this.connected = true;
};

var createAudioNode = function createAudioNode(audioContext, name, constructorParam, _ref) {
  var startTime = _ref.startTime,
      stopTime = _ref.stopTime;

  var audioNode = constructorParam ? audioContext[name](constructorParam) : audioContext[name]();
  if (startAndStopNodes.indexOf(name) !== -1) {
    if (startTime == null) audioNode.start();else audioNode.start(startTime);
    if (stopTime != null) audioNode.stop(stopTime);
  }
  return audioNode;
};

var disconnect = function disconnect(node) {
  var _this = this;

  var audioNode = this.audioNode;

  if (node) {
    if (node.isCustomVirtualNode) {
      forEach(function (key) {
        var childNode = node.virtualNodes[key];
        if (!_this.connections.some(function (x) {
          return x === childNode.audioNode;
        })) return;
        _this.connections = filter(function (x) {
          return x !== childNode.audioNode;
        }, _this.connections);
      }, Object.keys(node.virtualNodes));
    } else {
      if (!this.connections.some(function (x) {
        return x === node.audioNode;
      })) return;
      this.connections = filter(function (x) {
        return x !== node.audioNode;
      }, this.connections);
    }
  }
  audioNode.disconnect && audioNode.disconnect();
  this.connected = false;
};

var disconnectAndDestroy = function disconnectAndDestroy() {
  var audioNode = this.audioNode,
      stopCalled = this.stopCalled;

  if (audioNode.stop && !stopCalled) audioNode.stop();
  audioNode.disconnect && audioNode.disconnect();
  this.connected = false;
};

var update = function update() {
  var _this2 = this;

  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  forEach(function (key) {
    if (constructorParamsKeys.indexOf(key) !== -1) return;
    var param = params[key];
    if (_this2.params && _this2.params[key] === param) return;
    if (audioParamProperties.indexOf(key) !== -1) {
      if (Array.isArray(param)) {
        if (_this2.params && !equals(param, _this2.params[key], { strict: true })) {
          _this2.audioNode[key].cancelScheduledValues(0);
        }
        var callMethod = function callMethod(_ref2) {
          var _audioNode$key;

          var _ref3 = toArray(_ref2),
              methodName = _ref3[0],
              args = _ref3.slice(1);

          return (_audioNode$key = _this2.audioNode[key])[methodName].apply(_audioNode$key, toConsumableArray(args));
        };
        Array.isArray(param[0]) ? forEach(callMethod, param) : callMethod(param);
        return;
      }
      _this2.audioNode[key].value = param;
      return;
    }
    if (setters.indexOf(key) !== -1) {
      var _audioNode;

      (_audioNode = _this2.audioNode)['set' + capitalize(key)].apply(_audioNode, toConsumableArray(param));
      return;
    }
    _this2.audioNode[key] = param;
  }, Object.keys(params));
  this.params = params;
  return this;
};

var createStandardVirtualAudioNode = (function (audioContext, _ref4) {
  var node = _ref4.node,
      output = _ref4.output,
      params = _ref4.params,
      input = _ref4.input;

  var paramsObj = params || {};
  var startTime = paramsObj.startTime,
      stopTime = paramsObj.stopTime;

  var constructorParam = paramsObj[find(function (key) {
    return constructorParamsKeys.indexOf(key) !== -1;
  }, Object.keys(paramsObj))];
  var virtualNode = {
    audioNode: createAudioNode(audioContext, node, constructorParam, { startTime: startTime, stopTime: stopTime }),
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
    update: update
  };
  return virtualNode.update(paramsObj);
});

var connect$1 = function connect() {
  for (var _len = arguments.length, connectArgs = Array(_len), _key = 0; _key < _len; _key++) {
    connectArgs[_key] = arguments[_key];
  }

  forEach(function (childVirtualNode) {
    var output = childVirtualNode.output;

    if (output === 'output' || Array.isArray(output) && output.indexOf('output') !== -1) childVirtualNode.connect.apply(childVirtualNode, toConsumableArray(filter(Boolean, connectArgs)));
  }, values(this.virtualNodes));
  this.connected = true;
};

var disconnect$1 = function disconnect() {
  var keys = Object.keys(this.virtualNodes);
  for (var i = 0; i < keys.length; i++) {
    var virtualNode = this.virtualNodes[keys[i]];
    var output = virtualNode.output;

    if (output === 'output' || Array.isArray(output) && output.indexOf('output') !== -1) virtualNode.disconnect();
  }
  this.connected = false;
};

var disconnectAndDestroy$1 = function disconnectAndDestroy() {
  var keys = Object.keys(this.virtualNodes);
  for (var i = 0; i < keys.length; i++) {
    this.virtualNodes[keys[i]].disconnectAndDestroy();
  }this.connected = false;
};

var update$1 = function update() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var audioGraphParamsFactoryValues = values(this.audioGraphParamsFactory(params));
  var keys = Object.keys(this.virtualNodes);
  for (var i = 0; i < keys.length; i++) {
    this.virtualNodes[keys[i]].update(audioGraphParamsFactoryValues[i][2]);
  }
  this.params = params;
  return this;
};

var createCustomVirtualAudioNode = function createCustomVirtualAudioNode(audioContext, _ref) {
  var audioGraphParamsFactory = _ref.audioGraphParamsFactory,
      output = _ref.output,
      params = _ref.params;

  var virtualNodes = mapObj(function (virtualAudioNodeParam) {
    return createVirtualAudioNode(audioContext, virtualAudioNodeParam);
  }, audioGraphParamsFactory(params));

  connectAudioNodes(virtualNodes);

  return {
    audioGraphParamsFactory: audioGraphParamsFactory,
    connect: connect$1,
    connected: false,
    disconnect: disconnect$1,
    disconnectAndDestroy: disconnectAndDestroy$1,
    isCustomVirtualNode: true,
    node: audioGraphParamsFactory,
    output: output,
    params: params || {},
    update: update$1,
    virtualNodes: virtualNodes
  };
};

var createVirtualAudioNode = (function (audioContext, virtualAudioNodeParam) {
  return virtualAudioNodeParam.isCustomVirtualNode === true ? createCustomVirtualAudioNode(audioContext, virtualAudioNodeParam) : createStandardVirtualAudioNode(audioContext, virtualAudioNodeParam);
});

/* global AudioContext */
var disconnectParents = function disconnectParents(virtualNode, virtualNodes) {
  return forEach(function (key) {
    return virtualNodes[key].disconnect(virtualNode);
  }, Object.keys(virtualNodes));
};

var createVirtualAudioGraph$1 = (function () {
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
        var node = newNodeParams.node,
            output = newNodeParams.output,
            params = newNodeParams.params;

        var virtualAudioNode = _this.virtualNodes[key];
        if (virtualAudioNode == null) {
          _this.virtualNodes[key] = createVirtualAudioNode(audioContext, newNodeParams);
          return;
        }
        if ((params && params.startTime) !== (virtualAudioNode.params && virtualAudioNode.params.startTime) || (params && params.stopTime) !== (virtualAudioNode.params && virtualAudioNode.params.stopTime) || node !== virtualAudioNode.node) {
          virtualAudioNode.disconnectAndDestroy();
          disconnectParents(virtualAudioNode, _this.virtualNodes);
          _this.virtualNodes[key] = createVirtualAudioNode(audioContext, newNodeParams);
          return;
        }
        if (!equals(output, virtualAudioNode.output)) {
          virtualAudioNode.disconnect();
          disconnectParents(virtualAudioNode, _this.virtualNodes);
          virtualAudioNode.output = output;
        }

        virtualAudioNode.update(params);
      }, Object.keys(newGraph));

      connectAudioNodes(this.virtualNodes, function (virtualNode) {
        return virtualNode.connect(output);
      });

      return this;
    },

    virtualNodes: {}
  };
});

var createStandardNode = function createStandardNode(node) {
  return function (output, params, input) {
    if (output == null && node !== 'createMediaStreamDestination') {
      throw new Error('output not specified for ' + node + ' node');
    }
    return {
      input: input,
      node: node,
      output: output,
      params: params
    };
  };
};

var analyser = createStandardNode('createAnalyser');
var biquadFilter = createStandardNode('createBiquadFilter');
var bufferSource = createStandardNode('createBufferSource');
var channelMerger = createStandardNode('createChannelMerger');
var channelSplitter = createStandardNode('createChannelSplitter');
var convolver = createStandardNode('createConvolver');
var delay = createStandardNode('createDelay');
var dynamicsCompressor = createStandardNode('createDynamicsCompressor');
var gain = createStandardNode('createGain');
var mediaElementSource = createStandardNode('createMediaElementSource');
var mediaStreamDestination = createStandardNode('createMediaStreamDestination');
var mediaStreamSource = createStandardNode('createMediaStreamSource');
var oscillator = createStandardNode('createOscillator');
var panner = createStandardNode('createPanner');
var stereoPanner = createStandardNode('createStereoPanner');
var waveShaper = createStandardNode('createWaveShaper');

var createNode = function createNode(audioGraphParamsFactory) {
  return function (output, params) {
    return {
      audioGraphParamsFactory: audioGraphParamsFactory,
      isCustomVirtualNode: true,
      output: output,
      params: params
    };
  };
};

exports.analyser = analyser;
exports.biquadFilter = biquadFilter;
exports.bufferSource = bufferSource;
exports.channelMerger = channelMerger;
exports.channelSplitter = channelSplitter;
exports.convolver = convolver;
exports.delay = delay;
exports.dynamicsCompressor = dynamicsCompressor;
exports.gain = gain;
exports.mediaElementSource = mediaElementSource;
exports.mediaStreamDestination = mediaStreamDestination;
exports.mediaStreamSource = mediaStreamSource;
exports.oscillator = oscillator;
exports.panner = panner;
exports.stereoPanner = stereoPanner;
exports.waveShaper = waveShaper;
exports.createNode = createNode;
exports['default'] = createVirtualAudioGraph$1;
