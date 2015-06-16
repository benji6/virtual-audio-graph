module.exports = class Gain {
  constructor (audioContext, {id, connections}) {
    Object.assign(this, {
      audioNode: audioContext.createGain(),
      id,
      connections: Array.isArray(connections) ? connections : [connections],
    });
  }
};
