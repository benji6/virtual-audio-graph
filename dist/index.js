'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var capitalize = require('capitalize');
var connect = require('./tools/connect');
var connectAudioNodes = require('./tools/connectAudioNodes');
var createVirtualAudioNode = require('./tools/createVirtualAudioNode');
var updateAudioNodeAndVirtualAudioGraph = require('./tools/updateAudioNodeAndVirtualAudioGraph');
var disconnect = require('./tools/disconnect');

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

module.exports = (function () {
  function VirtualAudioGraph() {
    var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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

      difference(Object.keys(this.virtualNodes), Object.keys(virtualGraphParams)).forEach(function (id) {
        disconnect(_this.virtualNodes[id]);
        delete _this.virtualNodes[id];
      });

      Object.keys(virtualGraphParams).forEach(function (key) {
        if (key === 'output') {
          throw new Error('\'output\' is not a valid id');
        }
        var virtualAudioNodeParam = virtualGraphParams[key];
        if (virtualAudioNodeParam.output == null) {
          throw new Error('ouptput not specified for node key ' + key);
        }
        var virtualAudioNode = _this.virtualNodes[key];
        if (virtualAudioNode == null) {
          _this.virtualNodes[key] = createVirtualAudioNode.call(_this, virtualAudioNodeParam);
          return;
        }
        if (startTimePath(virtualAudioNodeParam) !== startTimePath(virtualAudioNode) || stopTimePath(virtualAudioNodeParam) !== stopTimePath(virtualAudioNode)) {
          disconnect(virtualAudioNode);
          delete _this.virtualNodes[key];
        }
        updateAudioNodeAndVirtualAudioGraph.call(_this, virtualAudioNode, virtualAudioNodeParam, key);
      });

      connectAudioNodes(this.virtualNodes, function (virtualNode) {
        return connect(virtualNode, _this.output);
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