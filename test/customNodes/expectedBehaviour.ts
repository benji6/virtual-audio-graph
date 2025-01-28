import createVirtualAudioGraph, * as V from "../../src";
import { oscillator } from "../../src";
import gainWithNoParams from "../utils/gainWithNoParams";
import pingPongDelay from "../utils/pingPongDelay";
import sineOsc from "../utils/sineOsc";
import squareOsc from "../utils/squareOsc";
import twoGains from "../utils/twoGains";

const audioContext: any = new AudioContext();
const virtualAudioGraph = createVirtualAudioGraph({ audioContext });

describe("custom nodes", () => {
  test("creates a custom node which can be reused in virtualAudioGraph.update", () => {
    const virtualGraphParams = {
      0: V.gain(V.OUTPUT, { gain: 0.5 }),
      1: pingPongDelay(0, { decay: 0.5, delayTime: 0.5, maxDelayTime: 0.5 }),
      2: V.oscillator(1),
    };

    expect(virtualAudioGraph.update(virtualGraphParams)).toBe(
      virtualAudioGraph,
    );
    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("can define a custom node built of other custom nodes", () => {
    const quietPingPongDelay = V.createNode(() => ({
      0: V.gain(V.OUTPUT),
      1: pingPongDelay(0),
      2: V.oscillator(1),
    }));

    const virtualGraphParams = {
      0: V.gain(V.OUTPUT, { gain: 0.5 }),
      1: quietPingPongDelay(0),
      2: pingPongDelay(1),
      3: V.oscillator(2),
    };

    expect(virtualAudioGraph.update(virtualGraphParams)).toBe(
      virtualAudioGraph,
    );
    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("can define a custom node which can be updated", () => {
    const virtualGraphParams = {
      0: V.gain(V.OUTPUT, { gain: 0.5 }),
      1: pingPongDelay(0, { decay: 0.5, delayTime: 0.5, maxDelayTime: 0.5 }),
      2: V.oscillator(1),
    };

    virtualAudioGraph.update(virtualGraphParams);

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: V.gain(V.OUTPUT, { gain: 0.5 }),
      1: pingPongDelay(0, { decay: 0.6, delayTime: 0.5, maxDelayTime: 0.5 }),
      2: V.oscillator(1),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("can define a custom node which can be removed", () => {
    const virtualGraphParams = {
      0: V.gain(V.OUTPUT, { gain: 0.5 }),
      1: pingPongDelay(0, { decay: 0.5, delayTime: 0.5, maxDelayTime: 0.5 }),
      2: V.oscillator(1),
    };

    virtualAudioGraph.update(virtualGraphParams);

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({ 0: V.gain(V.OUTPUT, { gain: 0.5 }) });

    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("can define a custom node which can be replaced with another on update", () => {
    virtualAudioGraph.update({
      0: V.gain(V.OUTPUT, { gain: 0.5 }),
      1: squareOsc(0, {
        frequency: 220,
        gain: 0.5,
        startTime: 1,
        stopTime: 2,
      }),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: V.gain(V.OUTPUT, { gain: 0.5 }),
      1: sineOsc(0, {
        frequency: 220,
        gain: 0.5,
        startTime: 1,
        stopTime: 2,
      }),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();

    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(2, sampleRate * 2, sampleRate);
    const reverb1 = V.createNode(() => ({
      0: V.gain(V.OUTPUT),
      1: V.convolver(0, { buffer }, "input"),
    }));
    const reverb2 = V.createNode(() => ({
      0: V.gain(V.OUTPUT, { gain: 0.5 }),
      1: V.convolver(0, { buffer }, "input"),
    }));

    virtualAudioGraph.update({
      0: reverb1(V.OUTPUT),
      1: V.gain(0),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();

    virtualAudioGraph.update({
      0: reverb2(V.OUTPUT),
      1: V.gain(0),
    });

    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("can define a custom node which has an input node with no params", () => {
    virtualAudioGraph.update({
      0: gainWithNoParams(V.OUTPUT),
      1: sineOsc(0, {
        frequency: 220,
        gain: 0.5,
        startTime: 1,
        stopTime: 2,
      }),
    });
    expect(audioContext.toJSON()).toMatchSnapshot();
  });

  test("can define custom nodes which can be reordered", () => {
    const expectedData: any = {
      inputs: [
        {
          gain: { inputs: [], value: 1 },
          inputs: [
            {
              gain: { inputs: [], value: 1 },
              inputs: [
                {
                  gain: { inputs: [], value: 1 },
                  inputs: [
                    {
                      gain: { inputs: [], value: 0.3 },
                      inputs: [
                        {
                          detune: { inputs: [], value: 0 },
                          frequency: { inputs: [], value: 500 },
                          inputs: [],
                          name: "OscillatorNode",
                          type: "sine",
                        },
                      ],
                      name: "GainNode",
                    },
                  ],
                  name: "GainNode",
                },
              ],
              name: "GainNode",
            },
          ],
          name: "GainNode",
        },
      ],
      name: "AudioDestinationNode",
    };

    virtualAudioGraph.update({
      "channel:0-type:effect-id:0": V.gain(V.OUTPUT),
      "channel:0-type:effect-id:1": twoGains("channel:0-type:effect-id:0"),
      "channel:[0]-type:source-id:keyboard: 7": sineOsc(
        ["channel:0-type:effect-id:1"],
        { frequency: 500, gain: 0.3 },
      ),
    });
    expect(audioContext.toJSON()).toEqual(expectedData);

    virtualAudioGraph.update({
      "channel:0-type:effect-id:0": V.gain("channel:0-type:effect-id:1"),
      "channel:0-type:effect-id:1": twoGains(V.OUTPUT),
      "channel:[0]-type:source-id:keyboard: 5": sineOsc(
        ["channel:0-type:effect-id:0"],
        { frequency: 500, gain: 0.3 },
      ),
    });
    expect(audioContext.toJSON()).toEqual(expectedData);

    virtualAudioGraph.update({
      "channel:0-type:effect-id:0": V.gain(V.OUTPUT),
      "channel:0-type:effect-id:1": twoGains("channel:0-type:effect-id:0"),
      "channel:[0]-type:source-id:keyboard: 7": sineOsc(
        ["channel:0-type:effect-id:1"],
        { frequency: 500, gain: 0.3 },
      ),
    });
    expect(audioContext.toJSON()).toEqual(expectedData);
  });

  test("updating startTime of nested custom nodes", () => {
    const voice = V.createNode(({ startTime }) => ({
      0: gainWithNoParams(V.OUTPUT),
      1: oscillator(0, { startTime, stopTime: startTime + 1 }),
    }));

    virtualAudioGraph.update({ 0: voice(V.OUTPUT, { startTime: 1 }) });
    const initialSnapshot = audioContext.toJSON();
    expect(initialSnapshot).toMatchSnapshot();

    virtualAudioGraph.update({ 0: voice(V.OUTPUT, { startTime: 2 }) });
    expect(initialSnapshot).toEqual(audioContext.toJSON());
  });
});
