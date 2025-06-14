import { OUTPUT } from "./constants";
import { IVirtualAudioNodeGraph, VirtualAudioNode } from "./types";
import updateVirtualNodeGraph from "./updateVirtualNodeGraph";

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

    updateVirtualNodeGraph(
      this.virtualNodes,
      newGraph,
      this.audioContext,
      (vNode: VirtualAudioNode) => vNode.connect(this.output),
    );

    return this;
  }

  public get currentTime(): number {
    return this.audioContext.currentTime;
  }
}
