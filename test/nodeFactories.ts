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
      expect(() => analyser()).toThrow();
    });
  });

  describe("biquadFilter", () => {
    test("throws an error when no output is provided", () => {
      expect(() => biquadFilter()).toThrow();
    });
  });

  describe("bufferSource", () => {
    test("throws an error when no output is provided", () => {
      expect(() => bufferSource()).toThrow();
    });
  });

  describe("channelMerger", () => {
    test("throws an error when no output is provided", () => {
      expect(() => channelMerger()).toThrow();
    });
  });

  describe("channelSplitter", () => {
    test("throws an error when no output is provided", () => {
      expect(() => channelSplitter()).toThrow();
    });
  });

  describe("convolver", () => {
    test("throws an error when no output is provided", () => {
      expect(() => convolver()).toThrow();
    });
  });

  describe("delay", () => {
    test("throws an error when no output is provided", () => {
      expect(() => delay()).toThrow();
    });
  });

  describe("dynamicsCompressor", () => {
    test("throws an error when no output is provided", () => {
      expect(() => dynamicsCompressor()).toThrow();
    });
  });

  describe("gain", () => {
    test("throws an error when no output is provided", () => {
      expect(() => gain()).toThrow();
    });
  });

  describe("mediaElementSource", () => {
    test("throws an error when no output is provided", () => {
      expect(() => mediaElementSource()).toThrow();
    });
  });

  describe("mediaStreamDestination", () => {
    test("does not throw an error when no output is provided", () => {
      expect(() => mediaStreamDestination()).not.toThrow();
    });
  });

  describe("mediaStreamSource", () => {
    test("throws an error when no output is provided", () => {
      expect(() => mediaStreamSource()).toThrow();
    });
  });

  describe("oscillator", () => {
    test("throws an error when no output is provided", () => {
      expect(() => oscillator()).toThrow();
    });
  });

  describe("panner", () => {
    test("throws an error when no output is provided", () => {
      expect(() => panner()).toThrow();
    });
  });

  describe("stereoPanner", () => {
    test("throws an error when no output is provided", () => {
      expect(() => stereoPanner()).toThrow();
    });
  });

  describe("waveShaper", () => {
    test("throws an error when no output is provided", () => {
      expect(() => waveShaper()).toThrow();
    });
  });
});
