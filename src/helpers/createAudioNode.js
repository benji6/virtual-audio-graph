import {capitalize} from '../tools';
import startAndStopNodes from '../data/startAndStopNodes';

export default (audioContext, name, constructorParam, {startTime, stopTime}) => {
  const audioNode = constructorParam ?
    audioContext[`create${capitalize(name)}`](constructorParam) :
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
