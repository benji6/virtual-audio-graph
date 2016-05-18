'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _interopDefault(ex) {
  return ex && (typeof ex === 'undefined' ? 'undefined' : _typeof(ex)) === 'object' && 'default' in ex ? ex['default'] : ex;
}

var ramda = require('ramda');
var values = _interopDefault(require('ramda/src/values'));
var equals$1 = _interopDefault(require('ramda/src/equals'));
var map = _interopDefault(require('ramda/src/map'));

var asArray = function asArray(x) {
  return Array.isArray(x) ? x : [x];
};
var capitalize = function capitalize(a) {
  return a.charAt(0).toUpperCase() + a.substring(1);
};
var forEach = function forEach(f, xs) {
  for (var i = 0; i < xs.length; i++) {
    f(xs[i]);
  }
};
var forEachIndexed = function forEachIndexed(f, xs) {
  for (var i = 0; i < xs.length; i++) {
    f(xs[i], i);
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

var connectAudioNodes = function connectAudioNodes(virtualGraph) {
  var handleConnectionToOutput = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
  return forEach(function (id) {
    var virtualNode = virtualGraph[id];
    var output = virtualNode.output;

    if (virtualNode.connected || output == null) return;
    forEach(function (output) {
      if (output === 'output') return handleConnectionToOutput(virtualNode);

      if (Object.prototype.toString.call(output) === '[object Object]') {
        var _ret = function () {
          var key = output.key;
          var destination = output.destination;
          var inputs = output.inputs;
          var outputs = output.outputs;


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
          return virtualNode.connect(node.audioNode);
        }, filter(function (_ref) {
          var input = _ref.input;
          return input === 'input';
        }, values(destinationVirtualAudioNode.virtualNodes)));
      }

      virtualNode.connect(destinationVirtualAudioNode.audioNode);
    }, asArray(output));
  }, Object.keys(virtualGraph));
};

var audioParamProperties = ['attack', 'delayTime', 'detune', 'frequency', 'gain', 'knee', 'pan', 'playbackRate', 'ratio', 'reduction', 'release', 'threshold', 'Q'];

var constructorParamsKeys = ['maxDelayTime', 'mediaElement', 'mediaStream', 'numberOfOutputs'];

var setters = ['position', 'orientation'];

var startAndStopNodes = ['oscillator', 'bufferSource'];

var connect = function connect() {
  var audioNode = this.audioNode;

  for (var _len = arguments.length, connectArgs = Array(_len), _key = 0; _key < _len; _key++) {
    connectArgs[_key] = arguments[_key];
  }

  var filteredConnectArgs = filter(Boolean, connectArgs);
  audioNode.connect && audioNode.connect.apply(audioNode, _toConsumableArray(filteredConnectArgs));
  this.connections = this.connections.concat(filteredConnectArgs);
  this.connected = true;
};

var createAudioNode = function createAudioNode(audioContext, name, constructorParam, _ref2) {
  var startTime = _ref2.startTime;
  var stopTime = _ref2.stopTime;

  var audioNode = constructorParam ? audioContext['create' + capitalize(name)](constructorParam) : audioContext['create' + capitalize(name)]();
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
  if (audioNode.disconnect) audioNode.disconnect();
  this.connected = false;
};

var disconnectAndDestroy = function disconnectAndDestroy() {
  var audioNode = this.audioNode;
  var stopCalled = this.stopCalled;

  if (audioNode.stop && !stopCalled) audioNode.stop();
  audioNode.disconnect && audioNode.disconnect();
  this.connected = false;
};

var update = function update() {
  var _this2 = this;

  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  forEach(function (key) {
    if (constructorParamsKeys.indexOf(key) !== -1) return;
    var param = params[key];
    if (_this2.params && _this2.params[key] === param) return;
    if (audioParamProperties.indexOf(key) !== -1) {
      if (Array.isArray(param)) {
        if (_this2.params && !equals$1(param, _this2.params[key], { strict: true })) {
          _this2.audioNode[key].cancelScheduledValues(0);
        }
        var callMethod = function callMethod(_ref3) {
          var _audioNode$key;

          var _ref4 = _toArray(_ref3);

          var methodName = _ref4[0];

          var args = _ref4.slice(1);

          return (_audioNode$key = _this2.audioNode[key])[methodName].apply(_audioNode$key, _toConsumableArray(args));
        };
        Array.isArray(param[0]) ? forEach(callMethod, param) : callMethod(param);
        return;
      }
      _this2.audioNode[key].value = param;
      return;
    }
    if (setters.indexOf(key) !== -1) {
      var _audioNode;

      (_audioNode = _this2.audioNode)['set' + capitalize(key)].apply(_audioNode, _toConsumableArray(param));
      return;
    }
    _this2.audioNode[key] = param;
  }, Object.keys(params));
  this.params = params;
  return this;
};

var createStandardVirtualAudioNode = function createStandardVirtualAudioNode(audioContext, _ref5) {
  var _ref6 = _slicedToArray(_ref5, 4);

  var node = _ref6[0];
  var output = _ref6[1];
  var params = _ref6[2];
  var input = _ref6[3];

  params = params || {};
  var _params = params;
  var startTime = _params.startTime;
  var stopTime = _params.stopTime;

  var constructorParam = params[find(function (key) {
    return constructorParamsKeys.indexOf(key) !== -1;
  }, Object.keys(params))];
  var virtualNode = {
    audioNode: createAudioNode(audioContext, node, constructorParam, { startTime: startTime, stopTime: stopTime }),
    connect: connect,
    connected: false,
    connections: [],
    disconnect: disconnect,
    disconnectAndDestroy: disconnectAndDestroy,
    isCustomVirtualNode: false,
    input: input,
    node: node,
    output: output,
    stopCalled: stopTime !== undefined,
    update: update
  };
  return virtualNode.update(params);
};

var connect$1 = function connect$1() {
  for (var _len2 = arguments.length, connectArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    connectArgs[_key2] = arguments[_key2];
  }

  forEach(function (childVirtualNode) {
    return childVirtualNode.connect.apply(childVirtualNode, _toConsumableArray(filter(Boolean, connectArgs)));
  }, filter(function (_ref7) {
    var output = _ref7.output;
    return asArray(output).indexOf('output') !== -1;
  }, values(this.virtualNodes)));
  this.connected = true;
};

var disconnect$1 = function disconnect$1() {
  forEach(function (virtualNode) {
    return virtualNode.disconnect();
  }, filter(function (_ref8) {
    var output = _ref8.output;
    return asArray(output).indexOf('output') !== -1;
  }, values(this.virtualNodes)));
  this.connected = false;
};

var disconnectAndDestroy$1 = function disconnectAndDestroy$1() {
  forEach(function (virtualNode) {
    return virtualNode.disconnectAndDestroy();
  }, values(this.virtualNodes));
  this.connected = false;
};

var update$1 = function update$1() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var audioGraphParamsFactoryValues = values(this.audioGraphParamsFactory(params));
  forEachIndexed(function (childVirtualNode, i) {
    return childVirtualNode.update(audioGraphParamsFactoryValues[i][2]);
  }, values(this.virtualNodes));
  this.params = params;
  return this;
};

var createCustomVirtualAudioNode = function createCustomVirtualAudioNode(audioContext, _ref9) {
  var _ref10 = _slicedToArray(_ref9, 3);

  var audioGraphParamsFactory = _ref10[0];
  var output = _ref10[1];
  var params = _ref10[2];

  params = params || {};

  var virtualNodes = map(function (virtualAudioNodeParam) {
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
    params: params,
    update: update$1,
    virtualNodes: virtualNodes
  };
};

var createVirtualAudioNode = function createVirtualAudioNode(audioContext, virtualAudioNodeParam) {
  return typeof virtualAudioNodeParam[0] === 'function' ? createCustomVirtualAudioNode(audioContext, virtualAudioNodeParam) : createStandardVirtualAudioNode(audioContext, virtualAudioNodeParam);
};

var disconnectParents = function disconnectParents(virtualNode, virtualNodes) {
  return forEach(function (key) {
    return virtualNodes[key].disconnect(virtualNode);
  }, Object.keys(virtualNodes));
};

var index = function index() {
  var _ref11 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref11$audioContext = _ref11.audioContext;
  var audioContext = _ref11$audioContext === undefined ? new AudioContext() : _ref11$audioContext;
  var _ref11$output = _ref11.output;
  var output = _ref11$output === undefined ? audioContext.destination : _ref11$output;

  return {
    audioContext: audioContext,
    virtualNodes: {},
    get currentTime() {
      return audioContext.currentTime;
    },
    getAudioNodeById: function getAudioNodeById(id) {
      return this.virtualNodes[id].audioNode;
    },
    update: function update(newGraph) {
      var _this3 = this;

      forEach(function (id) {
        if (newGraph.hasOwnProperty(id)) return;
        var virtualAudioNode = _this3.virtualNodes[id];
        virtualAudioNode.disconnectAndDestroy();
        disconnectParents(virtualAudioNode, _this3.virtualNodes);
        delete _this3.virtualNodes[id];
      }, Object.keys(this.virtualNodes));

      forEach(function (key) {
        if (key === 'output') throw new Error('"output" is not a valid id');
        var newNodeParams = newGraph[key];

        var _newNodeParams = _slicedToArray(newNodeParams, 3);

        var paramsNodeName = _newNodeParams[0];
        var paramsOutput = _newNodeParams[1];
        var paramsParams = _newNodeParams[2];

        if (paramsOutput == null && paramsNodeName !== 'mediaStreamDestination') {
          throw new Error('output not specified for node key ' + key);
        }
        var virtualAudioNode = _this3.virtualNodes[key];
        if (virtualAudioNode == null) {
          _this3.virtualNodes[key] = createVirtualAudioNode(audioContext, newNodeParams);
          return;
        }
        if ((paramsParams && paramsParams.startTime) !== (virtualAudioNode.params && virtualAudioNode.params.startTime) || (paramsParams && paramsParams.stopTime) !== (virtualAudioNode.params && virtualAudioNode.params.stopTime) || paramsNodeName !== virtualAudioNode.node) {
          virtualAudioNode.disconnectAndDestroy();
          disconnectParents(virtualAudioNode, _this3.virtualNodes);
          _this3.virtualNodes[key] = createVirtualAudioNode(audioContext, newNodeParams);
          return;
        }
        if (!ramda.equals(paramsOutput, virtualAudioNode.output)) {
          virtualAudioNode.disconnect();
          disconnectParents(virtualAudioNode, _this3.virtualNodes);
          virtualAudioNode.output = paramsOutput;
        }

        virtualAudioNode.update(paramsParams);
      }, Object.keys(newGraph));

      connectAudioNodes(this.virtualNodes, function (virtualNode) {
        return virtualNode.connect(output);
      });

      return this;
    }
  };
};

module.exports = index;

