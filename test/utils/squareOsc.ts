import * as V from "../../src";

export default V.createNode(
  ({
    frequency,
    gain,
    startTime,
    stopTime,
  }: {
    frequency: number;
    gain: number;
    startTime: number;
    stopTime: number;
  }) => ({
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
  }),
);
