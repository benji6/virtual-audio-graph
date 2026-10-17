import { vi } from "vitest";

export default function mockWorklet() {
  const constructor = vi.fn(function (context: BaseAudioContext) {
    const node = context.createGain();
    return Object.assign(node, {
      parameters: new Map([["gain", node.gain]]),
    });
  });
  vi.stubGlobal("window", { AudioWorkletNode: constructor });
  return constructor;
}
