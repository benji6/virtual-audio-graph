import createVirtualAudioGraph, * as V from "../../src";
import pingPongDelay from "../utils/pingPongDelay";
import sineOsc from "../utils/sineOsc";

const audioContext: any = new AudioContext();
const virtualAudioGraph = createVirtualAudioGraph({ audioContext });

describe("expected behavior with update", () => {
  test("returns itself", () => {
    const virtualNodeParams = { 0: V.oscillator(V.OUTPUT, { type: "square" }) };

    expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
  });

  test('backwards compatibility of using string "output" instead of exported OUTPUT constant', () => {
    virtualAudioGraph.update({ 1: V.oscillator("output") });
    expect(audioContext.toJSON()).toEqual({
      inputs: [
        {
          detune: { inputs: [], value: 0 },
          frequency: { inputs: [], value: 440 },
          inputs: [],
          name: "OscillatorNode",
          type: "sine",
        },
      ],
      name: "AudioDestinationNode",
    });
  });

  test("adds then removes nodes", () => {
    virtualAudioGraph.update({
      0: V.gain(V.OUTPUT),
      1: V.oscillator(0),
    });
    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({});
    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("handles random strings for ids", () => {
    virtualAudioGraph.update({
      bar: V.oscillator("foo"),
      foo: V.gain(V.OUTPUT),
    });
    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("handles simple updates", () => {
    virtualAudioGraph.update({});
    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({ 0: V.gain(V.OUTPUT) });
    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({ 0: V.oscillator(V.OUTPUT) });
    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({ 0: pingPongDelay(V.OUTPUT) });
    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("updates standard and custom nodes if passed same id but different params", () => {
    virtualAudioGraph.update({
      0: V.oscillator(V.OUTPUT, { detune: -9, frequency: 220 }),
    });
    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: V.oscillator(V.OUTPUT, { detune: 0, frequency: 880 }),
    });
    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: sineOsc(V.OUTPUT, { frequency: 110, gain: 0.5 }),
    });
    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: sineOsc(V.OUTPUT, { frequency: 660, gain: 0.2 }),
    });
    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("connects nodes to each other", () => {
    virtualAudioGraph.update({
      0: V.gain(V.OUTPUT),
      1: V.oscillator(0),
    });
    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: V.oscillator(V.OUTPUT),
    });
    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("reconnects nodes to each other", () => {
    virtualAudioGraph.update({
      0: V.gain(V.OUTPUT),
      1: V.oscillator(0),
    });
    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: V.gain(V.OUTPUT),
      1: V.oscillator(V.OUTPUT),
    });
    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("connects and reconnects nodes to audioParams", () => {
    virtualAudioGraph.update({
      0: V.gain(V.OUTPUT),
      1: V.oscillator(0),
      2: V.oscillator(
        { destination: "frequency", key: 1 },
        { frequency: 0.5, type: "triangle" },
      ),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: V.gain(V.OUTPUT),
      1: V.oscillator(0),
      2: V.oscillator([{ destination: "detune", key: 1 }], {
        frequency: 0.5,
        type: "triangle",
      }),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: V.oscillator(V.OUTPUT),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("disconnects and reconnects child nodes properly", () => {
    virtualAudioGraph.update({
      0: V.gain(V.OUTPUT),
      1: V.stereoPanner(0),
      2: V.gain(1),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: V.gain(V.OUTPUT),
      1: V.gain(0),
      2: V.gain(1),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();
  });
});
