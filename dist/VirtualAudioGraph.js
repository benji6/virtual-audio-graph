'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _require = require('ramda');

var append = _require.append;
var find = _require.find;
var forEach = _require.forEach;
var isNil = _require.isNil;
var propEq = _require.propEq;

var capitalize = require('capitalize');
var CustomVirtualAudioNode = require('./virtualNodeConstructors/CustomVirtualAudioNode');
var connectAudioNodes = require('./tools/connectAudioNodes');
var createVirtualAudioNode = require('./tools/createVirtualAudioNode');
var removeAudioNodesAndUpdateVirtualAudioGraph = require('./tools/removeAudioNodesAndUpdateVirtualAudioGraph');
var updateAudioNodeAndVirtualAudioGraph = require('./tools/updateAudioNodeAndVirtualAudioGraph');

var VirtualAudioGraph = (function () {
  function VirtualAudioGraph() {
    var params = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, VirtualAudioGraph);

    this.audioContext = params.audioContext || new AudioContext();
    this.output = params.output || this.audioContext.destination;
    this.virtualNodes = [];
    this.customNodes = {};
  }

  _createClass(VirtualAudioGraph, [{
    key: 'defineNode',
    value: function defineNode(customNodeParamsFactory, name) {
      if (this.audioContext['create' + capitalize(name)]) throw new Error(name + ' is a standard audio node name and cannot be overwritten');

      this.customNodes[name] = customNodeParamsFactory;
      return this;
    }
  }, {
    key: 'update',
    value: function update(virtualAudioNodeParams) {
      var _this = this;

      removeAudioNodesAndUpdateVirtualAudioGraph.call(this, virtualAudioNodeParams);

      forEach(function (virtualAudioNodeParam) {
        var id = virtualAudioNodeParam.id;

        if (isNil(id)) throw new Error('Every virtualAudioNode needs an id for efficient diffing and determining relationships between nodes');
        if (id === 'output') throw new Error('\'output\' is not a valid id');

        var virtualAudioNode = find(propEq(id, 'id'))(_this.virtualNodes);

        if (virtualAudioNode) updateAudioNodeAndVirtualAudioGraph.call(_this, virtualAudioNode, virtualAudioNodeParam);else _this.virtualNodes = append(createVirtualAudioNode.call(_this, virtualAudioNodeParam), _this.virtualNodes);
      }, virtualAudioNodeParams);

      connectAudioNodes(CustomVirtualAudioNode, this.virtualNodes, function (virtualAudioNode) {
        return virtualAudioNode.connect(_this.output);
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

module.exports = VirtualAudioGraph;