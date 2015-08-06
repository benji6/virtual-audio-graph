const capitalize = require('capitalize');
const constructorParamsKeys = require('../data/constructorParamsKeys');
const audioParamProperties = require('../data/audioParamProperties');
const setters = require('../data/setters');

const values = obj => Object.keys(obj).map(key => obj[key]);

module.exports = function update (virtualNode, params = {}) {
  if (virtualNode.isCustomVirtualNode) {
    const audioGraphParamsFactoryValues = values(virtualNode.audioGraphParamsFactory(params));
    values(virtualNode.virtualNodes)
      .forEach((childVirtualNode, i) =>
        update(childVirtualNode, audioGraphParamsFactoryValues[i].params));
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
          virtualNode.audioNode[`set${capitalize(key)}`].apply(virtualNode.audioNode, param);
          return;
        }
        virtualNode.audioNode[key] = param;
      });
  }
  virtualNode.params = params;
  return virtualNode;
};
