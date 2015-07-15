const {findIndex, propEq, remove} = require('ramda');

module.exports = function (virtualNode) {
  virtualNode.disconnect();
  this.virtualNodes = remove(findIndex(propEq(virtualNode.id, 'id'))(this.virtualNodes), 1, this.virtualNodes);
};
