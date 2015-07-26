const {contains, curry, mapObj} = require('ramda');
const asArray = require('./asArray');

module.exports = curry((virtualNode, destination) => {
  if (virtualNode.isCustomVirtualNode) {
    mapObj(childVirtualNode => {
      const {output} = childVirtualNode;
      if (contains('output', asArray(output))) {
        childVirtualNode.audioNode.connect(destination);
      }
    }, virtualNode.virtualNodes);
  } else {
    virtualNode.audioNode.connect(destination);
  }
  virtualNode.connected = true;
});
