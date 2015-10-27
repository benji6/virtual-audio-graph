import capitalize from 'capitalize';
import constructorParamsKeys from '../data/constructorParamsKeys';
import audioParamProperties from '../data/audioParamProperties';
import setters from '../data/setters';
import deepEqual from 'deep-equal';
import values from '../tools/values';

export default function update (virtualNode, params = {}) {
  if (virtualNode.isCustomVirtualNode) {
    const audioGraphParamsFactoryValues = values(virtualNode.audioGraphParamsFactory(params));
    values(virtualNode.virtualNodes)
      .forEach((childVirtualNode, i) => update(childVirtualNode, audioGraphParamsFactoryValues[i][2]));
  } else {
    Object.keys(params)
      .forEach(key => {
        if (constructorParamsKeys.indexOf(key) !== -1) {
          return;
        }
        const param = params[key];
        if (virtualNode.params && virtualNode.params[key] === param) {
          return;
        }
        if (audioParamProperties.indexOf(key) !== -1) {
          if (Array.isArray(param)) {
            if (virtualNode.params && !deepEqual(param, virtualNode.params[key], {strict: true})) {
              virtualNode.audioNode[key].cancelScheduledValues(0);
            }
            const callMethod = ([methodName, ...args]) => virtualNode.audioNode[key][methodName](...args);
            Array.isArray(param[0]) ?
              param.forEach(callMethod) :
              callMethod(param);
            return;
          }
          virtualNode.audioNode[key].value = param;
          return;
        }
        if (setters.indexOf(key) !== -1) {
          virtualNode.audioNode[`set${capitalize(key)}`](...param);
          return;
        }
        virtualNode.audioNode[key] = param;
      });
  }
  virtualNode.params = params;
  return virtualNode;
}
