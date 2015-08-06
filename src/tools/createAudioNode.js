const capitalize = require('capitalize');

const namesToParamsKey = {
  delay: 'maxDelayTime',
};

module.exports = (audioContext, name, constructorParams, {startTime, stopTime}) => {
  const constructorParamsKey = namesToParamsKey[name];
  const audioNode = constructorParamsKey ?
    audioContext[`create${capitalize(name)}`](constructorParams[constructorParamsKey]) :
    audioContext[`create${capitalize(name)}`]();
  if (name === 'oscillator') {
    if (startTime == null) {
      audioNode.start();
    } else {
      audioNode.start(startTime);
    }
    if (stopTime != null) {
      audioNode.stop(stopTime);
    }
  }
  return audioNode;
};
