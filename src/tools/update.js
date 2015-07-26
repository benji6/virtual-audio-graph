const capitalize = require('capitalize');
const {contains, forEach, keys, omit, values, zipWith} = require('ramda');
const constructorParamsKeys = require('../data/constructorParamsKeys');
const audioParamProperties = require('../data/audioParamProperties');
const setters = require('../data/setters');

module.exports = function update (virtualNode, params = {}) {
  if (virtualNode.isCustomVirtualNode) {
    zipWith((childVirtualNode, {params}) => update(childVirtualNode, params),
            values(virtualNode.virtualNodes),
            values(virtualNode.audioGraphParamsFactory(params)));
  } else {
    forEach((key) => {
      const param = params[key];
      if (virtualNode.params && virtualNode.params[key] === param) {
        return;
      }
      if (contains(key, audioParamProperties)) {
        virtualNode.audioNode[key].value = param;
        return;
      }
      if (contains(key, setters)) {
        virtualNode.audioNode[`set${capitalize(key)}`].apply(virtualNode.audioNode, param);
        return;
      }
      virtualNode.audioNode[key] = param;
    }, keys(omit(constructorParamsKeys, params)));
  }
  virtualNode.params = params;
  return virtualNode;
};
