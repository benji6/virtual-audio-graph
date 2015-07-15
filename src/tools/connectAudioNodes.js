const {find, filter, forEach, propEq} = require('ramda');
const asArray = require('./asArray');

module.exports = function (CustomVirtualAudioNode, handleConnectionToOutput = ()=>{}) {
  forEach((virtualAudioNode) =>
    forEach((connection) => {
      if (connection === 'output')
        return handleConnectionToOutput(virtualAudioNode);

      if (Object.prototype.toString.call(connection) === '[object Object]') {
        const {id, destination} = connection;
        const destinationVirtualAudioNode = find(propEq(id, 'id'))(this.virtualNodes);

        return virtualAudioNode.connect(destinationVirtualAudioNode.audioNode[destination]);
      }

      const destinationVirtualAudioNode = find(propEq(connection, 'id'))(this.virtualNodes);

      if (destinationVirtualAudioNode instanceof CustomVirtualAudioNode)
        return forEach(virtualAudioNode.connect.bind(virtualAudioNode), destinationVirtualAudioNode.inputs);

      virtualAudioNode.connect(destinationVirtualAudioNode.audioNode);
    }, asArray(virtualAudioNode.output)), filter(propEq(false, 'connected'), this.virtualNodes));
};
