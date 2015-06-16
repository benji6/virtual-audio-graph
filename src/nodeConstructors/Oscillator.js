module.exports = class Oscillator {
  constructor (audioContext) {
    this.audioNode = audioContext.createOscillator();
  }
};
