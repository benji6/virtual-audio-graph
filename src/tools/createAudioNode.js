const capitalize = require('capitalize');
const {isNil} = require('ramda');

const namesToParamsKey = {
  delay: 'maxDelayTime',
};

module.exports = (audioContext, name, constructorParams, {startTime, stopTime}) => {
  const constructorParamsKey = namesToParamsKey[name];
  const audioNode = constructorParamsKey ?
    audioContext[`create${capitalize(name)}`](constructorParams[constructorParamsKey]) :
    audioContext[`create${capitalize(name)}`]();
  if (name === 'oscillator') {
    if (isNil(startTime)) {
      audioNode.start();
    } else {
      audioNode.start(startTime);
    }
    if (!isNil(stopTime)) {
      audioNode.stop(stopTime);
    }
  }
  return audioNode;
};
