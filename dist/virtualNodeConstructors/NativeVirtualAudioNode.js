'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var createAudioNode = require('../tools/createAudioNode');

var _require = require('ramda');

var contains = _require.contains;
var forEach = _require.forEach;
var keys = _require.keys;
var pick = _require.pick;
var omit = _require.omit;

var capitalize = require('capitalize');

var constructorParamsKeys = ['maxDelayTime'];

var audioParamProperties = ['delayTime', 'detune', 'frequency', 'gain', 'pan', 'Q'];

var setters = ['position', 'orientation'];

module.exports = (function () {
  function NativeVirtualAudioNode(virtualAudioGraph, virtualNodeParams) {
    _classCallCheck(this, NativeVirtualAudioNode);

    var node = virtualNodeParams.node;
    var id = virtualNodeParams.id;
    var input = virtualNodeParams.input;
    var output = virtualNodeParams.output;
    var params = virtualNodeParams.params;

    params = params || {};
    var constructorParams = pick(constructorParamsKeys, params);
    this.audioNode = createAudioNode(virtualAudioGraph.audioContext, node, constructorParams);
    this.connected = false;
    this.node = node;
    this.updateAudioNode(params);
    this.id = id;
    this.input = input;
    this.output = output;
    this.params = params;
  }

  _createClass(NativeVirtualAudioNode, [{
    key: 'connect',
    value: function connect(destination) {
      this.audioNode.connect(destination);
      this.connected = true;
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      this.audioNode.disconnect();
      this.connected = false;
    }
  }, {
    key: 'updateAudioNode',
    value: function updateAudioNode(params) {
      var _this = this;

      params = omit(constructorParamsKeys, params);
      forEach(function (key) {
        var param = params[key];
        if (_this.params && _this.params[key] === param) return;
        if (contains(key, audioParamProperties)) {
          _this.audioNode[key].value = param;
          return;
        }
        if (contains(key, setters)) {
          _this.audioNode['set' + capitalize(key)].apply(_this.audioNode, param);
          return;
        }
        _this.audioNode[key] = param;
      }, keys(omit(constructorParamsKeys, params)));
    }
  }]);

  return NativeVirtualAudioNode;
})();