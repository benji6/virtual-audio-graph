import {
  analyser,
  biquadFilter,
  bufferSource,
  channelMerger,
  channelSplitter,
  convolver,
  delay,
  dynamicsCompressor,
  gain,
  mediaElementSource,
  mediaStreamDestination,
  mediaStreamSource,
  oscillator,
  panner,
  stereoPanner,
  waveShaper,
} from "../src";

describe("nodeFactories", () => {
  describe("analyser", () => {
    test("throws an error when no output is provided", () => {
      expect(() => (analyser as any)()).toThrow();
    });
  });

  describe("biquadFilter", () => {
    test("throws an error when no output is provided", () => {
      expect(() => (biquadFilter as any)()).toThrow();
    });
  });

  describe("bufferSource", () => {
    test("throws an error when no output is provided", () => {
      expect(() => (bufferSource as any)()).toThrow();
    });
  });

  describe("channelMerger", () => {
    test("throws an error when no output is provided", () => {
      expect(() => (channelMerger as any)()).toThrow();
    });
  });

  describe("channelSplitter", () => {
    test("throws an error when no output is provided", () => {
      expect(() => (channelSplitter as any)()).toThrow();
    });
  });

  describe("convolver", () => {
    test("throws an error when no output is provided", () => {
      expect(() => (convolver as any)()).toThrow();
    });
  });

  describe("delay", () => {
    test("throws an error when no output is provided", () => {
      expect(() => (delay as any)()).toThrow();
    });
  });

  describe("dynamicsCompressor", () => {
    test("throws an error when no output is provided", () => {
      expect(() => (dynamicsCompressor as any)()).toThrow();
    });
  });

  describe("gain", () => {
    test("throws an error when no output is provided", () => {
      expect(() => (gain as any)()).toThrow();
    });
  });

  describe("mediaElementSource", () => {
    test("throws an error when no output is provided", () => {
      expect(() => (mediaElementSource as any)()).toThrow();
    });
  });

  describe("mediaStreamDestination", () => {
    test("does not throw an error when no output is provided", () => {
      expect(() => (mediaStreamDestination as any)()).not.toThrow();
    });
  });

  describe("mediaStreamSource", () => {
    test("throws an error when no output is provided", () => {
      expect(() => (mediaStreamSource as any)()).toThrow();
    });
  });

  describe("oscillator", () => {
    test("throws an error when no output is provided", () => {
      expect(() => (oscillator as any)()).toThrow();
    });
  });

  describe("panner", () => {
    test("throws an error when no output is provided", () => {
      expect(() => (panner as any)()).toThrow();
    });
  });

  describe("stereoPanner", () => {
    test("throws an error when no output is provided", () => {
      expect(() => (stereoPanner as any)()).toThrow();
    });
  });

  describe("waveShaper", () => {
    test("throws an error when no output is provided", () => {
      expect(() => (waveShaper as any)()).toThrow();
    });
  });
});
