const virtualAudioNodeNamesToAudioNodeCreators = {
  oscillator: 'createOscillator',
  gain: 'createGain',
};

module.exports = (audioContext, name) => {
  const audioNode = audioContext[virtualAudioNodeNamesToAudioNodeCreators[name]]();
  if (name === 'oscillator') {
    audioNode.start();
  }
  return audioNode;
};
