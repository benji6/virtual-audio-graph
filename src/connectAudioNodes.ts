import { OUTPUT, NO_OUTPUT, INPUT } from "./constants";
import {
  IAudioNodePropertyLookup,
  IVirtualAudioNodeGraph,
  VirtualAudioNode,
} from "./types";
import AudioWorkletVirtualAudioNode from "./VirtualAudioNodes/AudioWorkletVirtualAudioNode";
import CustomVirtualAudioNode from "./VirtualAudioNodes/CustomVirtualAudioNode";
import StandardVirtualAudioNode from "./VirtualAudioNodes/StandardVirtualAudioNode";

export default (
  virtualGraph: IVirtualAudioNodeGraph,
  handleConnectionToOutput: (_: VirtualAudioNode) => void,
) => {
  for (const [id, virtualNode] of Object.entries(virtualGraph)) {
    if (virtualNode.connected || virtualNode.output == null) continue;

    for (const output of Array.isArray(virtualNode.output)
      ? virtualNode.output
      : [virtualNode.output]) {
      if (output === OUTPUT) {
        handleConnectionToOutput(virtualNode);
        continue;
      }
      if (output === NO_OUTPUT) continue;
      if (typeof output === "object") {
        const { key, destination, inputs, outputs } = output;
        if (key == null) {
          throw new Error(`node with ID "${id}" does not specify an output`);
        }
        if (!Object.hasOwn(virtualGraph, key))
          throw Error(
            `node with ID "${id}" specifies an output ID "${String(key)}", but no such node exists`,
          );
        if (inputs != null || outputs != null) {
          if (
            !Array.isArray(inputs) ||
            !Array.isArray(outputs) ||
            inputs.length !== outputs.length
          ) {
            throw new Error(
              `node with ID "${id}" must specify outputs and inputs arrays of the same length`,
            );
          }
          for (let i = 0; i < inputs.length; i++) {
            virtualNode.connect(
              virtualGraph[key as keyof typeof virtualGraph].audioNode,
              outputs[i],
              inputs[i],
            );
          }
          continue;
        }
        virtualNode.connect(
          (
            virtualGraph[key as keyof typeof virtualGraph]
              .audioNode as IAudioNodePropertyLookup
          )[destination!],
        );
        continue;
      }

      if (!Object.hasOwn(virtualGraph, output))
        throw Error(
          `'node with ID "${id}" specifies an output ID "${String(output)}", but no such node exists'`,
        );
      const destinationVirtualAudioNode = virtualGraph[String(output)];

      if (destinationVirtualAudioNode instanceof CustomVirtualAudioNode) {
        for (const node of Object.values(
          destinationVirtualAudioNode.virtualNodes,
        )) {
          if (
            (node instanceof StandardVirtualAudioNode ||
              node instanceof AudioWorkletVirtualAudioNode) &&
            node.input === INPUT
          ) {
            virtualNode.connect(node.audioNode);
          }
        }
        continue;
      }

      virtualNode.connect(destinationVirtualAudioNode.audioNode);
    }
  }
};
