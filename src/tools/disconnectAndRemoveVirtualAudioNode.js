const disconnect = require('./disconnect');

module.exports = function (virtualNode) {
  disconnect(virtualNode);
  delete this.virtualNodes[virtualNode.id];
};
