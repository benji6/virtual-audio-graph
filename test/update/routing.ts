import { afterEach, describe, expect, test, vi } from "vitest";
import createVirtualAudioGraph, * as V from "../../src";
import { Output } from "../../src/types";
import CustomVirtualAudioNode from "../../src/VirtualAudioNodes/CustomVirtualAudioNode";
import mockWorklet from "../utils/mockWorklet";

describe("channel routing", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test("connects every splitter output to its specified merger input", () => {
    const graph = createVirtualAudioGraph();
    graph.update({
      destination: V.channelMerger(V.OUTPUT, { numberOfInputs: 2 }),
      source: V.channelSplitter(V.NO_OUTPUT, { numberOfOutputs: 2 }),
    });
    const source = graph.getAudioNodeById("source");
    if (!source) throw new Error("Missing source");
    const connect = vi.spyOn(source, "connect");

    graph.update({
      destination: V.channelMerger(V.OUTPUT, { numberOfInputs: 2 }),
      source: V.channelSplitter(
        { key: "destination", outputs: [0, 1], inputs: [1, 0] },
        { numberOfOutputs: 2 },
      ),
    });

    expect(graph.getAudioNodeById("source")).toBe(source);
    expect(connect).toHaveBeenCalledTimes(2);
    expect(connect).toHaveBeenNthCalledWith(
      1,
      graph.getAudioNodeById("destination"),
      0,
      1,
    );
    expect(connect).toHaveBeenNthCalledWith(
      2,
      graph.getAudioNodeById("destination"),
      1,
      0,
    );
  });

  test.each(["standard", "custom", "worklet"] as const)(
    "preserves zero channel indices through a %s node",
    (kind) => {
      mockWorklet();
      const custom = V.createNode(() => ({ child: V.gain(V.OUTPUT) }));
      const worklet = V.createWorkletNode("test-gain");
      const createSource = (output: Output) =>
        kind === "standard"
          ? V.gain(output)
          : kind === "custom"
            ? custom(output)
            : worklet(output);
      const source = createSource(V.NO_OUTPUT);
      const graph = createVirtualAudioGraph().update({
        destination: V.channelMerger(V.OUTPUT, { numberOfInputs: 2 }),
        source,
      });
      const audioNode =
        source instanceof CustomVirtualAudioNode
          ? source.virtualNodes.child.audioNode
          : source.audioNode;
      if (!audioNode) throw new Error("Missing source");
      const connect = vi.spyOn(audioNode, "connect");

      graph.update({
        destination: V.channelMerger(V.OUTPUT, { numberOfInputs: 2 }),
        source: createSource({
          key: "destination",
          outputs: [0, 0],
          inputs: [0, 1],
        }),
      });

      expect(connect).toHaveBeenCalledTimes(2);
      expect(connect).toHaveBeenNthCalledWith(
        1,
        graph.getAudioNodeById("destination"),
        0,
        0,
      );
      expect(connect).toHaveBeenNthCalledWith(
        2,
        graph.getAudioNodeById("destination"),
        0,
        1,
      );
    },
  );

  test.each([
    { inputs: [0] },
    { outputs: [0] },
    { inputs: [0], outputs: [0, 1] },
  ])("rejects incomplete or mismatched channel mappings: %j", (mapping) => {
    expect(() =>
      createVirtualAudioGraph().update({
        destination: V.channelMerger(V.OUTPUT),
        source: V.channelSplitter({ key: "destination", ...mapping }),
      }),
    ).toThrow(
      'node with ID "source" must specify outputs and inputs arrays of the same length',
    );
  });

  test("reports missing channel destinations by ID", () => {
    expect(() =>
      createVirtualAudioGraph().update({
        source: V.channelSplitter({
          key: "missing",
          inputs: [0],
          outputs: [0],
        }),
      }),
    ).toThrow(
      'node with ID "source" specifies an output ID "missing", but no such node exists',
    );
  });
});
