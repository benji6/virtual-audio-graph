'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _require = require('ramda');

var append = _require.append;
var concat = _require.concat;
var differenceWith = _require.differenceWith;
var eqProps = _require.eqProps;
var equals = _require.equals;
var find = _require.find;
var findIndex = _require.findIndex;
var forEach = _require.forEach;
var isNil = _require.isNil;
var map = _require.map;
var partition = _require.partition;
var propEq = _require.propEq;
var remove = _require.remove;

var capitalize = require('capitalize');
var NativeVirtualAudioNode = require('./virtualNodeConstructors/NativeVirtualAudioNode');
var CustomVirtualAudioNode = require('./virtualNodeConstructors/CustomVirtualAudioNode');
var connectAudioNodes = require('./tools/connectAudioNodes');
var createVirtualAudioNode = require('./tools/createVirtualAudioNode');

var disconnectAndRemoveVirtualAudioNode = function disconnectAndRemoveVirtualAudioNode(virtualNode) {
  virtualNode.disconnect();
  this.virtualNodes = remove(findIndex(propEq('id', virtualNode.id))(this.virtualNodes), 1, this.virtualNodes);
};

var removeAudioNodesAndUpdateVirtualAudioGraph = function removeAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
  var virtualNodesToBeRemoved = differenceWith(eqProps('id'), this.virtualNodes, virtualAudioNodeParams);

  forEach(disconnectAndRemoveVirtualAudioNode.bind(this), virtualNodesToBeRemoved);

  return virtualAudioNodeParams;
};

var updateAudioNodeAndVirtualAudioGraph = function updateAudioNodeAndVirtualAudioGraph(virtualAudioNode, virtualAudioNodeParam) {
  if (virtualAudioNodeParam.node !== virtualAudioNode.node) {
    disconnectAndRemoveVirtualAudioNode.call(this, virtualAudioNode);
    this.virtualNodes = append(createVirtualAudioNode.call(this, virtualAudioNodeParam), this.virtualNodes);
    return;
  }

  if (!equals(virtualAudioNodeParam.output, virtualAudioNode.output)) {
    virtualAudioNode.disconnect();
    virtualAudioNode.output = virtualAudioNodeParam.output;
  }

  virtualAudioNode.updateAudioNode(virtualAudioNodeParam.params);
};

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

        var virtualAudioNode = find(propEq('id', id))(_this.virtualNodes);

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