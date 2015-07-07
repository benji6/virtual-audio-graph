const capitalize = require('capitalize');

const namesToParamsKey = {
  delay: 'maxDelayTime',
};

module.exports = (audioContext, name, constructorParams) => {
  const constructorParamsKey = namesToParamsKey[name];
  const audioNode = constructorParamsKey ?
    audioContext[`create${capitalize(name)}`](constructorParams[constructorParamsKey]) :
    audioContext[`create${capitalize(name)}`]();
  if (name === 'oscillator') {
    audioNode.start();
  }
  return audioNode;
};
