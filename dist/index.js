'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _capitalize = require('capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

var _helpersConnect = require('./helpers/connect');

var _helpersConnect2 = _interopRequireDefault(_helpersConnect);

var _helpersConnectAudioNodes = require('./helpers/connectAudioNodes');

var _helpersConnectAudioNodes2 = _interopRequireDefault(_helpersConnectAudioNodes);

var _helpersCreateVirtualAudioNode = require('./helpers/createVirtualAudioNode');

var _helpersCreateVirtualAudioNode2 = _interopRequireDefault(_helpersCreateVirtualAudioNode);

var _helpersUpdateAudioNodeAndVirtualAudioGraph = require('./helpers/updateAudioNodeAndVirtualAudioGraph');

var _helpersUpdateAudioNodeAndVirtualAudioGraph2 = _interopRequireDefault(_helpersUpdateAudioNodeAndVirtualAudioGraph);

var _helpersDisconnect = require('./helpers/disconnect');

var _helpersDisconnect2 = _interopRequireDefault(_helpersDisconnect);

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

exports['default'] = function () {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$audioContext = _ref.audioContext;
  var audioContext = _ref$audioContext === undefined ? new AudioContext() : _ref$audioContext;
  var _ref$output = _ref.output;
  var output = _ref$output === undefined ? audioContext.destination : _ref$output;

  var customNodes = {};
  return Object.defineProperties({
    audioContext: audioContext,
    virtualNodes: {},

    defineNodes: function defineNodes(customNodeParams) {
      Object.keys(customNodeParams).forEach(function (name) {
        if (audioContext['create' + (0, _capitalize2['default'])(name)]) {
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
          (0, _helpersDisconnect2['default'])(_this.virtualNodes[id]);
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
          _this.virtualNodes[key] = (0, _helpersCreateVirtualAudioNode2['default'])(audioContext, customNodes, virtualAudioNodeParams);
          return;
        }
        if (startTimePathParams(virtualAudioNodeParams) !== startTimePathStored(virtualAudioNode) || stopTimePathParams(virtualAudioNodeParams) !== stopTimePathStored(virtualAudioNode)) {
          (0, _helpersDisconnect2['default'])(virtualAudioNode);
          delete _this.virtualNodes[key];
        }
        (0, _helpersUpdateAudioNodeAndVirtualAudioGraph2['default'])(audioContext, _this.virtualNodes, customNodes, virtualAudioNode, virtualAudioNodeParams, key);
      });

      (0, _helpersConnectAudioNodes2['default'])(this.virtualNodes, function (virtualNode) {
        return (0, _helpersConnect2['default'])(virtualNode, output);
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

module.exports = exports['default'];