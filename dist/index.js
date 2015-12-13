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

var connect = function connect(virtualNode) {
  for (var _len = arguments.length, connectArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    connectArgs[_key - 1] = arguments[_key];
  }

  if (virtualNode.isCustomVirtualNode) {
    mapObj(function (childVirtualNode) {
      if (asArray(childVirtualNode.output).indexOf('output') !== -1) {
        var audioNode = childVirtualNode.audioNode;

        audioNode.connect && audioNode.connect.apply(audioNode, _toConsumableArray(connectArgs.filter(Boolean)));
      }
    }, virtualNode.virtualNodes);
  } else {
    var audioNode = virtualNode.audioNode;

    audioNode.connect && audioNode.connect.apply(audioNode, _toConsumableArray(connectArgs.filter(Boolean)));
  }
  virtualNode.connected = true;
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
                return connect(virtualNode, virtualGraph[key].audioNode, outputs[i], input);
              })
            };
          }
          return {
            v: connect(virtualNode, virtualGraph[key].audioNode[destination])
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }

      var destinationVirtualAudioNode = virtualGraph[output];

      if (destinationVirtualAudioNode.isCustomVirtualNode) {
        return values(destinationVirtualAudioNode.virtualNodes).forEach(function (node) {
          if (node.input !== 'input') {
            return;
          }
          connect(virtualNode, node.audioNode);
        });
      }

      connect(virtualNode, destinationVirtualAudioNode.audioNode);
    });
  });
};

var startAndStopNodes = ['oscillator', 'bufferSource'];

var createAudioNode = function createAudioNode(audioContext, name, constructorParam, _ref) {
  var startTime = _ref.startTime;
  var stopTime = _ref.stopTime;

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

var constructorParamsKeys = ['maxDelayTime', 'mediaElement', 'mediaStream', 'numberOfOutputs'];

var audioParamProperties = ['attack', 'delayTime', 'detune', 'frequency', 'gain', 'knee', 'pan', 'playbackRate', 'ratio', 'reduction', 'release', 'threshold', 'Q'];

var setters = ['position', 'orientation'];

function _update(virtualNode) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (virtualNode.isCustomVirtualNode) {
    (function () {
      var audioGraphParamsFactoryValues = values(virtualNode.audioGraphParamsFactory(params));
      values(virtualNode.virtualNodes).forEach(function (childVirtualNode, i) {
        return _update(childVirtualNode, audioGraphParamsFactoryValues[i][2]);
      });
    })();
  } else {
    Object.keys(params).forEach(function (key) {
      if (constructorParamsKeys.indexOf(key) !== -1) {
        return;
      }
      var param = params[key];
      if (virtualNode.params && virtualNode.params[key] === param) {
        return;
      }
      if (audioParamProperties.indexOf(key) !== -1) {
        if (Array.isArray(param)) {
          if (virtualNode.params && !(0, _deepEqual2['default'])(param, virtualNode.params[key], { strict: true })) {
            virtualNode.audioNode[key].cancelScheduledValues(0);
          }
          var callMethod = function callMethod(_ref2) {
            var _virtualNode$audioNode$key;

            var _ref22 = _toArray(_ref2);

            var methodName = _ref22[0];

            var args = _ref22.slice(1);

            return (_virtualNode$audioNode$key = virtualNode.audioNode[key])[methodName].apply(_virtualNode$audioNode$key, _toConsumableArray(args));
          };
          Array.isArray(param[0]) ? param.forEach(callMethod) : callMethod(param);
          return;
        }
        virtualNode.audioNode[key].value = param;
        return;
      }
      if (setters.indexOf(key) !== -1) {
        var _virtualNode$audioNode;

        (_virtualNode$audioNode = virtualNode.audioNode)['set' + capitalize(key)].apply(_virtualNode$audioNode, _toConsumableArray(param));
        return;
      }
      virtualNode.audioNode[key] = param;
    });
  }
  virtualNode.params = params;
  return virtualNode;
}

var createStandardVirtualAudioNode = function createStandardVirtualAudioNode(audioContext, _ref3) {
  var _ref32 = _slicedToArray(_ref3, 4);

  var node = _ref32[0];
  var output = _ref32[1];
  var params = _ref32[2];
  var input = _ref32[3];

  params = params || {};
  var _params = params;
  var startTime = _params.startTime;
  var stopTime = _params.stopTime;

  var constructorParam = params[Object.keys(params).filter(function (key) {
    return constructorParamsKeys.indexOf(key) !== -1;
  })[0]];
  var virtualNode = {
    audioNode: createAudioNode(audioContext, node, constructorParam, { startTime: startTime, stopTime: stopTime }),
    connected: false,
    isCustomVirtualNode: false,
    input: input,
    node: node,
    output: output,
    stopCalled: stopTime !== undefined
  };
  return _update(virtualNode, params);
};

var createCustomVirtualAudioNode = function createCustomVirtualAudioNode(audioContext, customNodes, _ref4) {
  var _ref42 = _slicedToArray(_ref4, 3);

  var node = _ref42[0];
  var output = _ref42[1];
  var params = _ref42[2];

  params = params || {};
  var audioGraphParamsFactory = customNodes[node];
  var virtualNodes = mapObj(function (virtualAudioNodeParam) {
    return customNodes[virtualAudioNodeParam[0]] ? createCustomVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParam) : createStandardVirtualAudioNode(audioContext, virtualAudioNodeParam);
  }, audioGraphParamsFactory(params));

  connectAudioNodes(virtualNodes);

  return {
    audioGraphParamsFactory: audioGraphParamsFactory,
    connected: false,
    isCustomVirtualNode: true,
    node: node,
    output: output,
    params: params,
    virtualNodes: virtualNodes
  };
};

var createVirtualAudioNode = function createVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParam) {
  return customNodes[virtualAudioNodeParam[0]] ? createCustomVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParam) : createStandardVirtualAudioNode(audioContext, virtualAudioNodeParam);
};

function disconnect(virtualNode, doNotStop) {
  if (virtualNode.isCustomVirtualNode) {
    values(virtualNode.virtualNodes).forEach(disconnect);
  } else {
    var audioNode = virtualNode.audioNode;

    if (audioNode.stop && !virtualNode.stopCalled && !doNotStop) {
      audioNode.stop();
    }
    audioNode.disconnect && audioNode.disconnect();
  }
  virtualNode.connected = false;
}

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
  var _ref5 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref5$audioContext = _ref5.audioContext;
  var audioContext = _ref5$audioContext === undefined ? new AudioContext() : _ref5$audioContext;
  var _ref5$output = _ref5.output;
  var output = _ref5$output === undefined ? audioContext.destination : _ref5$output;

  var customNodes = {};
  return Object.defineProperties({
    audioContext: audioContext,
    virtualNodes: {},

    defineNodes: function defineNodes(customNodeParams) {
      Object.keys(customNodeParams).forEach(function (name) {
        if (audioContext['create' + capitalize(name)]) {
          throw new Error(name + ' is a standard audio node name and cannot be overwritten');
        }
        customNodes[name] = customNodeParams[name];
      });

      return this;
    },
    getAudioNodeById: function getAudioNodeById(id) {
      return this.virtualNodes[id].audioNode;
    },
    update: function update(virtualGraphParams) {
      var _this = this;

      var virtualGraphParamsKeys = Object.keys(virtualGraphParams);

      Object.keys(this.virtualNodes).forEach(function (id) {
        if (virtualGraphParamsKeys.indexOf(id) === -1) {
          disconnect(_this.virtualNodes[id]);
          delete _this.virtualNodes[id];
        }
      });

      virtualGraphParamsKeys.forEach(function (key) {
        if (key === 'output') {
          throw new Error('\'output\' is not a valid id');
        }
        var virtualAudioNodeParams = virtualGraphParams[key];

        var _virtualAudioNodeParams = _slicedToArray(virtualAudioNodeParams, 2);

        var node = _virtualAudioNodeParams[0];
        var output = _virtualAudioNodeParams[1];

        if (output == null && node !== 'mediaStreamDestination') {
          throw new Error('output not specified for node key ' + key);
        }
        var virtualAudioNode = _this.virtualNodes[key];
        if (virtualAudioNode == null) {
          _this.virtualNodes[key] = createVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParams);
          return;
        }
        if (startTimePathParams(virtualAudioNodeParams) !== startTimePathStored(virtualAudioNode) || stopTimePathParams(virtualAudioNodeParams) !== stopTimePathStored(virtualAudioNode)) {
          disconnect(virtualAudioNode);
          delete _this.virtualNodes[key];
          _this.virtualNodes[key] = createVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParams);
          return;
        }
        if (virtualAudioNodeParams[0] !== virtualAudioNode.node) {
          disconnect(virtualAudioNode);
          _this.virtualNodes[key] = createVirtualAudioNode(audioContext, customNodes, virtualAudioNodeParams);
          return;
        }
        if (!checkOutputsEqual(virtualAudioNodeParams[1], virtualAudioNode.output)) {
          disconnect(virtualAudioNode, true);
          virtualAudioNode.output = virtualAudioNodeParams[1];
        }

        _update(virtualAudioNode, virtualAudioNodeParams[2]);
      });

      connectAudioNodes(this.virtualNodes, function (virtualNode) {
        return connect(virtualNode, output);
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
