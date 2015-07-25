module.exports = function (params) {
  params = params || {};
  var decay = params.decay !== undefined ? params.decay : 1 / 3;
  var delayTime = params.delayTime !== undefined ? params.delayTime : 1 / 3;
  var maxDelayTime = params.maxDelayTime !== undefined ? params.maxDelayTime : 1 / 3;

  return {
    zero: {
      node: 'stereoPanner',
      output: 'output',
      params: {
        pan: -1,
      },
    },
    1: {
      node: 'stereoPanner',
      output: 'output',
      params: {
        pan: 1,
      },
    },
    2: {
      node: 'delay',
      output: [1, 5],
      params: {
        maxDelayTime: maxDelayTime,
        delayTime: delayTime,
      },
    },
    3: {
      node: 'gain',
      output: 2,
      params: {
        gain: decay,
      },
    },
    4: {
      node: 'delay',
      output: ['zero', 3],
      params: {
        maxDelayTime: maxDelayTime,
        delayTime: delayTime,
      },
    },
    five: {
      input: 'input',
      node: 'gain',
      output: 4,
      params: {
        gain: decay,
      },
    },
  };
};
