module.exports = function (params) {
  params = params || {};
  var decay = params.decay !== undefined ? params.decay : 1 / 3;
  var delayTime = params.delayTime !== undefined ? params.delayTime : 1 / 3;
  var maxDelayTime = params.maxDelayTime !== undefined ? params.maxDelayTime : 1 / 3;

  return [
    {
      id: 0,
      node: 'stereoPanner',
      output: 'output',
      params: {
        pan: -1,
      },
    },
    {
      id: 1,
      node: 'stereoPanner',
      output: 'output',
      params: {
        pan: 1,
      },
    },
    {
      id: 2,
      node: 'delay',
      output: [1, 5],
      params: {
        maxDelayTime: maxDelayTime,
        delayTime: delayTime,
      },
    },
    {
      id: 3,
      node: 'gain',
      output: 2,
      params: {
        gain: decay,
      },
    },
    {
      id: 4,
      node: 'delay',
      output: [0, 3],
      params: {
        maxDelayTime: maxDelayTime,
        delayTime: delayTime,
      },
    },
    {
      id: 5,
      input: 'input',
      node: 'gain',
      output: 4,
      params: {
        gain: decay,
      },
    },
  ];
};
