const {find, filter, forEach, pluck, propEq} = require('ramda');
const asArray = require('./asArray');
const connect = require('./connect');

module.exports = function (handleConnectionToOutput = ()=>{}) {
  forEach((virtualAudioNode) =>
    forEach((connection) => {
      if (connection === 'output')
        return handleConnectionToOutput(virtualAudioNode);

      if (Object.prototype.toString.call(connection) === '[object Object]') {
        const {id, destination} = connection;
        const destinationVirtualAudioNode = find(propEq(id, 'id'))(this.virtualNodes);

        return connect(virtualAudioNode,
                       destinationVirtualAudioNode.audioNode[destination]);
      }

      const destinationVirtualAudioNode = find(propEq(connection, 'id'))(this.virtualNodes);

      if (destinationVirtualAudioNode.isCustomVirtualNode)
        return forEach(connect(virtualAudioNode),
                       pluck('audioNode',
                             filter(propEq('input', 'input'),
                                    destinationVirtualAudioNode.virtualNodes)));

      connect(virtualAudioNode, destinationVirtualAudioNode.audioNode);
    }, asArray(virtualAudioNode.output)), filter(propEq(false, 'connected'),
                                                 this.virtualNodes));
};
