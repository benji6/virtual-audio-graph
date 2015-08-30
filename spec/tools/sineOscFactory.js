export default ({gain, frequency, startTime, stopTime}) => ({
  0: {
    output: ['output'],
    node: 'gain',
    params: {gain},
  },
  1: {
    output: 0,
    node: 'oscillator',
    params: {
      frequency,
      type: 'sine',
      startTime,
      stopTime,
    },
  },
});
