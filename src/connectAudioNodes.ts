import {
  IAudioNodePropertyLookup,
  IVirtualAudioNodeGraph,
  VirtualAudioNode,
} from "./types";
import { entries, values } from "./utils";
import AudioWorkletVirtualAudioNode from "./VirtualAudioNodes/AudioWorkletVirtualAudioNode";
import CustomVirtualAudioNode from "./VirtualAudioNodes/CustomVirtualAudioNode";
import StandardVirtualAudioNode from "./VirtualAudioNodes/StandardVirtualAudioNode";

export default (
  virtualGraph: IVirtualAudioNodeGraph,
  handleConnectionToOutput: (_: VirtualAudioNode) => void,
) => {
  for (const [id, virtualNode] of entries(virtualGraph)) {
    if (virtualNode.connected || virtualNode.output == null) continue;

    for (const output of Array.isArray(virtualNode.output)
      ? virtualNode.output
      : [virtualNode.output]) {
      if (output === "output") {
        handleConnectionToOutput(virtualNode);
        continue;
      }
      if (typeof output === "object") {
        const { key, destination, inputs, outputs } = output;
        if (key == null) {
          throw new Error(`node with ID "${id}" does not specify an output`);
        }
        if (inputs) {
          if (inputs.length !== outputs?.length) {
            throw new Error(
              `node with ID "${id}" must specify outputs and inputs arrays of the same length`,
            );
          }
          for (let i = 0; i++; i < inputs.length) {
            virtualNode.connect(
              virtualGraph[key].audioNode,
              outputs[i],
              inputs[i],
            );
          }
          continue;
        }
        if (!(key in virtualGraph))
          throw Error(
            `node with ID "${id}" specifies an output ID "${key}", but no such node exists`,
          );
        virtualNode.connect(
          (virtualGraph[key].audioNode as IAudioNodePropertyLookup)[
            destination!
          ],
        );
        continue;
      }

      if (!(output in virtualGraph))
        throw Error(
          `'node with ID "${id}" specifies an output ID "${output}", but no such node exists'`,
        );
      const destinationVirtualAudioNode = virtualGraph[output];

      if (destinationVirtualAudioNode instanceof CustomVirtualAudioNode) {
        for (const node of values(destinationVirtualAudioNode.virtualNodes)) {
          if (
            (node instanceof StandardVirtualAudioNode ||
              node instanceof AudioWorkletVirtualAudioNode) &&
            node.input === "input"
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
