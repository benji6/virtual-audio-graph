'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _require = require('ramda');

var contains = _require.contains;
var filter = _require.filter;
var forEach = _require.forEach;
var keys = _require.keys;
var pick = _require.pick;
var pluck = _require.pluck;
var propEq = _require.propEq;
var omit = _require.omit;
var zipWith = _require.zipWith;

var connectAudioNodes = require('../tools/connectAudioNodes');

module.exports = (function () {
  function CustomVirtualAudioNode(virtualAudioGraph, _ref) {
    var node = _ref.node;
    var id = _ref.id;
    var output = _ref.output;
    var params = _ref.params;

    _classCallCheck(this, CustomVirtualAudioNode);

    params = params || {};
    this.audioGraphParamsFactory = virtualAudioGraph.customNodes[node];
    this.node = node;
    this.virtualNodes = this.audioGraphParamsFactory(params);
    this.virtualNodes = virtualAudioGraph.createVirtualAudioNodes(this.virtualNodes);
    connectAudioNodes(CustomVirtualAudioNode, this.virtualNodes);
    this.id = id;
    this.output = Array.isArray(output) ? output : [output];
  }

  _createClass(CustomVirtualAudioNode, [{
    key: 'connect',
    value: function connect(destination) {
      var outputVirtualNodes = filter(function (_ref2) {
        var output = _ref2.output;
        return contains('output', output);
      }, this.virtualNodes);
      forEach(function (audioNode) {
        return audioNode.connect(destination);
      }, pluck('audioNode', outputVirtualNodes));
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      forEach(function (virtualNode) {
        return virtualNode.disconnect();
      }, this.virtualNodes);
    }
  }, {
    key: 'updateAudioNode',
    value: function updateAudioNode(params) {
      zipWith(function (virtualNode, _ref3) {
        var params = _ref3.params;
        return virtualNode.updateAudioNode(params);
      }, this.virtualNodes, this.audioGraphParamsFactory(params));
    }
  }, {
    key: 'inputs',
    get: function get() {
      return pluck('audioNode', filter(propEq('input', 'input'), this.virtualNodes));
    }
  }]);

  return CustomVirtualAudioNode;
})();