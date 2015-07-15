'use strict';

var _require = require('ramda');

var find = _require.find;
var filter = _require.filter;
var forEach = _require.forEach;
var propEq = _require.propEq;

var asArray = require('./asArray');

module.exports = function (CustomVirtualAudioNode, virtualAudioNodes) {
  var handleConnectionToOutput = arguments[2] === undefined ? function () {} : arguments[2];
  return forEach(function (virtualAudioNode) {
    return forEach(function (connection) {
      if (connection === 'output') return handleConnectionToOutput(virtualAudioNode);

      if (Object.prototype.toString.call(connection) === '[object Object]') {
        var id = connection.id;
        var destination = connection.destination;

        var _destinationVirtualAudioNode = find(propEq(id, 'id'))(virtualAudioNodes);

        return virtualAudioNode.connect(_destinationVirtualAudioNode.audioNode[destination]);
      }

      var destinationVirtualAudioNode = find(propEq(connection, 'id'))(virtualAudioNodes);

      if (destinationVirtualAudioNode instanceof CustomVirtualAudioNode) return forEach(virtualAudioNode.connect.bind(virtualAudioNode), destinationVirtualAudioNode.inputs);

      virtualAudioNode.connect(destinationVirtualAudioNode.audioNode);
    }, asArray(virtualAudioNode.output));
  }, filter(propEq(false, 'connected'), virtualAudioNodes));
};