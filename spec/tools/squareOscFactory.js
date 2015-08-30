export default ({gain, frequency, startTime, stopTime}) => ({
  0: {
    output: 'output',
    node: 'gain',
    params: {gain},
  },
  1: {
    output: 0,
    node: 'oscillator',
    params: {
      frequency,
      type: 'square',
      startTime,
      stopTime,
    },
  },
  2: {
    output: 0,
    node: 'oscillator',
    params: {
      frequency,
      detune: 3,
      type: 'square',
      startTime,
      stopTime,
    },
  },
});
