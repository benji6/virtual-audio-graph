'use strict';

var _require = require('ramda');

var find = _require.find;
var forEach = _require.forEach;
var propEq = _require.propEq;

module.exports = function (CustomVirtualAudioNode, virtualAudioNodes) {
  var handleConnectionToOutput = arguments[2] === undefined ? function () {} : arguments[2];
  return forEach(function (virtualAudioNode) {
    forEach(function (connection) {
      if (connection === 'output') {
        handleConnectionToOutput(virtualAudioNode);
      } else {
        var destinationVirtualAudioNode = find(propEq('id', connection))(virtualAudioNodes);
        if (destinationVirtualAudioNode instanceof CustomVirtualAudioNode) {
          forEach(virtualAudioNode.connect.bind(virtualAudioNode), destinationVirtualAudioNode.inputs);
        } else {
          virtualAudioNode.connect(destinationVirtualAudioNode.audioNode);
        }
      }
    }, virtualAudioNode.output);
  }, virtualAudioNodes);
};