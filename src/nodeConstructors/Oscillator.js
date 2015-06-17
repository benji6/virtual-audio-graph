module.exports = class Oscillator {
  constructor (audioContext, {id, connections, params = {}}) {
    const audioNode = audioContext.createOscillator();
    audioNode.start();
    if (params.type) {
      audioNode.type = params.type;
    }
    Object.assign(this, {
      audioNode,
      id,
      connections: Array.isArray(connections) ? connections : [connections],
    });
  }
};
