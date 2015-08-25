import capitalize from 'capitalize';
import constructorParamsKeys from '../data/constructorParamsKeys';
import audioParamProperties from '../data/audioParamProperties';
import setters from '../data/setters';

const values = obj => Object.keys(obj).map(key => obj[key]);

export default function update (virtualNode, params = {}) {
  if (virtualNode.isCustomVirtualNode) {
    const audioGraphParamsFactoryValues = values(virtualNode.audioGraphParamsFactory(params));
    Object.keys(virtualNode.virtualNodes)
      .forEach((key, i) => {
        const childVirtualNode = virtualNode.virtualNodes[key];
        update(childVirtualNode, audioGraphParamsFactoryValues[i].params);
      });
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
