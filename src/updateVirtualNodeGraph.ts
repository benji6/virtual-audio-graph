import connectAudioNodes from "./connectAudioNodes";
import { IVirtualAudioNodeGraph, VirtualAudioNode } from "./types";
import { equals } from "./utils";

const disconnectParents = (
  virtualGraph: IVirtualAudioNodeGraph,
  virtualNode: VirtualAudioNode,
): void => {
  for (const node of Object.values(virtualGraph)) node.disconnect(virtualNode);
};

export default function updateVirtualNodeGraph(
  currentGraph: IVirtualAudioNodeGraph,
  newGraph: IVirtualAudioNodeGraph,
  audioContext: AudioContext | OfflineAudioContext,
  connectCallback: (vNode: VirtualAudioNode) => void = () => {},
): void {
  for (const [id, virtualAudioNode] of Object.entries(currentGraph)) {
    if (newGraph.hasOwnProperty(id)) continue;
    virtualAudioNode.disconnectAndDestroy();
    disconnectParents(currentGraph, virtualAudioNode);
    delete currentGraph[id];
  }

  for (const key of Object.keys(newGraph)) {
    const newVirtualAudioNode = newGraph[key];
    const virtualAudioNode = currentGraph[key];

    if (virtualAudioNode == null) {
      currentGraph[key] = newVirtualAudioNode.initialize(audioContext);
      continue;
    }

    if (virtualAudioNode.cannotUpdateInPlace(newVirtualAudioNode)) {
      virtualAudioNode.disconnectAndDestroy();
      disconnectParents(currentGraph, virtualAudioNode);
      currentGraph[key] = newVirtualAudioNode.initialize(audioContext);
      continue;
    }

    if (!equals(newVirtualAudioNode.output, virtualAudioNode.output)) {
      virtualAudioNode.disconnect();
      disconnectParents(currentGraph, virtualAudioNode);
      virtualAudioNode.output = newVirtualAudioNode.output;
    }

    virtualAudioNode.update(newVirtualAudioNode.params, audioContext);
  }

  connectAudioNodes(currentGraph, connectCallback);
}
