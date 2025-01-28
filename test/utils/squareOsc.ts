import * as V from "../../src";

export default V.createNode((params) => {
  const frequency = params.frequency;
  const gain = params.gain;
  const startTime = params.startTime;
  const stopTime = params.stopTime;

  return {
    0: V.gain(V.OUTPUT, { gain }),
    1: V.oscillator(0, {
      frequency,
      startTime,
      stopTime,
      type: "square",
    }),
    2: V.oscillator(0, {
      detune: 3,
      frequency,
      startTime,
      stopTime,
      type: "square",
    }),
  };
});
