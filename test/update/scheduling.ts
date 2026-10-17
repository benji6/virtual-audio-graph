import { beforeEach, describe, expect, test } from "vitest";
import createVirtualAudioGraph, * as V from "../../src";

type ScheduledTestNode = AudioScheduledSourceNode & {
  $stateAtTime(time: string): string;
};

const testSchedulingForNode = (node: "oscillator" | "bufferSource") => {
  describe(node, () => {
    let audioContext: AudioContext & { toJSON(): unknown };
    let virtualAudioGraph: ReturnType<typeof createVirtualAudioGraph>;

    beforeEach(() => {
      audioContext = new AudioContext() as typeof audioContext;
      virtualAudioGraph = createVirtualAudioGraph({ audioContext });
    });

    const getScheduledNode = (id: string | number): ScheduledTestNode => {
      const audioNode = virtualAudioGraph.getAudioNodeById(id);
      if (!audioNode) throw new Error(`Missing scheduled node "${id}"`);
      return audioNode as ScheduledTestNode;
    };

    test("no start or stop times are played immediately and forever", () => {
      expect.assertions(12);
      const virtualGraphParams = {
        0: V[node](V.OUTPUT),
        1: V[node](V.OUTPUT),
      };

      virtualAudioGraph.update(virtualGraphParams);

      for (const id of [0, 1]) {
        const audioNode = getScheduledNode(id);

        expect(audioNode.$stateAtTime("00:00.000")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:00.099")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:00.100")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:00.199")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:00.200")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("23:59.999")).toBe("PLAYING");
      }
    });

    test("no start times but with stop times are played immediately until their stop time", () => {
      expect.assertions(12);
      const virtualGraphParams = {
        0: V[node](V.OUTPUT, { stopTime: 0.2 }),
        1: V[node](V.OUTPUT, { stopTime: 0.2 }),
      };

      virtualAudioGraph.update(virtualGraphParams);
      for (const id of [0, 1]) {
        const audioNode = getScheduledNode(id);

        expect(audioNode.$stateAtTime("00:00.000")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:00.099")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:00.100")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:00.199")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:00.200")).toBe("FINISHED");
        expect(audioNode.$stateAtTime("23:59.999")).toBe("FINISHED");
      }
    });

    test("start times but no stop times played at their start time then forever", () => {
      expect.assertions(12);
      const virtualGraphParams = {
        0: V[node](V.OUTPUT, { startTime: 0.1 }),
        1: V[node](V.OUTPUT, { startTime: 0.1 }),
      };

      virtualAudioGraph.update(virtualGraphParams);
      for (const id of [0, 1]) {
        const audioNode = getScheduledNode(id);
        expect(audioNode.$stateAtTime("00:00.000")).toBe("SCHEDULED");
        expect(audioNode.$stateAtTime("00:00.099")).toBe("SCHEDULED");
        expect(audioNode.$stateAtTime("00:00.100")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:00.199")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:00.200")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("23:59.999")).toBe("PLAYING");
      }
    });

    test("works when scheduling a single node's start and stop times", () => {
      expect.assertions(5);
      const virtualGraphParams = {
        nodeA: V[node](V.OUTPUT, { startTime: 0.1, stopTime: 0.2 }),
      };

      virtualAudioGraph.update(virtualGraphParams);
      const audioNode = getScheduledNode("nodeA");
      expect(audioNode.$stateAtTime("00:00.000")).toBe("SCHEDULED");
      expect(audioNode.$stateAtTime("00:00.099")).toBe("SCHEDULED");
      expect(audioNode.$stateAtTime("00:00.100")).toBe("PLAYING");
      expect(audioNode.$stateAtTime("00:00.199")).toBe("PLAYING");
      expect(audioNode.$stateAtTime("00:00.200")).toBe("FINISHED");
    });

    test("works when scheduling multiple nodes start and stop times", () => {
      expect.assertions(15);
      const virtualGraphParams = {
        0: V[node](V.OUTPUT, { startTime: 0.1, stopTime: 0.2 }),
        1: V[node](V.OUTPUT, { startTime: 0.1, stopTime: 0.2 }),
        2: V[node](V.OUTPUT, { startTime: 0.1, stopTime: 0.2 }),
      };

      virtualAudioGraph.update(virtualGraphParams);
      for (const id of [0, 1, 2]) {
        const audioNode = getScheduledNode(id);
        expect(audioNode.$stateAtTime("00:00.000")).toBe("SCHEDULED");
        expect(audioNode.$stateAtTime("00:00.099")).toBe("SCHEDULED");
        expect(audioNode.$stateAtTime("00:00.100")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:00.199")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:00.200")).toBe("FINISHED");
      }
    });

    test("works when rescheduling multiple node start and stop times", () => {
      expect.assertions(42);
      const nodeJSONFromNodeName = {
        bufferSource: {
          buffer: null,
          inputs: [],
          loop: false,
          loopEnd: 0,
          loopStart: 0,
          name: "AudioBufferSourceNode",
          playbackRate: { inputs: [], value: 1 },
        },
        oscillator: {
          detune: { inputs: [], value: 0 },
          frequency: { inputs: [], value: 440 },
          inputs: [],
          name: "OscillatorNode",
          type: "sine",
        },
      };

      virtualAudioGraph.update({
        0: V[node](V.OUTPUT, { startTime: 1.1, stopTime: 1.2 }),
        1: V[node](V.OUTPUT, { startTime: 1.1, stopTime: 1.2 }),
        2: V[node](V.OUTPUT, { startTime: 1.1, stopTime: 1.2 }),
        3: V[node](V.OUTPUT, { startTime: 1.1, stopTime: 1.2 }),
      });
      for (const id of [0, 1, 2, 3]) {
        const audioNode = getScheduledNode(id);
        expect(audioNode.$stateAtTime("00:00.000")).toBe("SCHEDULED");
        expect(audioNode.$stateAtTime("00:01.099")).toBe("SCHEDULED");
        expect(audioNode.$stateAtTime("00:01.100")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:01.199")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:01.200")).toBe("FINISHED");
      }

      expect(audioContext.toJSON()).toEqual({
        inputs: [
          nodeJSONFromNodeName[node],
          nodeJSONFromNodeName[node],
          nodeJSONFromNodeName[node],
          nodeJSONFromNodeName[node],
        ],
        name: "AudioDestinationNode",
      });

      virtualAudioGraph.update({
        0: V[node](V.OUTPUT, { startTime: 0.1, stopTime: 0.2 }),
        1: V[node](V.OUTPUT, { startTime: 0.1, stopTime: 0.2 }),
        2: V[node](V.OUTPUT, { startTime: 0.1, stopTime: 0.2 }),
        3: V[node](V.OUTPUT, { startTime: 0.1, stopTime: 0.2 }),
      });

      for (const id of [0, 1, 2, 3]) {
        const audioNode = getScheduledNode(id);
        expect(audioNode.$stateAtTime("00:00.000")).toBe("SCHEDULED");
        expect(audioNode.$stateAtTime("00:00.099")).toBe("SCHEDULED");
        expect(audioNode.$stateAtTime("00:00.100")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:00.199")).toBe("PLAYING");
        expect(audioNode.$stateAtTime("00:00.200")).toBe("FINISHED");
      }

      expect(audioContext.toJSON()).toEqual({
        inputs: [
          nodeJSONFromNodeName[node],
          nodeJSONFromNodeName[node],
          nodeJSONFromNodeName[node],
          nodeJSONFromNodeName[node],
        ],
        name: "AudioDestinationNode",
      });
    });
  });
};

describe("scheduling with update", () => {
  testSchedulingForNode("oscillator");
  testSchedulingForNode("bufferSource");
});
