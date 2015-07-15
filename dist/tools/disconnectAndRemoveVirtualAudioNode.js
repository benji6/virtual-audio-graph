'use strict';

var _require = require('ramda');

var findIndex = _require.findIndex;
var propEq = _require.propEq;
var remove = _require.remove;

module.exports = function (virtualNode) {
  virtualNode.disconnect();
  this.virtualNodes = remove(findIndex(propEq(virtualNode.id, 'id'))(this.virtualNodes), 1, this.virtualNodes);
};