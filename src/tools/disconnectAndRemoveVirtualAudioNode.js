const {findIndex, propEq, remove} = require('ramda');
const disconnect = require('./disconnect');

module.exports = function (virtualNode) {
  disconnect(virtualNode);
  this.virtualNodes = remove(findIndex(propEq(virtualNode.id, 'id'))(this.virtualNodes), 1, this.virtualNodes);
};
