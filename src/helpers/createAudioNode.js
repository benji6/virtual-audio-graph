import capitalize from 'capitalize';
import startAndStopNodes from '../data/startAndStopNodes';

const namesToParamsKey = {
  delay: 'maxDelayTime',
};

export default (audioContext, name, constructorParams, {startTime, stopTime}) => {
  const constructorParamsKey = namesToParamsKey[name];
  const audioNode = constructorParamsKey ?
    audioContext[`create${capitalize(name)}`](constructorParams[constructorParamsKey]) :
    audioContext[`create${capitalize(name)}`]();
  if (startAndStopNodes.indexOf(name) !== -1) {
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
