import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import createVirtualAudioGraph, * as V from "../../src";
import { IVirtualAudioNodeParams } from "../../src/types";
import mockWorklet from "../utils/mockWorklet";

describe.each(["standard", "worklet"] as const)(
  "%s AudioParam updates",
  (kind) => {
    let graph: ReturnType<typeof createVirtualAudioGraph>;
    let createGain: ReturnType<typeof V.createWorkletNode> | typeof V.gain;

    beforeEach(() => {
      mockWorklet();
      graph = createVirtualAudioGraph();
      createGain =
        kind === "standard" ? V.gain : V.createWorkletNode("test-gain");
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    });

    const update = (params: IVirtualAudioNodeParams) =>
      graph.update({ node: createGain(V.OUTPUT, params) });
    const getGain = () => {
      const node = graph.getAudioNodeById("node");
      if (!(node instanceof GainNode)) throw new Error("Missing test gain");
      return node;
    };

    test("initial automation does not cancel scheduled values", () => {
      const cancel = vi.spyOn(AudioParam.prototype, "cancelScheduledValues");

      update({ gain: ["setValueAtTime", 0.5, 1] });

      expect(cancel).not.toHaveBeenCalled();
    });

    test("equivalent newly allocated schedules do not replay or cancel events", () => {
      update({ gain: [["setValueAtTime", 0.5, 1]] });
      const node = getGain();
      const schedule = vi.spyOn(node.gain, "setValueAtTime");
      const cancel = vi.spyOn(node.gain, "cancelScheduledValues");

      update({ gain: [["setValueAtTime", 0.5, 1]] });

      expect(getGain()).toBe(node);
      expect(schedule).not.toHaveBeenCalled();
      expect(cancel).not.toHaveBeenCalled();
    });

    test("equivalent typed-array curves do not replay automation", () => {
      update({
        gain: ["setValueCurveAtTime", Float32Array.of(0, 1), 1, 1],
      });
      const param = getGain().gain;
      const schedule = vi.spyOn(param, "setValueCurveAtTime");
      const cancel = vi.spyOn(param, "cancelScheduledValues");

      update({
        gain: ["setValueCurveAtTime", Float32Array.of(0, 1), 1, 1],
      });

      expect(schedule).not.toHaveBeenCalled();
      expect(cancel).not.toHaveBeenCalled();
    });

    test("changed schedules cancel old events before applying replacements", () => {
      update({ gain: ["setValueAtTime", 0.5, 1] });
      const param = getGain().gain;
      const cancel = vi.spyOn(param, "cancelScheduledValues");
      const schedule = vi.spyOn(param, "setValueAtTime");

      update({ gain: ["setValueAtTime", 0.75, 2] });

      expect(cancel).toHaveBeenCalledExactlyOnceWith(0);
      expect(schedule).toHaveBeenCalledExactlyOnceWith(0.75, 2);
      expect(cancel.mock.invocationCallOrder[0]).toBeLessThan(
        schedule.mock.invocationCallOrder[0],
      );
    });

    test("changed curves cancel and replace automation", () => {
      update({
        gain: ["setValueCurveAtTime", Float32Array.of(0, 1), 1, 1],
      });
      const param = getGain().gain;
      const cancel = vi.spyOn(param, "cancelScheduledValues");
      const schedule = vi.spyOn(param, "setValueCurveAtTime");
      const curve = Float32Array.of(1, 0);

      update({ gain: ["setValueCurveAtTime", curve, 1, 1] });

      expect(cancel).toHaveBeenCalledExactlyOnceWith(0);
      expect(schedule).toHaveBeenCalledExactlyOnceWith(curve, 1, 1);
    });

    test("a scalar replacement cancels old future automation", () => {
      update({ gain: ["setValueAtTime", 0.5, 10] });
      const param = getGain().gain as AudioParam & {
        $valueAtTime(time: string): number;
      };
      const cancel = vi.spyOn(param, "cancelScheduledValues");

      update({ gain: 0.75 });

      expect(cancel).toHaveBeenCalledExactlyOnceWith(0);
      expect(param.value).toBe(0.75);
      expect(param.$valueAtTime("00:11.000")).toBe(0.75);
    });

    test("unchanged scalars do not cancel automation", () => {
      update({ gain: 0.75 });
      const cancel = vi.spyOn(getGain().gain, "cancelScheduledValues");

      update({ gain: 0.75 });

      expect(cancel).not.toHaveBeenCalled();
    });

    test("omitting a parameter leaves its automation intact until replaced", () => {
      update({ gain: ["setValueAtTime", 0.5, 10] });
      const param = getGain().gain;
      const cancel = vi.spyOn(param, "cancelScheduledValues");

      update({});
      expect(cancel).not.toHaveBeenCalled();

      update({ gain: 0.75 });
      expect(cancel).toHaveBeenCalledExactlyOnceWith(0);
    });

    test("an empty schedule clears automation without adding events", () => {
      update({ gain: ["setValueAtTime", 0.5, 10] });
      const param = getGain().gain;
      const cancel = vi.spyOn(param, "cancelScheduledValues");
      const schedule = vi.spyOn(param, "setValueAtTime");

      update({ gain: [] });

      expect(cancel).toHaveBeenCalledExactlyOnceWith(0);
      expect(schedule).not.toHaveBeenCalled();
    });

    test("replaces scalars with multiple automation events", () => {
      update({ gain: 0.5 });
      const param = getGain().gain;
      const cancel = vi.spyOn(param, "cancelScheduledValues");
      const schedule = vi.spyOn(param, "setValueAtTime");
      const ramp = vi.spyOn(param, "linearRampToValueAtTime");

      update({
        gain: [
          ["setValueAtTime", 0.25, 1],
          ["linearRampToValueAtTime", 1, 2],
        ],
      });

      expect(cancel).toHaveBeenCalledExactlyOnceWith(0);
      expect(schedule).toHaveBeenCalledExactlyOnceWith(0.25, 1);
      expect(ramp).toHaveBeenCalledExactlyOnceWith(1, 2);
    });
  },
);

describe("worklet parameter validation", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("reports unknown AudioParams with the processor and parameter names", () => {
    mockWorklet();
    const worklet = V.createWorkletNode("test-gain");

    expect(() =>
      createVirtualAudioGraph().update({
        node: worklet(V.OUTPUT, { missing: 0.5 }),
      }),
    ).toThrow('Unknown AudioParam "missing" for AudioWorkletNode "test-gain"');
  });
});

describe("native object parameters", () => {
  test("updates a convolver buffer by identity and allows clearing it", () => {
    const context = new AudioContext();
    const graph = createVirtualAudioGraph({ audioContext: context });
    const a = context.createBuffer(1, 16, context.sampleRate);
    const b = context.createBuffer(1, 16, context.sampleRate);
    graph.update({ node: V.convolver(V.OUTPUT, { buffer: a }) });
    const node = graph.getAudioNodeById("node");
    if (!(node instanceof ConvolverNode)) throw new Error("Missing convolver");

    graph.update({ node: V.convolver(V.OUTPUT, { buffer: b }) });
    expect(graph.getAudioNodeById("node")).toBe(node);
    expect(node.buffer).toBe(b);

    graph.update({ node: V.convolver(V.OUTPUT, { buffer: null }) });
    expect(node.buffer).toBeNull();

    graph.update({ node: V.convolver(V.OUTPUT, { buffer: a }) });
    expect(node.buffer).toBe(a);
  });
});
