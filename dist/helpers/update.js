'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = update;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var _capitalize = require('capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

var _dataConstructorParamsKeys = require('../data/constructorParamsKeys');

var _dataConstructorParamsKeys2 = _interopRequireDefault(_dataConstructorParamsKeys);

var _dataAudioParamProperties = require('../data/audioParamProperties');

var _dataAudioParamProperties2 = _interopRequireDefault(_dataAudioParamProperties);

var _dataSetters = require('../data/setters');

var _dataSetters2 = _interopRequireDefault(_dataSetters);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

function update(virtualNode) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (virtualNode.isCustomVirtualNode) {
    (function () {
      var audioGraphParamsFactoryValues = Object.values(virtualNode.audioGraphParamsFactory(params));
      Object.values(virtualNode.virtualNodes).forEach(function (childVirtualNode, i) {
        return update(childVirtualNode, audioGraphParamsFactoryValues[i][2]);
      });
    })();
  } else {
    Object.keys(params).forEach(function (key) {
      if (_dataConstructorParamsKeys2['default'].indexOf(key) !== -1) {
        return;
      }
      var param = params[key];
      if (virtualNode.params && virtualNode.params[key] === param) {
        return;
      }
      if (_dataAudioParamProperties2['default'].indexOf(key) !== -1) {
        if (Array.isArray(param)) {
          if (virtualNode.params && !(0, _deepEqual2['default'])(param, virtualNode.params[key], { strict: true })) {
            virtualNode.audioNode[key].cancelScheduledValues(0);
          }
          var callMethod = function callMethod(_ref) {
            var _virtualNode$audioNode$key;

            var _ref2 = _toArray(_ref);

            var methodName = _ref2[0];

            var args = _ref2.slice(1);

            return (_virtualNode$audioNode$key = virtualNode.audioNode[key])[methodName].apply(_virtualNode$audioNode$key, _toConsumableArray(args));
          };
          Array.isArray(param[0]) ? param.forEach(callMethod) : callMethod(param);
          return;
        }
        virtualNode.audioNode[key].value = param;
        return;
      }
      if (_dataSetters2['default'].indexOf(key) !== -1) {
        var _virtualNode$audioNode;

        (_virtualNode$audioNode = virtualNode.audioNode)['set' + (0, _capitalize2['default'])(key)].apply(_virtualNode$audioNode, _toConsumableArray(param));
        return;
      }
      virtualNode.audioNode[key] = param;
    });
  }
  virtualNode.params = params;
  return virtualNode;
}

module.exports = exports['default'];