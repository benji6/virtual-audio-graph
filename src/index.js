const namesToConstructors = {
  oscillator: require('./nodeConstructors/Oscillator'),
  gain: require('./nodeConstructors/Gain'),
};

class VirtualAudioGraph {
  constructor (audioContext = new AudioContext(), audioGraph = []) {
    this.audioContext = audioContext;
    this.audioGraph = audioGraph;
  }

  update ({name}) {
    const constructor = namesToConstructors[name];
    if (constructor === undefined) {
      throw new Error(`${name} is not recognised as an virtual-audio-node name`);
    }
    this.audioGraph.push(new constructor(this.audioContext).audioNode);
    return this;
  }
}

module.exports = VirtualAudioGraph;
