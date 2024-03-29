import createVirtualAudioGraph, * as V from "../../src";
import pingPongDelay from "../utils/pingPongDelay";
import sineOsc from "../utils/sineOsc";

const audioContext: any = new AudioContext();
const virtualAudioGraph = createVirtualAudioGraph({ audioContext });

describe("expected behavior with update", () => {
  test("returns itself", () => {
    const virtualNodeParams = { 0: V.oscillator("output", { type: "square" }) };

    expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
  });

  test("adds then removes nodes", () => {
    virtualAudioGraph.update({
      0: V.gain("output"),
      1: V.oscillator(0),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({});

    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("handles random strings for ids", () => {
    virtualAudioGraph.update({
      bar: V.oscillator("foo"),
      foo: V.gain("output"),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({});

    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("handles random strings for ids", () => {
    virtualAudioGraph.update({ 0: V.gain("output") });

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({ 0: V.oscillator("output") });

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({ 0: pingPongDelay("output") });

    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("updates standard and custom nodes if passed same id but different params", () => {
    virtualAudioGraph.update({
      0: V.oscillator("output", { detune: -9, frequency: 220 }),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: V.oscillator("output", { detune: 0, frequency: 880 }),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: sineOsc("output", { frequency: 110, gain: 0.5 }),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: sineOsc("output", { frequency: 660, gain: 0.2 }),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("connects nodes to each other", () => {
    virtualAudioGraph.update({
      0: V.gain("output"),
      1: V.oscillator(0),
    });
    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: V.oscillator("output"),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("reconnects nodes to each other", () => {
    virtualAudioGraph.update({
      0: V.gain("output"),
      1: V.oscillator(0),
    });
    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: V.gain("output"),
      1: V.oscillator("output"),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("connects and reconnects nodes to audioParams", () => {
    virtualAudioGraph.update({
      0: V.gain("output"),
      1: V.oscillator(0),
      2: V.oscillator(
        { destination: "frequency", key: 1 },
        { frequency: 0.5, type: "triangle" },
      ),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: V.gain("output"),
      1: V.oscillator(0),
      2: V.oscillator([{ destination: "detune", key: 1 }], {
        frequency: 0.5,
        type: "triangle",
      }),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: V.oscillator("output"),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("disconnects and reconnects child nodes properly", () => {
    virtualAudioGraph.update({
      0: V.gain("output"),
      1: V.stereoPanner(0),
      2: V.gain(1),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: V.gain("output"),
      1: V.gain(0),
      2: V.gain(1),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();
  });
});
