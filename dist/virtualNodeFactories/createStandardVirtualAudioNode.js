'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersCreateAudioNode = require('../helpers/createAudioNode');

var _helpersCreateAudioNode2 = _interopRequireDefault(_helpersCreateAudioNode);

var _dataConstructorParamsKeys = require('../data/constructorParamsKeys');

var _dataConstructorParamsKeys2 = _interopRequireDefault(_dataConstructorParamsKeys);

var _helpersUpdate = require('../helpers/update');

var _helpersUpdate2 = _interopRequireDefault(_helpersUpdate);

exports['default'] = function (audioContext, _ref) {
  var _ref2 = _slicedToArray(_ref, 4);

  var node = _ref2[0];
  var output = _ref2[1];
  var params = _ref2[2];
  var input = _ref2[3];

  params = params || {};
  var _params = params;
  var startTime = _params.startTime;
  var stopTime = _params.stopTime;

  var constructorParam = params[Object.keys(params).filter(function (key) {
    return _dataConstructorParamsKeys2['default'].indexOf(key) !== -1;
  })[0]];
  var virtualNode = {
    audioNode: (0, _helpersCreateAudioNode2['default'])(audioContext, node, constructorParam, { startTime: startTime, stopTime: stopTime }),
    connected: false,
    isCustomVirtualNode: false,
    input: input,
    node: node,
    output: output,
    stopCalled: stopTime !== undefined
  };
  return (0, _helpersUpdate2['default'])(virtualNode, params);
};

module.exports = exports['default'];