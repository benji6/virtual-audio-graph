'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _toolsDisconnect = require('./tools/disconnect');

var _toolsDisconnect2 = _interopRequireDefault(_toolsDisconnect);

var _require = require('ramda');

var both = _require.both;
var compose = _require.compose;
var difference = _require.difference;
var equals = _require.equals;
var forEach = _require.forEach;
var ifElse = _require.ifElse;
var isNil = _require.isNil;
var keys = _require.keys;
var partial = _require.partial;
var path = _require.path;
var tap = _require.tap;

var capitalize = require('capitalize');
var connect = require('./tools/connect');
var connectAudioNodes = require('./tools/connectAudioNodes');
var createVirtualAudioNode = require('./tools/createVirtualAudioNode');
var updateAudioNodeAndVirtualAudioGraph = require('./tools/updateAudioNodeAndVirtualAudioGraph');

var startTimePath = path(['params', 'startTime']);
var stopTimePath = path(['params', 'stopTime']);
var throwError = function throwError(str) {
  throw new Error(str);
};

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

      forEach(compose(function (id) {
        return delete _this.virtualNodes[id];
      }, tap(function (id) {
        return (0, _toolsDisconnect2['default'])(_this.virtualNodes[id]);
      })), difference(keys(this.virtualNodes), keys(virtualGraphParams)));

      forEach(compose(ifElse(compose(isNil, path(['virtualAudioNode'])), function (_ref) {
        var id = _ref.id;
        var virtualAudioNodeParam = _ref.virtualAudioNodeParam;
        return _this.virtualNodes[id] = createVirtualAudioNode.call(_this, virtualAudioNodeParam);
      }, function (_ref2) {
        var id = _ref2.id;
        var virtualAudioNode = _ref2.virtualAudioNode;
        var virtualAudioNodeParam = _ref2.virtualAudioNodeParam;

        if (startTimePath(virtualAudioNodeParam) !== startTimePath(virtualAudioNode) || stopTimePath(virtualAudioNodeParam) !== stopTimePath(virtualAudioNode)) {
          (0, _toolsDisconnect2['default'])(virtualAudioNode);
          delete _this.virtualNodes[id];
        }
        updateAudioNodeAndVirtualAudioGraph.call(_this, virtualAudioNode, virtualAudioNodeParam, id);
      }), tap(function (_ref3) {
        var id = _ref3.id;
        var virtualAudioNodeParam = _ref3.virtualAudioNodeParam;
        return isNil(virtualAudioNodeParam.output) && throwError('ouptput not specified for node id ' + id);
      }), function (id) {
        return { id: id,
          virtualAudioNodeParam: virtualGraphParams[id],
          virtualAudioNode: _this.virtualNodes[id] };
      }, tap(both(equals('output'), partial(throwError, '\'output\' is not a valid id')))), keys(virtualGraphParams));

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