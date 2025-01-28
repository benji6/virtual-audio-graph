import * as V from "../../src";

export default V.createNode((x) => {
  const params = x || {};
  const decay = params.decay || 1 / 3;
  const delayTime = params.delayTime || 1 / 3;
  const maxDelayTime = params.maxDelayTime || 1 / 3;

  return {
    1: V.stereoPanner(V.OUTPUT, { pan: 1 }),
    2: V.delay([1, "five"], { delayTime, maxDelayTime }),
    3: V.gain(2, { gain: decay }),
    4: V.delay(["zero", 3], { delayTime, maxDelayTime }),
    five: V.gain(4, { gain: decay }, "input"),
    zero: V.stereoPanner(V.OUTPUT, { pan: -1 }),
  };
});
