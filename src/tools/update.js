const capitalize = require('capitalize');
const {omit, zipWith} = require('ramda');
const constructorParamsKeys = require('../data/constructorParamsKeys');
const audioParamProperties = require('../data/audioParamProperties');
const setters = require('../data/setters');

const values = obj => Object.keys(obj).map(key => obj[key]);

module.exports = function update (virtualNode, params = {}) {
  if (virtualNode.isCustomVirtualNode) {
    zipWith((childVirtualNode, {params}) => update(childVirtualNode, params),
            values(virtualNode.virtualNodes),
            values(virtualNode.audioGraphParamsFactory(params)));
  } else {
    Object.keys(omit(constructorParamsKeys, params))
      .forEach(key => {
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
