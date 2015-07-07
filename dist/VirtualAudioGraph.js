'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _require = require('ramda');

var any = _require.any;
var assoc = _require.assoc;
var concat = _require.concat;
var compose = _require.compose;
var differenceWith = _require.differenceWith;
var eqProps = _require.eqProps;
var find = _require.find;
var findIndex = _require.findIndex;
var forEach = _require.forEach;
var intersectionWith = _require.intersectionWith;
var isNil = _require.isNil;
var map = _require.map;
var partition = _require.partition;
var propEq = _require.propEq;
var remove = _require.remove;

var capitalize = require('capitalize');
var NativeVirtualAudioNode = require('./virtualNodeConstructors/NativeVirtualAudioNode');
var CustomVirtualAudioNode = require('./virtualNodeConstructors/CustomVirtualAudioNode');
var connectAudioNodes = require('./tools/connectAudioNodes');

var disconnectAndRemoveVirtualAudioNode = function disconnectAndRemoveVirtualAudioNode(virtualNode) {
  virtualNode.disconnect();
  this.virtualNodes = remove(findIndex(propEq('id', virtualNode.id))(this.virtualNodes), 1, this.virtualNodes);
};

var createVirtualAudioNodesAndUpdateVirtualAudioGraph = function createVirtualAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
  var newVirtualAudioNodeParams = differenceWith(eqProps('id'), virtualAudioNodeParams, this.virtualNodes);

  this.virtualNodes = concat(this.virtualNodes, this.createVirtualAudioNodes(newVirtualAudioNodeParams));

  return virtualAudioNodeParams;
};

var removeAudioNodesAndUpdateVirtualAudioGraph = function removeAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
  var virtualNodesToBeRemoved = differenceWith(eqProps('id'), this.virtualNodes, virtualAudioNodeParams);

  forEach(disconnectAndRemoveVirtualAudioNode.bind(this), virtualNodesToBeRemoved);

  return virtualAudioNodeParams;
};

var updateAudioNodesAndUpdateVirtualAudioGraph = function updateAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
  var _this = this;

  var updateParams = intersectionWith(eqProps('id'), virtualAudioNodeParams, this.virtualNodes);

  forEach(function (virtualAudioNodeParam) {
    var virtualAudioNode = find(propEq('id', virtualAudioNodeParam.id))(_this.virtualNodes);
    if (virtualAudioNodeParam.node !== virtualAudioNode.node) disconnectAndRemoveVirtualAudioNode.call(_this, virtualAudioNode);
    virtualAudioNode.updateAudioNode(virtualAudioNodeParam.params);
  }, updateParams);

  return virtualAudioNodeParams;
};

var VirtualAudioGraph = (function () {
  function VirtualAudioGraph() {
    var params = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, VirtualAudioGraph);

    this.audioContext = params.audioContext || new AudioContext();
    this.output = params.output || this.audioContext.destination;
    this.virtualNodes = [];
    this.customNodes = {};

    this._removeUpdateAndCreate = compose(createVirtualAudioNodesAndUpdateVirtualAudioGraph.bind(this), updateAudioNodesAndUpdateVirtualAudioGraph.bind(this), removeAudioNodesAndUpdateVirtualAudioGraph.bind(this));
  }

  _createClass(VirtualAudioGraph, [{
    key: 'createVirtualAudioNodes',
    value: function createVirtualAudioNodes(virtualAudioNodesParams) {
      var _this2 = this;

      var partitionedVirtualAudioNodeParams = partition(function (_ref) {
        var node = _ref.node;
        return isNil(_this2.customNodes[node]);
      }, virtualAudioNodesParams);

      var nativeVirtualAudioNodeParams = partitionedVirtualAudioNodeParams[0];
      var customVirtualAudioNodeParams = partitionedVirtualAudioNodeParams[1];

      var nativeVirtualAudioNodes = map(function (virtualAudioNodeParams) {
        return new NativeVirtualAudioNode(_this2, virtualAudioNodeParams);
      }, nativeVirtualAudioNodeParams);
      var customVirtualAudioNodes = map(function (virtualAudioNodeParams) {
        return new CustomVirtualAudioNode(_this2, virtualAudioNodeParams);
      }, customVirtualAudioNodeParams);

      return concat(nativeVirtualAudioNodes, customVirtualAudioNodes);
    }
  }, {
    key: 'defineNode',
    value: function defineNode(customNodeParamsFactory, name) {
      if (this.audioContext['create' + capitalize(name)]) throw new Error(name + ' is a standard audio node name and cannot be overwritten');

      this.customNodes[name] = customNodeParamsFactory;
      return this;
    }
  }, {
    key: 'update',
    value: function update(virtualAudioNodeParams) {
      var _this3 = this;

      if (any(propEq('id', undefined), virtualAudioNodeParams)) throw new Error('Every virtualAudioNode needs an id for efficient diffing and determining relationships between nodes');

      this._removeUpdateAndCreate(virtualAudioNodeParams);
      connectAudioNodes(CustomVirtualAudioNode, this.virtualNodes, function (virtualAudioNode) {
        return virtualAudioNode.connect(_this3.output);
      });

      return this;
    }
  }]);

  return VirtualAudioGraph;
})();

module.exports = VirtualAudioGraph;