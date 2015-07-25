const {findIndex, propEq, remove} = require('ramda');
const disconnect = require('./disconnect');

module.exports = function (virtualNodes, virtualNode) {
  disconnect(virtualNode);
  virtualNodes = remove(findIndex(propEq('id', virtualNode.id))(virtualNodes), 1, virtualNodes);
};
