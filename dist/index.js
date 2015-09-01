'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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

var startTimePath = function startTimePath(obj) {
  return obj.params && obj.params.startTime;
};
var stopTimePath = function stopTimePath(obj) {
  return obj.params && obj.params.stopTime;
};
var difference = function difference(arr0, arr1) {
  return arr0.filter(function (x) {
    return arr1.indexOf(x) === -1;
  });
};

var VirtualAudioGraph = (function () {
  function VirtualAudioGraph() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$audioContext = _ref.audioContext;
    var audioContext = _ref$audioContext === undefined ? new AudioContext() : _ref$audioContext;
    var _ref$output = _ref.output;
    var output = _ref$output === undefined ? audioContext.destination : _ref$output;

    _classCallCheck(this, VirtualAudioGraph);

    this.audioContext = audioContext;
    this.output = output;
    this.virtualNodes = {};
    this.customNodes = {};
  }

  _createClass(VirtualAudioGraph, [{
    key: 'defineNode',
    value: function defineNode(customNodeParamsFactory, name) {
      if (this.audioContext['create' + (0, _capitalize2['default'])(name)]) {
        throw new Error(name + ' is a standard audio node name and cannot be overwritten');
      }

      this.customNodes[name] = customNodeParamsFactory;
      return this;
    }
  }, {
    key: 'getAudioNodeById',
    value: function getAudioNodeById(id) {
      return this.virtualNodes[id].audioNode;
    }
  }, {
    key: 'update',
    value: function update(virtualGraphParams) {
      var _this = this;

      difference(Object.keys(this.virtualNodes), Object.keys(virtualGraphParams)).forEach(function (id) {
        (0, _helpersDisconnect2['default'])(_this.virtualNodes[id]);
        delete _this.virtualNodes[id];
      });

      Object.keys(virtualGraphParams).forEach(function (key) {
        if (key === 'output') {
          throw new Error('\'output\' is not a valid id');
        }
        var virtualAudioNodeParam = virtualGraphParams[key];
        var output = virtualAudioNodeParam.output;
        var node = virtualAudioNodeParam.node;

        if (output == null && node !== 'mediaStreamDestination') {
          throw new Error('output not specified for node key ' + key);
        }
        var virtualAudioNode = _this.virtualNodes[key];
        if (virtualAudioNode == null) {
          _this.virtualNodes[key] = _helpersCreateVirtualAudioNode2['default'].call(_this, virtualAudioNodeParam);
          return;
        }
        if (startTimePath(virtualAudioNodeParam) !== startTimePath(virtualAudioNode) || stopTimePath(virtualAudioNodeParam) !== stopTimePath(virtualAudioNode)) {
          (0, _helpersDisconnect2['default'])(virtualAudioNode);
          delete _this.virtualNodes[key];
        }
        _helpersUpdateAudioNodeAndVirtualAudioGraph2['default'].call(_this, virtualAudioNode, virtualAudioNodeParam, key);
      });

      (0, _helpersConnectAudioNodes2['default'])(this.virtualNodes, function (virtualNode) {
        return (0, _helpersConnect2['default'])(virtualNode, _this.output);
      });

      return this;
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this.audioContext.currentTime;
    }
  }]);

  return VirtualAudioGraph;
})();

exports['default'] = VirtualAudioGraph;
module.exports = exports['default'];