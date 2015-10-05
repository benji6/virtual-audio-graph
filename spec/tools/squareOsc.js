export default ({gain, frequency, startTime, stopTime}) => ({
  0: ['gain', 'output', {gain}],
  1: ['oscillator', 0, {frequency,
                        type: 'square',
                        startTime,
                        stopTime}],
  2: ['oscillator', 0, {frequency,
                        detune: 3,
                        type: 'square',
                        startTime,
                        stopTime}],
});
