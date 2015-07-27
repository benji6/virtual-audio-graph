'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _toolsDisconnect = require('./tools/disconnect');

var _toolsDisconnect2 = _interopRequireDefault(_toolsDisconnect);

var _require = require('ramda');

var compose = _require.compose;
var difference = _require.difference;
var forEach = _require.forEach;
var isNil = _require.isNil;
var keys = _require.keys;
var tap = _require.tap;

var capitalize = require('capitalize');
var connect = require('./tools/connect');
var connectAudioNodes = require('./tools/connectAudioNodes');
var createVirtualAudioNode = require('./tools/createVirtualAudioNode');
var updateAudioNodeAndVirtualAudioGraph = require('./tools/updateAudioNodeAndVirtualAudioGraph');

module.exports = (function () {
  function VirtualAudioGraph() {
    var params = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, VirtualAudioGraph);

    this.audioContext = params.audioContext || new AudioContext();
    this.output = params.output || this.audioContext.destination;
    this.virtualNodes = {};
    this.customNodes = {};
  }

  _createClass(VirtualAudioGraph, [{
    key: 'defineNode',
    value: function defineNode(customNodeParamsFactory, name) {
      if (this.audioContext['create' + capitalize(name)]) {
        throw new Error(name + ' is a standard audio node name and cannot be overwritten');
      }

      this.customNodes[name] = customNodeParamsFactory;
      return this;
    }
  }, {
    key: 'update',
    value: function update(virtualGraphParams) {
      var _this = this;

      var idsToRemove = difference(keys(this.virtualNodes), keys(virtualGraphParams));

      forEach(compose(function (id) {
        return delete _this.virtualNodes[id];
      }, tap(function (id) {
        return (0, _toolsDisconnect2['default'])(_this.virtualNodes[id]);
      })), idsToRemove);

      forEach(function (id) {
        var virtualAudioNode = _this.virtualNodes[id];
        var virtualAudioNodeParam = virtualGraphParams[id];

        if (id === 'output') {
          throw new Error('\'output\' is not a valid id');
        }
        if (isNil(virtualAudioNodeParam.output)) {
          throw new Error('ouptput not specified for node id ' + id);
        }

        if (virtualAudioNode) {
          var params = virtualAudioNode.params || {};
          var startTime = params.startTime;
          var stopTime = params.stopTime;

          var virtualAudioNodeParamParams = virtualAudioNodeParam.params || {};
          var paramStartTime = virtualAudioNodeParamParams.startTime;
          var paramStopTime = virtualAudioNodeParamParams.stopTime;
          if (paramStartTime !== startTime || paramStopTime !== stopTime) {
            (0, _toolsDisconnect2['default'])(virtualAudioNode);
            delete _this.virtualNodes[id];
          }
          updateAudioNodeAndVirtualAudioGraph.call(_this, virtualAudioNode, virtualAudioNodeParam);
        } else {
          _this.virtualNodes[id] = createVirtualAudioNode.call(_this, virtualAudioNodeParam);
        }
      }, keys(virtualGraphParams));

      connectAudioNodes(this.virtualNodes, function (virtualAudioNode) {
        return connect(virtualAudioNode, _this.output);
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