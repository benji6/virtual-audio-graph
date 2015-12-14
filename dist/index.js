'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var asArray = function asArray(x) {
  return Array.isArray(x) ? x : [x];
};
var mapObj = function mapObj(fn, obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    return acc[key] = fn(obj[key]), acc;
  }, {});
};
var values = function values(obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
};
var capitalize = function capitalize(a) {
  return a.charAt(0).toUpperCase() + a.substring(1);
};

var connectAudioNodes = function connectAudioNodes(virtualGraph) {
  var handleConnectionToOutput = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
  return Object.keys(virtualGraph).forEach(function (id) {
    var virtualNode = virtualGraph[id];
    var output = virtualNode.output;

    if (virtualNode.connected || output == null) {
      return;
    }
    asArray(output).forEach(function (output) {
      if (output === 'output') {
        return handleConnectionToOutput(virtualNode);
      }

      if (Object.prototype.toString.call(output) === '[object Object]') {
        var _ret = (function () {
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
              v: inputs.forEach(function (input, i) {
                return virtualNode.connect(virtualGraph[key].audioNode, outputs[i], input);
              })
            };
          }
          return {
            v: virtualNode.connect(virtualGraph[key].audioNode[destination])
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }

      var destinationVirtualAudioNode = virtualGraph[output];

      if (destinationVirtualAudioNode.isCustomVirtualNode) {
        return values(destinationVirtualAudioNode.virtualNodes).filter(function (_ref) {
          var input = _ref.input;
          return input === 'input';
        }).forEach(function (node) {
          return virtualNode.connect(node.audioNode);
        });
      }

      virtualNode.connect(destinationVirtualAudioNode.audioNode);
    });
  });
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

  audioNode.connect && audioNode.connect.apply(audioNode, _toConsumableArray(connectArgs.filter(Boolean)));
  this.connected = true;
};

var createAudioNode = function createAudioNode(audioContext, name, constructorParam, _ref2) {
  var startTime = _ref2.startTime;
  var stopTime = _ref2.stopTime;

  var audioNode = constructorParam ? audioContext['create' + capitalize(name)](constructorParam) : audioContext['create' + capitalize(name)]();
  if (startAndStopNodes.indexOf(name) !== -1) {
    if (startTime == null) {
      audioNode.start();
    } else {
      audioNode.start(startTime);
    }
    if (stopTime != null) {
      audioNode.stop(stopTime);
    }
  }
  return audioNode;
};

var disconnect = function disconnect(doNotStop) {
  var audioNode = this.audioNode;
  var stopCalled = this.stopCalled;

  if (audioNode.stop && !stopCalled && !doNotStop) {
    audioNode.stop();
  }
  audioNode.disconnect && audioNode.disconnect();
  this.connected = false;
};

var update = function update() {
  var _this = this;

  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  Object.keys(params).forEach(function (key) {
    if (constructorParamsKeys.indexOf(key) !== -1) {
      return;
    }
    var param = params[key];
    if (_this.params && _this.params[key] === param) {
      return;
    }
    if (audioParamProperties.indexOf(key) !== -1) {
      if (Array.isArray(param)) {
        if (_this.params && !(0, _deepEqual2['default'])(param, _this.params[key], { strict: true })) {
          _this.audioNode[key].cancelScheduledValues(0);
        }
        var callMethod = function callMethod(_ref3) {
          var _audioNode$key;

          var _ref32 = _toArray(_ref3);

          var methodName = _ref32[0];

          var args = _ref32.slice(1);

          return (_audioNode$key = _this.audioNode[key])[methodName].apply(_audioNode$key, _toConsumableArray(args));
        };
        Array.isArray(param[0]) ? param.forEach(callMethod) : callMethod(param);
        return;
      }
      _this.audioNode[key].value = param;
      return;
    }
    if (setters.indexOf(key) !== -1) {
      var _audioNode;

      (_audioNode = _this.audioNode)['set' + capitalize(key)].apply(_audioNode, _toConsumableArray(param));
      return;
    }
    _this.audioNode[key] = param;
  });
  this.params = params;
  return this;
};

var createStandardVirtualAudioNode = function createStandardVirtualAudioNode(audioContext, _ref4) {
  var _ref42 = _slicedToArray(_ref4, 4);

  var node = _ref42[0];
  var output = _ref42[1];
  var params = _ref42[2];
  var input = _ref42[3];

  params = params || {};
  var _params = params;
  var startTime = _params.startTime;
  var stopTime = _params.stopTime;

  var constructorParam = params[Object.keys(params).filter(function (key) {
    return constructorParamsKeys.indexOf(key) !== -1;
  })[0]];
  var virtualNode = {
    audioNode: createAudioNode(audioContext, node, constructorParam, { startTime: startTime, stopTime: stopTime }),
    connect: connect,
    connected: false,
    disconnect: disconnect,
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

  mapObj(function (childVirtualNode) {
    if (asArray(childVirtualNode.output).indexOf('output') !== -1) {
      childVirtualNode.connect.apply(childVirtualNode, _toConsumableArray(connectArgs.filter(Boolean)));
    }
  }, this.virtualNodes);
  this.connected = true;
};

var disconnect$1 = function disconnect$1(doNotStop) {
  values(this.virtualNodes).forEach(function (virtualNode) {
    return virtualNode.disconnect(doNotStop);
  });
  this.connected = false;
};

var update$1 = function update$1() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var audioGraphParamsFactoryValues = values(this.audioGraphParamsFactory(params));
  values(this.virtualNodes).forEach(function (childVirtualNode, i) {
    return childVirtualNode.update(audioGraphParamsFactoryValues[i][2]);
  });
  this.params = params;
  return this;
};

var createCustomVirtualAudioNode = function createCustomVirtualAudioNode(audioContext, customNodes, _ref5) {
  var _ref52 = _slicedToArray(_ref5, 3);

  var node = _ref52[0];
  var output = _ref52[1];
  var params = _ref52[2];

  params = params || {};
  var audioGraphParamsFactory = customNodes[node];
  var virtualNodes = mapObj(function (virtualAudioNodeParam) {
    return createVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParam);
  }, audioGraphParamsFactory(params));

  connectAudioNodes(virtualNodes);

  return {
    audioGraphParamsFactory: audioGraphParamsFactory,
    connect: connect$1,
    connected: false,
    disconnect: disconnect$1,
    isCustomVirtualNode: true,
    node: node,
    output: output,
    params: params,
    update: update$1,
    virtualNodes: virtualNodes
  };
};

var createVirtualAudioNode = function createVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParam) {
  return customNodes[virtualAudioNodeParam[0]] ? createCustomVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParam) : createStandardVirtualAudioNode(audioContext, virtualAudioNodeParam);
};

var startTimePathParams = function startTimePathParams(params) {
  return params[2] && params[2].startTime;
};
var stopTimePathParams = function stopTimePathParams(params) {
  return params[2] && params[2].stopTime;
};
var startTimePathStored = function startTimePathStored(virtualNode) {
  return virtualNode.params && virtualNode.params.startTime;
};
var stopTimePathStored = function stopTimePathStored(virtualNode) {
  return virtualNode.params && virtualNode.params.stopTime;
};
var checkOutputsEqual = function checkOutputsEqual(output0, output1) {
  if (Array.isArray(output0)) {
    if (!Array.isArray(output1)) {
      return false;
    }
    return output0.every(function (x) {
      return output1.indexOf(x) !== -1;
    });
  }
  return output0 === output1;
};

var index = function index() {
  var _ref6 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref6$audioContext = _ref6.audioContext;
  var audioContext = _ref6$audioContext === undefined ? new AudioContext() : _ref6$audioContext;
  var _ref6$output = _ref6.output;
  var output = _ref6$output === undefined ? audioContext.destination : _ref6$output;

  var customNodes = {};
  return Object.defineProperties({
    audioContext: audioContext,
    virtualNodes: {},

    defineNodes: function defineNodes(customNodeParams) {
      Object.keys(customNodeParams).forEach(function (name) {
        return customNodes[name] = customNodeParams[name];
      });
      return this;
    },
    getAudioNodeById: function getAudioNodeById(id) {
      return this.virtualNodes[id].audioNode;
    },
    update: function update(virtualGraphParams) {
      var _this2 = this;

      var virtualGraphParamsKeys = Object.keys(virtualGraphParams);

      Object.keys(this.virtualNodes).forEach(function (id) {
        if (virtualGraphParamsKeys.indexOf(id) === -1) {
          _this2.virtualNodes[id].disconnect();
          delete _this2.virtualNodes[id];
        }
      });

      virtualGraphParamsKeys.forEach(function (key) {
        if (key === 'output') {
          throw new Error('\'output\' is not a valid id');
        }
        var virtualAudioNodeParams = virtualGraphParams[key];

        var _virtualAudioNodeParams = _slicedToArray(virtualAudioNodeParams, 3);

        var paramsNodeName = _virtualAudioNodeParams[0];
        var paramsOutput = _virtualAudioNodeParams[1];
        var paramsParams = _virtualAudioNodeParams[2];

        if (paramsOutput == null && paramsNodeName !== 'mediaStreamDestination') {
          throw new Error('output not specified for node key ' + key);
        }
        var virtualAudioNode = _this2.virtualNodes[key];
        if (virtualAudioNode == null) {
          _this2.virtualNodes[key] = createVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParams);
          return;
        }
        if (startTimePathParams(virtualAudioNodeParams) !== startTimePathStored(virtualAudioNode) || stopTimePathParams(virtualAudioNodeParams) !== stopTimePathStored(virtualAudioNode) || paramsNodeName !== virtualAudioNode.node) {
          virtualAudioNode.disconnect();
          _this2.virtualNodes[key] = createVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParams);
          return;
        }
        if (!checkOutputsEqual(paramsOutput, virtualAudioNode.output)) {
          virtualAudioNode.disconnect(true);
          virtualAudioNode.output = paramsOutput;
        }

        virtualAudioNode.update(paramsParams);
      });

      connectAudioNodes(this.virtualNodes, function (virtualNode) {
        return virtualNode.connect(output);
      });

      return this;
    }
  }, {
    currentTime: {
      get: function get() {
        return audioContext.currentTime;
      },
      configurable: true,
      enumerable: true
    }
  });
};

exports['default'] = index;
module.exports = exports['default'];
