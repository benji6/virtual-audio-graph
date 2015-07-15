'use strict';

var _require = require('ramda');

var differenceWith = _require.differenceWith;
var eqProps = _require.eqProps;
var forEach = _require.forEach;

var disconnectAndRemoveVirtualAudioNode = require('./disconnectAndRemoveVirtualAudioNode');

module.exports = function (virtualAudioNodeParams) {
  var virtualNodesToBeRemoved = differenceWith(eqProps('id'), this.virtualNodes, virtualAudioNodeParams);

  forEach(disconnectAndRemoveVirtualAudioNode.bind(this), virtualNodesToBeRemoved);

  return virtualAudioNodeParams;
};