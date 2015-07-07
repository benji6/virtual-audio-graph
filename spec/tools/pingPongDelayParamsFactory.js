module.exports = (params = {}) => {
  let {decay, delayTime, maxDelayTime} = params;
  decay = decay !== undefined ? decay : 1 / 3;
  delayTime = delayTime !== undefined ? delayTime : 1 / 3;
  maxDelayTime = maxDelayTime !== undefined ? maxDelayTime : 1 / 3;

  return [
    {
      id: 0,
      node: 'stereoPanner',
      output: 'output',
      params: {
        pan: -1,
      }
    },
    {
      id: 1,
      node: 'stereoPanner',
      output: 'output',
      params: {
        pan: 1,
      }
    },
    {
      id: 2,
      node: 'delay',
      output: [1, 5],
      params: {
        maxDelayTime,
        delayTime,
      },
    },
    {
      id: 3,
      node: 'gain',
      output: 2,
      params: {
        gain: decay,
      }
    },
    {
      id: 4,
      node: 'delay',
      output: [0, 3],
      params: {
        maxDelayTime,
        delayTime,
      },
    },
    {
      id: 5,
      input: 'input',
      node: 'gain',
      output: 4,
      params: {
        gain: decay,
      }
    },
  ];
};
