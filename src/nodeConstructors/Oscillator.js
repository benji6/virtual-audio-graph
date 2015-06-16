module.exports = class Oscillator {
  constructor (audioContext, {id, connections}) {
    Object.assign(this, {
      audioNode: audioContext.createOscillator(),
      id,
      connections: Array.isArray(connections) ? connections : [connections],
    });
  }
};