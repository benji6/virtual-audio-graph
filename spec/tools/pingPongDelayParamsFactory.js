export default ({
  decay = 1 / 3,
  delayTime = 1 / 3,
  maxDelayTime = 1 / 3,
} = {}) => ({
  zero: {
    node: 'stereoPanner',
    output: 'output',
    params: {pan: -1},
  },
  1: {
    node: 'stereoPanner',
    output: 'output',
    params: {pan: 1},
  },
  2: {
    node: 'delay',
    output: [1, 'five'],
    params: {
      maxDelayTime,
      delayTime,
    },
  },
  3: {
    node: 'gain',
    output: 2,
    params: {gain: decay},
  },
  4: {
    node: 'delay',
    output: ['zero', 3],
    params: {
      maxDelayTime,
      delayTime,
    },
  },
  five: {
    input: 'input',
    node: 'gain',
    output: 4,
    params: {gain: decay},
  },
});
