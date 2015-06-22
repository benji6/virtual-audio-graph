'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _require = require('ramda');

var any = _require.any;
var concat = _require.concat;
var differenceWith = _require.differenceWith;
var eqProps = _require.eqProps;
var find = _require.find;
var findIndex = _require.findIndex;
var forEach = _require.forEach;
var intersectionWith = _require.intersectionWith;
var map = _require.map;
var prop = _require.prop;
var propEq = _require.propEq;
var remove = _require.remove;

var VirtualAudioNode = require('./VirtualAudioNode');

var VirtualAudioGraph = (function () {
  function VirtualAudioGraph() {
    var params = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, VirtualAudioGraph);

    this.audioContext = params.audioContext || new AudioContext();
    this.output = params.output || this.audioContext.destination;
    this.virtualAudioGraph = [];
  }

  _createClass(VirtualAudioGraph, [{
    key: 'connectAudioNodes',
    value: function connectAudioNodes() {
      var _this = this;

      forEach(function (_ref) {
        var audioNode = _ref.audioNode;
        var output = _ref.output;

        forEach(function (connection) {
          if (connection === 'output') {
            audioNode.connect(_this.output);
          } else {
            audioNode.connect(prop('audioNode', find(propEq('id', connection))(_this.virtualAudioGraph)));
          }
        }, output);
      }, this.virtualAudioGraph);
      return this;
    }
  }, {
    key: 'createAudioNode',
    value: function createAudioNode(nodeParams) {
      return new VirtualAudioNode(this.audioContext, nodeParams);
    }
  }, {
    key: 'createAudioNodes',
    value: function createAudioNodes(virtualAudioNodeParams) {
      this.virtualAudioGraph = concat(this.virtualAudioGraph, map(this.createAudioNode.bind(this), virtualAudioNodeParams));
      return this;
    }
  }, {
    key: 'removeAudioNodes',
    value: function removeAudioNodes(virtualAudioNodes) {
      var _this2 = this;

      forEach(function (_ref2) {
        var audioNode = _ref2.audioNode;
        var id = _ref2.id;

        audioNode.stop && audioNode.stop();
        audioNode.disconnect();
        _this2.virtualAudioGraph = remove(findIndex(propEq('id', id))(_this2.virtualAudioGraph), 1, _this2.virtualAudioGraph);
      }, virtualAudioNodes);
      return this;
    }
  }, {
    key: 'update',
    value: function update(virtualAudioNodeParams) {
      if (any(propEq('id', undefined), virtualAudioNodeParams)) {
        throw new Error('Every virtualAudioNode needs an id for efficient diffing and determining relationships between nodes');
      }
      var newAudioNodes = differenceWith(eqProps('id'), virtualAudioNodeParams, this.virtualAudioGraph);
      var oldAudioNodes = differenceWith(eqProps('id'), this.virtualAudioGraph, virtualAudioNodeParams);
      var sameAudioNodes = intersectionWith(eqProps('id'), virtualAudioNodeParams, this.virtualAudioGraph);

      return this.removeAudioNodes(oldAudioNodes).updateAudioNodes(sameAudioNodes).createAudioNodes(newAudioNodes).connectAudioNodes();
    }
  }, {
    key: 'updateAudioNodes',
    value: function updateAudioNodes(virtualAudioNodeParams) {
      var _this3 = this;

      forEach(function (virtualAudioNodeParam) {
        var virtualAudioNode = find(propEq('id', virtualAudioNodeParam.id))(_this3.virtualAudioGraph);
        virtualAudioNode.updateAudioNode(virtualAudioNodeParam.params);
      }, virtualAudioNodeParams);
      return this;
    }
  }]);

  return VirtualAudioGraph;
})();

module.exports = VirtualAudioGraph;