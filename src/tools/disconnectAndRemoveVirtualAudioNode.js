const {findIndex, propEq, remove} = require('ramda');
const disconnect = require('./disconnect');

module.exports = function (virtualNode) {
  disconnect(virtualNode);
  this.virtualNodes = remove(findIndex(propEq('id', virtualNode.id))(this.virtualNodes), 1, this.virtualNodes);
};
