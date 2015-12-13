export default ({frequency = 440, startTime, stopTime}) => ({
  0: ['oscillator', 'output', {
    frequency,
    type: 'sine',
    startTime,
    stopTime,
  }],
});
