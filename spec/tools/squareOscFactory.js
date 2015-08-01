module.exports = function (params) {
  const gain = params.gain;
  const frequency = params.frequency;
  const startTime = params.startTime;
  const stopTime = params.stopTime;

  return {
    0: {
      output: 'output',
      node: 'gain',
      params: {
        gain: gain,
      },
    },
    1: {
      output: 0,
      node: 'oscillator',
      params: {
        frequency: frequency,
        type: 'square',
        startTime: startTime,
        stopTime: stopTime,
      },
    },
    2: {
      output: 0,
      node: 'oscillator',
      params: {
        frequency: frequency,
        detune: 3,
        type: 'square',
        startTime: startTime,
        stopTime: stopTime,
      },
    },
  };
};
