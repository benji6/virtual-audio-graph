const capitalize = require('capitalize');
const {contains, forEach, keys, omit, zipWith} = require('ramda');
const constructorParamsKeys = require('../data/constructorParamsKeys');
const audioParamProperties = require('../data/audioParamProperties');
const setters = require('../data/setters');

module.exports = function update (virtualNode, params) {
  if (virtualNode.isCustomVirtualNode) {
    return zipWith((virtualNode, {params}) => update(virtualNode, params),
                   virtualNode.virtualNodes,
                   virtualNode.audioGraphParamsFactory(params));
  }
  params = omit(constructorParamsKeys, params);
  forEach((key) => {
    const param = params[key];
    if (virtualNode.params && virtualNode.params[key] === param) return;
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
};
