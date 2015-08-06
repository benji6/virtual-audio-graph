const asArray = require('./asArray');
const mapObj = require('./mapObj');

module.exports = (virtualNode, destination) => {
  if (virtualNode.isCustomVirtualNode) {
    mapObj(childVirtualNode => {
      const {output} = childVirtualNode;
      if (asArray(output).indexOf('output') !== -1) {
        childVirtualNode.audioNode.connect(destination);
      }
    }, virtualNode.virtualNodes);
  } else {
    virtualNode.audioNode.connect(destination);
  }
  virtualNode.connected = true;
};
