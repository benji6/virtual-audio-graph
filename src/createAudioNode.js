const capitalizeFirst = (str) => str[0].toUpperCase() + str.slice(1);

const namesToParamsKey = {
  delay: 'maxDelayTime',
};

module.exports = (audioContext, name, constructorParams) => {
  const constructorParamsKey = namesToParamsKey[name];
  const audioNode = constructorParamsKey ?
    audioContext['create' + capitalizeFirst(name)](constructorParams[constructorParamsKey]) :
    audioContext['create' + capitalizeFirst(name)]();
  if (name === 'oscillator') {
    audioNode.start();
  }
  return audioNode;
};
