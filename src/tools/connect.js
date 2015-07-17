const {contains, curry, filter, forEach, pluck} = require('ramda');
const asArray = require('./asArray');

module.exports = curry((virtualNode, destination) => {
  if (virtualNode.isCustomVirtualNode) {
    const outputVirtualNodes = filter(({output}) => contains('output', asArray(output)), virtualNode.virtualNodes);
    forEach((audioNode) => audioNode.connect(destination), pluck('audioNode', outputVirtualNodes));
  } else {
    virtualNode.audioNode.connect(destination);
  }
  virtualNode.connected = true;
});
