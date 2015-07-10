const {find, filter, forEach, propEq, keys} = require('ramda');
const asArray = require('./asArray');

module.exports = (CustomVirtualAudioNode, virtualAudioNodes, handleConnectionToOutput = ()=>{}) =>
  forEach((virtualAudioNode) =>
    forEach((connection) => {
      if (connection === 'output')
        return handleConnectionToOutput(virtualAudioNode);

      if (Object.prototype.toString.call(connection) === '[object Object]') {
        const {id, destination} = connection;
        const destinationVirtualAudioNode = find(propEq('id', id))(virtualAudioNodes);

        return virtualAudioNode.connect(destinationVirtualAudioNode.audioNode[destination]);
      }

      const destinationVirtualAudioNode = find(propEq('id', connection))(virtualAudioNodes);

      if (destinationVirtualAudioNode instanceof CustomVirtualAudioNode)
        return forEach(virtualAudioNode.connect.bind(virtualAudioNode), destinationVirtualAudioNode.inputs);

      virtualAudioNode.connect(destinationVirtualAudioNode.audioNode);
    }, asArray(virtualAudioNode.output)), filter(propEq('connected', false), virtualAudioNodes));
