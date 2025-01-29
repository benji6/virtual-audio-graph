import connectAudioNodes from "./connectAudioNodes";
import { OUTPUT } from "./constants";
import { IVirtualAudioNodeGraph, VirtualAudioNode } from "./types";
import { equals } from "./utils";

export default class VirtualAudioGraph {
  private virtualNodes: IVirtualAudioNodeGraph = {};

  constructor(
    public readonly audioContext: AudioContext | OfflineAudioContext,
    private readonly output: AudioDestinationNode,
  ) {}

  public getAudioNodeById(id: number | string): AudioNode | void {
    return this.virtualNodes[id]?.audioNode;
  }

  public update(newGraph: IVirtualAudioNodeGraph): this {
    if (OUTPUT in newGraph)
      throw new Error(
        `"${OUTPUT}" is a virtual-audio-graph reserved string and therefore not a valid node ID`,
      );

    for (const [id, virtualAudioNode] of Object.entries(this.virtualNodes)) {
      if (newGraph.hasOwnProperty(id)) continue;
      virtualAudioNode.disconnectAndDestroy();
      this.disconnectParents(virtualAudioNode);
      delete this.virtualNodes[id];
    }

    for (const key of Object.keys(newGraph)) {
      const newVirtualAudioNode = newGraph[key];
      const virtualAudioNode = this.virtualNodes[key];

      if (virtualAudioNode == null) {
        this.virtualNodes[key] = newVirtualAudioNode.initialize(
          this.audioContext,
        );
        continue;
      }

      if (virtualAudioNode.cannotUpdateInPlace(newVirtualAudioNode)) {
        virtualAudioNode.disconnectAndDestroy();
        this.disconnectParents(virtualAudioNode);
        this.virtualNodes[key] = newVirtualAudioNode.initialize(
          this.audioContext,
        );
        continue;
      }

      if (!equals(newVirtualAudioNode.output, virtualAudioNode.output)) {
        virtualAudioNode.disconnect();
        this.disconnectParents(virtualAudioNode);
        virtualAudioNode.output = newVirtualAudioNode.output;
      }

      virtualAudioNode.update(newVirtualAudioNode.params, this.audioContext);
    }

    connectAudioNodes(this.virtualNodes, (vNode: VirtualAudioNode) =>
      vNode.connect(this.output),
    );

    return this;
  }

  public get currentTime(): number {
    return this.audioContext.currentTime;
  }

  private disconnectParents(vNode: VirtualAudioNode): void {
    for (const node of Object.values(this.virtualNodes)) {
      node.disconnect(vNode);
    }
  }
}
