'use strict';

var capitalize = require('capitalize');
var constructorParamsKeys = require('../data/constructorParamsKeys');
var audioParamProperties = require('../data/audioParamProperties');
var setters = require('../data/setters');

var values = function values(obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
};

module.exports = function update(virtualNode) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (virtualNode.isCustomVirtualNode) {
    (function () {
      var audioGraphParamsFactoryValues = values(virtualNode.audioGraphParamsFactory(params));
      Object.keys(virtualNode.virtualNodes).forEach(function (key, i) {
        var childVirtualNode = virtualNode.virtualNodes[key];
        update(childVirtualNode, audioGraphParamsFactoryValues[i].params);
      });
    })();
  } else {
    Object.keys(params).forEach(function (key) {
      if (constructorParamsKeys.indexOf(key) !== -1) {
        return;
      }
      var param = params[key];
      if (virtualNode.params && virtualNode.params[key] === param) {
        return;
      }
      if (audioParamProperties.indexOf(key) !== -1) {
        virtualNode.audioNode[key].value = param;
        return;
      }
      if (setters.indexOf(key) !== -1) {
        virtualNode.audioNode['set' + capitalize(key)].apply(virtualNode.audioNode, param);
        return;
      }
      virtualNode.audioNode[key] = param;
    });
  }
  virtualNode.params = params;
  return virtualNode;
};