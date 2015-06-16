module.exports = class Oscillator {
  constructor (audioContext, {id, connections}) {
    const audioNode = audioContext.createOscillator();
    audioNode.start();
    Object.assign(this, {
      audioNode,
      id,
      connections: Array.isArray(connections) ? connections : [connections],
    });
  }
};