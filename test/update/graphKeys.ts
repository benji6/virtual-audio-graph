import { describe, expect, test } from "vitest";
import createVirtualAudioGraph, * as V from "../../src";
import { IVirtualAudioNodeGraph, Output } from "../../src/types";

describe("graph keys", () => {
  test.each(["toString", "constructor", "hasOwnProperty", "__proto__"])(
    "creates, updates, connects, and removes a node named %s",
    (id) => {
      const graph = createVirtualAudioGraph().update({
        [id]: V.gain(V.OUTPUT, { gain: 0.5 }),
        source: V.gain(id),
      });
      const node = graph.getAudioNodeById(id);
      if (!(node instanceof GainNode)) throw new Error("Missing gain");
      expect(node.gain.value).toBe(0.5);

      graph.update({
        [id]: V.gain(V.OUTPUT, { gain: 0.25 }),
        source: V.gain(id),
      });
      expect(graph.getAudioNodeById(id)).toBe(node);
      expect(node.gain.value).toBe(0.25);

      graph.update({});
      expect(graph.getAudioNodeById(id)).toBeUndefined();
    },
  );

  test("accepts null-prototype graph descriptions on successive updates", () => {
    const graph = createVirtualAudioGraph();
    const description: IVirtualAudioNodeGraph = Object.create(null);
    description.node = V.gain(V.OUTPUT, { gain: 0.5 });
    graph.update(description);
    const node = graph.getAudioNodeById("node");
    description.node = V.gain(V.OUTPUT, { gain: 0.25 });
    graph.update(description);

    expect(graph.getAudioNodeById("node")).toBe(node);
    if (!(node instanceof GainNode)) throw new Error("Missing gain");
    expect(node.gain.value).toBe(0.25);
  });

  test("adds and removes prototype-named nodes inside custom graphs", () => {
    const custom = V.createNode(
      ({ present }: { present: boolean }): IVirtualAudioNodeGraph =>
        present
          ? {
              ["__proto__"]: V.gain(V.OUTPUT, {}, V.INPUT),
              source: V.gain("__proto__"),
            }
          : {},
    );
    const node = custom(V.OUTPUT, { present: false });
    const graph = createVirtualAudioGraph().update({ custom: node });
    graph.update({ custom: custom(V.OUTPUT, { present: true }) });
    const child = node.virtualNodes["__proto__"].audioNode;
    expect(child).toBeInstanceOf(GainNode);
    graph.update({ custom: custom(V.OUTPUT, { present: true }) });
    expect(node.virtualNodes["__proto__"].audioNode).toBe(child);
    graph.update({ custom: custom(V.OUTPUT, { present: false }) });

    expect(Object.keys(node.virtualNodes)).toEqual([]);
    expect(() => graph.update({})).not.toThrow();
  });

  test("ignores inherited graph entries, including the reserved output name", () => {
    const description: IVirtualAudioNodeGraph = Object.create({
      output: V.gain(V.OUTPUT),
      inherited: V.gain(V.OUTPUT),
    });
    description.node = V.gain(V.OUTPUT);
    const graph = createVirtualAudioGraph().update(description);

    expect(graph.getAudioNodeById("node")).toBeInstanceOf(GainNode);
    expect(graph.getAudioNodeById("inherited")).toBeUndefined();
  });

  test.each<Output>([
    "toString",
    { key: "toString", destination: "gain" },
    { key: "toString", inputs: [0], outputs: [0] },
  ])("does not resolve inherited output IDs: %j", (output) => {
    expect(() =>
      createVirtualAudioGraph().update({ source: V.gain(output) }),
    ).toThrow(
      'node with ID "source" specifies an output ID "toString", but no such node exists',
    );
  });
});
