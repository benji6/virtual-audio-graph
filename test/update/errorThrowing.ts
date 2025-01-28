import createVirtualAudioGraph, * as V from "../../src";

const audioContext = new AudioContext();
const virtualAudioGraph = createVirtualAudioGraph({ audioContext });

describe("error throwing with update", () => {
  test("throws an error if no output is provided", () => {
    expect(() => virtualAudioGraph.update({ 0: (V.gain as any)() })).toThrow();
  });

  test("throws an error when virtual node name property is not recognised", () => {
    expect(() =>
      virtualAudioGraph.update({ 0: (V as any).foobar(V.OUTPUT) }),
    ).toThrow();
  });

  test("throws error if node ID is OUTPUT", () => {
    expect(() =>
      virtualAudioGraph.update({
        [V.OUTPUT]: V.oscillator(V.OUTPUT),
      }),
    ).toThrow(
      '"output" is a virtual-audio-graph reserved string and therefore not a valid node ID',
    );
  });

  test('throws error if node ID is "output"', () => {
    expect(() =>
      virtualAudioGraph.update({
        output: V.oscillator(V.OUTPUT),
      }),
    ).toThrow(
      '"output" is a virtual-audio-graph reserved string and therefore not a valid node ID',
    );
  });

  test("throws error if output string id is null", () => {
    expect(() =>
      virtualAudioGraph.update({
        bar: V.oscillator(null as any),
        foo: V.gain(V.OUTPUT),
      }),
    ).toThrow("Output not specified for oscillator");
  });

  test("throws error if output object key is null", () => {
    expect(() =>
      virtualAudioGraph.update({
        bar: V.oscillator({ key: null } as any),
        foo: V.gain(V.OUTPUT),
      }),
    ).toThrow('node with ID "bar" does not specify an output');
  });

  test("throws error if output string id is not a node ID", () => {
    expect(() =>
      virtualAudioGraph.update({
        bar: V.oscillator("baz"),
        foo: V.gain(V.OUTPUT),
      }),
    ).toThrow(
      'node with ID "bar" specifies an output ID "baz", but no such node exists',
    );
  });

  test("throws error if output object key is not a node ID", () => {
    expect(() =>
      virtualAudioGraph.update({
        bar: V.oscillator({ key: "baz" }),
        foo: V.gain(V.OUTPUT),
      }),
    ).toThrow(
      'node with ID "bar" specifies an output ID "baz", but no such node exists',
    );
  });

  test("throws an error when node is `undefined` or `null`", () => {
    expect(() =>
      virtualAudioGraph.update({
        0: V.oscillator(V.OUTPUT),
        1: undefined,
      } as any),
    ).toThrow();

    expect(() =>
      virtualAudioGraph.update({
        0: V.oscillator(V.OUTPUT),
        1: null,
      } as any),
    ).toThrow();
  });

  test('throws an error when id is "output"', () => {
    expect(() =>
      virtualAudioGraph.update({
        0: V.oscillator("output"),
        1: undefined,
      } as any),
    ).toThrow();

    expect(() =>
      virtualAudioGraph.update({
        0: V.oscillator("output"),
        1: null,
      } as any),
    ).toThrow();
  });

  test("throws an error when output is an object and key is not specified", () => {
    expect(() =>
      virtualAudioGraph.update({
        0: V.gain([V.OUTPUT], { gain: 0.2 }),
        1: V.oscillator(0, { frequency: 120 }),
        2: (V.gain as any)({ destination: "frequency", id: 1 }, { gain: 1024 }),
        3: V.oscillator(2, { frequency: 100 }),
      }),
    ).toThrow();
  });

  test("throws an error when output is an object and key is not specified", () => {
    const params = { numberOfOutputs: 2 };

    expect(() =>
      virtualAudioGraph.update({
        0: V.channelMerger(V.OUTPUT, params),
        1: V.oscillator(V.OUTPUT),
        2: (V.channelSplitter as any)(
          { inputs: [1, 0], key: 0, outputs: [0, 1, 2] },
          params,
        ),
      }),
    ).toThrow();
  });
});
