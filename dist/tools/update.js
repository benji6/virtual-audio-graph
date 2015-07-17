'use strict';

var capitalize = require('capitalize');

var _require = require('ramda');

var contains = _require.contains;
var forEach = _require.forEach;
var keys = _require.keys;
var omit = _require.omit;
var zipWith = _require.zipWith;

var constructorParamsKeys = require('../data/constructorParamsKeys');
var audioParamProperties = require('../data/audioParamProperties');
var setters = require('../data/setters');

module.exports = function update(virtualNode, params) {
  if (virtualNode.isCustomVirtualNode) {
    return zipWith(function (childVirtualNode, _ref) {
      var params = _ref.params;
      return update(childVirtualNode, params);
    }, virtualNode.virtualNodes, virtualNode.audioGraphParamsFactory(params));
  }
  params = omit(constructorParamsKeys, params);
  forEach(function (key) {
    var param = params[key];
    if (virtualNode.params && virtualNode.params[key] === param) {
      return;
    }
    if (contains(key, audioParamProperties)) {
      virtualNode.audioNode[key].value = param;
      return;
    }
    if (contains(key, setters)) {
      virtualNode.audioNode['set' + capitalize(key)].apply(virtualNode.audioNode, param);
      return;
    }
    virtualNode.audioNode[key] = param;
  }, keys(omit(constructorParamsKeys, params)));
};