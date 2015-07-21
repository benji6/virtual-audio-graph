'use strict';

var _require = require('ramda');

var find = _require.find;
var filter = _require.filter;
var forEach = _require.forEach;
var pluck = _require.pluck;
var propEq = _require.propEq;

var asArray = require('./asArray');
var connect = require('./connect');

module.exports = function (virtualNodes) {
  var handleConnectionToOutput = arguments[1] === undefined ? function () {} : arguments[1];

  forEach(function (virtualAudioNode) {
    return forEach(function (connection) {
      if (connection === 'output') {
        return handleConnectionToOutput(virtualAudioNode);
      }

      if (Object.prototype.toString.call(connection) === '[object Object]') {
        var id = connection.id;
        var destination = connection.destination;

        var _destinationVirtualAudioNode = find(propEq('id', id))(virtualNodes);

        return connect(virtualAudioNode, _destinationVirtualAudioNode.audioNode[destination]);
      }

      var destinationVirtualAudioNode = find(propEq('id', connection))(virtualNodes);

      if (destinationVirtualAudioNode.isCustomVirtualNode) {
        return forEach(connect(virtualAudioNode), pluck('audioNode', filter(propEq('input', 'input'), destinationVirtualAudioNode.virtualNodes)));
      }

      connect(virtualAudioNode, destinationVirtualAudioNode.audioNode);
    }, asArray(virtualAudioNode.output));
  }, filter(propEq('connected', false), virtualNodes));
};