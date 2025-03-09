import VirtualAudioGraph from "./VirtualAudioGraph";

export * from "./nodeFactories";

export { INPUT, NO_OUTPUT, OUTPUT } from "./constants";

export { default as createNode } from "./createNode";
export { default as createWorkletNode } from "./createWorkletNode";

export default (config?: {
  audioContext?: AudioContext | OfflineAudioContext;
  output?: AudioDestinationNode;
}): VirtualAudioGraph => {
  const audioContext = config?.audioContext || new AudioContext();
  const output = config?.output || audioContext.destination;
  return new VirtualAudioGraph(audioContext, output);
};
