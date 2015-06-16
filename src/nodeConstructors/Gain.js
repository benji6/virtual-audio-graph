module.exports = class Gain {
  constructor (audioContext) {
    this.audioNode = audioContext.createGain();
  }
};
