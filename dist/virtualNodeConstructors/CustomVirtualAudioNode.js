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

var connectAudioNodes = require('../tools/connectAudioNodes');
// if you use the below extract it
// const constructorParamsKeys = [
//   'maxDelayTime',
// ];

module.exports = (function () {
  function CustomVirtualAudioNode(virtualAudioGraph, virtualNodeParams) {
    _classCallCheck(this, CustomVirtualAudioNode);

    var node = virtualNodeParams.node;
    var id = virtualNodeParams.id;
    var output = virtualNodeParams.output;

    // params = params || {};
    // const constructorParams = pick(constructorParamsKeys, params);
    // params = omit(constructorParamsKeys, params);
    // this.updateAudioNode(params);
    this.virtualAudioGraph = virtualAudioGraph.customNodes[node]();
    this.virtualAudioGraph = virtualAudioGraph.createVirtualAudioNodes(this.virtualAudioGraph);
    connectAudioNodes(CustomVirtualAudioNode, this.virtualAudioGraph);
    this.id = id;
    this.output = Array.isArray(output) ? output : [output];
  }

  _createClass(CustomVirtualAudioNode, [{
    key: 'connect',
    value: function connect(destination) {
      var outputVirtualNodes = filter(function (_ref) {
        var output = _ref.output;
        return contains('output', output);
      }, this.virtualAudioGraph);
      forEach(function (audioNode) {
        return audioNode.connect(destination);
      }, pluck('audioNode', outputVirtualNodes));
    }
  }, {
    key: 'updateAudioNode',
    value: function updateAudioNode(params) {}
  }, {
    key: 'inputs',
    get: function () {
      return pluck('audioNode', filter(propEq('input', 'input'), this.virtualAudioGraph));
    }
  }]);

  return CustomVirtualAudioNode;
})();

// need to implement some update logic here