const {find, forEach, propEq} = require('ramda');

module.exports = (CustomVirtualAudioNode, virtualAudioNodes, handleConnectionToOutput = ()=>{}) =>
  forEach((virtualAudioNode) => {
    forEach((connection) => {
      if (connection === 'output') {
        handleConnectionToOutput(virtualAudioNode);
      } else {
        const destinationVirtualAudioNode = find(propEq("id", connection))(virtualAudioNodes);
        if (destinationVirtualAudioNode instanceof CustomVirtualAudioNode) {
          forEach(virtualAudioNode.connect.bind(virtualAudioNode), destinationVirtualAudioNode.inputs);
        } else {
          virtualAudioNode.connect(destinationVirtualAudioNode.audioNode);
        }
      }
    }, virtualAudioNode.output);
  }, virtualAudioNodes);
