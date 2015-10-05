export default ({gain, frequency, startTime, stopTime}) => ({
  0: ['gain', ['output'], {gain}],
  1: ['oscillator', 0, {frequency,
                        type: 'sine',
                        startTime,
                        stopTime}],
});
