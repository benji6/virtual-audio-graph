import createVirtualAudioGraph, * as V from "../../src";

const audioContext = new AudioContext();
const virtualAudioGraph = createVirtualAudioGraph({ audioContext });

describe("error throwing with update", () => {
  test("throws an error if no output is provided", () => {
    expect(() => virtualAudioGraph.update({ 0: (V.gain as any)() })).toThrow();
  });

  test("throws an error when virtual node name property is not recognised", () => {
    expect(() =>
      virtualAudioGraph.update({ 0: (V as any).foobar("output") })
    ).toThrow();
  });

  test('throws an error when id is "output"', () => {
    expect(() =>
      virtualAudioGraph.update({ output: V.gain("output") })
    ).toThrow();
  });

  test('throws an error when id is "output"', () => {
    expect(() =>
      virtualAudioGraph.update({
        0: V.oscillator("output"),
        1: undefined,
      })
    ).toThrow();

    expect(() =>
      virtualAudioGraph.update({
        0: V.oscillator("output"),
        1: null,
      })
    ).toThrow();
  });

  test("throws an error when output is an object and key is not specified", () => {
    expect(() =>
      virtualAudioGraph.update({
        0: V.gain(["output"], { gain: 0.2 }),
        1: V.oscillator(0, { frequency: 120 }),
        2: (V.gain as any)({ destination: "frequency", id: 1 }, { gain: 1024 }),
        3: V.oscillator(2, { frequency: 100 }),
      })
    ).toThrow();
  });

  test("throws an error when output is an object and key is not specified", () => {
    const params = { numberOfOutputs: 2 };

    expect(() =>
      virtualAudioGraph.update({
        0: V.channelMerger("output", params),
        1: V.oscillator("output"),
        2: (V.channelSplitter as any)(
          { inputs: [1, 0], key: 0, outputs: [0, 1, 2] },
          params
        ),
      })
    ).toThrow();
  });
});
