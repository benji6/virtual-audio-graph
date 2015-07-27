const {
  both, compose, difference, equals, forEach, ifElse, isNil, keys, partial, path, tap,
} = require('ramda');
const capitalize = require('capitalize');
const connect = require('./tools/connect');
const connectAudioNodes = require('./tools/connectAudioNodes');
const createVirtualAudioNode = require('./tools/createVirtualAudioNode');
const updateAudioNodeAndVirtualAudioGraph = require('./tools/updateAudioNodeAndVirtualAudioGraph');
import disconnect from './tools/disconnect';

const startTimePath = path(['params', 'startTime']);
const stopTimePath = path(['params', 'stopTime']);
const throwError = function (str) {
  throw new Error(str);
};

module.exports = class VirtualAudioGraph {
  constructor (params = {}) {
    this.audioContext = params.audioContext || new AudioContext();
    this.output = params.output || this.audioContext.destination;
    this.virtualNodes = {};
    this.customNodes = {};
  }

  get currentTime () {
    return this.audioContext.currentTime;
  }

  defineNode (customNodeParamsFactory, name) {
    if (this.audioContext[`create${capitalize(name)}`]) {
      throw new Error(`${name} is a standard audio node name and cannot be overwritten`);
    }

    this.customNodes[name] = customNodeParamsFactory;
    return this;
  }

  update (virtualGraphParams) {
    forEach(compose(id => delete this.virtualNodes[id],
                    tap(id => disconnect(this.virtualNodes[id]))),
            difference(keys(this.virtualNodes),
                       keys(virtualGraphParams)));

    forEach(compose(ifElse(compose(isNil, path(['virtualAudioNode'])),
                           ({id, virtualAudioNodeParam}) =>
                             this.virtualNodes[id] = createVirtualAudioNode.call(this, virtualAudioNodeParam),
                           ({id, virtualAudioNode, virtualAudioNodeParam}) => {
                             if (startTimePath(virtualAudioNodeParam) !== startTimePath(virtualAudioNode) ||
                               stopTimePath(virtualAudioNodeParam) !== stopTimePath(virtualAudioNode)) {
                               disconnect(virtualAudioNode);
                               delete this.virtualNodes[id];
                             }
                             updateAudioNodeAndVirtualAudioGraph.call(this, virtualAudioNode, virtualAudioNodeParam);
                           }),
                    tap(({id, virtualAudioNodeParam}) => isNil(virtualAudioNodeParam.output) &&
                      throwError(`ouptput not specified for node id ${id}`)),
                    id => ({id,
                            virtualAudioNodeParam: virtualGraphParams[id],
                            virtualAudioNode: this.virtualNodes[id]}),
                    tap(both(equals('output'), partial(throwError, `'output' is not a valid id`)))),
            keys(virtualGraphParams));

    connectAudioNodes(this.virtualNodes,
                      virtualAudioNode => connect(virtualAudioNode,
                                                  this.output));

    return this;
  }
};
