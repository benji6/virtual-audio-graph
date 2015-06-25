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

var capitalizeFirst = require('./tools/capitalizeFirst');
var NativeVirtualAudioNode = require('./virtualNodeConstructors/NativeVirtualAudioNode');
var CustomVirtualAudioNode = require('./virtualNodeConstructors/CustomVirtualAudioNode');
var connectAudioNodes = require('./tools/connectAudioNodes');

var createVirtualAudioNodesAndUpdateVirtualAudioGraph = function createVirtualAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
  var newVirtualAudioNodeParams = differenceWith(eqProps('id'), virtualAudioNodeParams, this.virtualAudioGraph);

  this.virtualAudioGraph = concat(this.virtualAudioGraph, this.createVirtualAudioNodes(newVirtualAudioNodeParams));

  return virtualAudioNodeParams;
};

var removeAudioNodesAndUpdateVirtualAudioGraph = function removeAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
  var _this = this;

  var virtualNodesToBeRemoved = differenceWith(eqProps('id'), this.virtualAudioGraph, virtualAudioNodeParams);

  forEach(function (_ref) {
    var audioNode = _ref.audioNode;
    var id = _ref.id;

    audioNode.stop && audioNode.stop();
    audioNode.disconnect();
    _this.virtualAudioGraph = remove(findIndex(propEq('id', id))(_this.virtualAudioGraph), 1, _this.virtualAudioGraph);
  }, virtualNodesToBeRemoved);

  return virtualAudioNodeParams;
};

var updateAudioNodesAndUpdateVirtualAudioGraph = function updateAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
  var _this2 = this;

  var updateParams = intersectionWith(eqProps('id'), virtualAudioNodeParams, this.virtualAudioGraph);

  forEach(function (virtualAudioNodeParam) {
    var virtualAudioNode = find(propEq('id', virtualAudioNodeParam.id))(_this2.virtualAudioGraph);
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
    this.virtualAudioGraph = [];
    this.customNodes = {};

    this._removeUpdateAndCreate = compose(createVirtualAudioNodesAndUpdateVirtualAudioGraph.bind(this), updateAudioNodesAndUpdateVirtualAudioGraph.bind(this), removeAudioNodesAndUpdateVirtualAudioGraph.bind(this));
  }

  _createClass(VirtualAudioGraph, [{
    key: 'createVirtualAudioNodes',
    value: function createVirtualAudioNodes(virtualAudioNodesParams) {
      var _this3 = this;

      var partitionedVirtualAudioNodeParams = partition(function (_ref2) {
        var node = _ref2.node;
        return isNil(_this3.customNodes[node]);
      }, virtualAudioNodesParams);

      var nativeVirtualAudioNodeParams = partitionedVirtualAudioNodeParams[0];
      var customVirtualAudioNodeParams = partitionedVirtualAudioNodeParams[1];

      var nativeVirtualAudioNodes = map(function (virtualAudioNodeParams) {
        return new NativeVirtualAudioNode(_this3, virtualAudioNodeParams);
      }, nativeVirtualAudioNodeParams);
      var customVirtualAudioNodes = map(function (virtualAudioNodeParams) {
        return new CustomVirtualAudioNode(_this3, virtualAudioNodeParams);
      }, customVirtualAudioNodeParams);

      return concat(nativeVirtualAudioNodes, customVirtualAudioNodes);
    }
  }, {
    key: 'defineNode',
    value: function defineNode(params, name) {
      if (this.audioContext['create' + capitalizeFirst(name)]) {
        throw new Error('' + name + ' is a standard audio node name and cannot be overwritten');
      }
      this.customNodes[name] = function () {
        return params;
      };
      return this;
    }
  }, {
    key: 'update',
    value: function update(virtualAudioNodeParams) {
      var _this4 = this;

      if (any(propEq('id', undefined), virtualAudioNodeParams)) {
        throw new Error('Every virtualAudioNode needs an id for efficient diffing and determining relationships between nodes');
      }

      this._removeUpdateAndCreate(virtualAudioNodeParams);
      connectAudioNodes(CustomVirtualAudioNode, this.virtualAudioGraph, function (virtualAudioNode) {
        return virtualAudioNode.connect(_this4.output);
      });

      return this;
    }
  }]);

  return VirtualAudioGraph;
})();

module.exports = VirtualAudioGraph;