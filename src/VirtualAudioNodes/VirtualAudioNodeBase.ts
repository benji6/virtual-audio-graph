import { CustomVirtualAudioNodeFactory, VirtualAudioNode } from "../types";

export default abstract class VirtualAudioNodeBase {
  public readonly node!: string | CustomVirtualAudioNodeFactory;

  public cannotUpdateInPlace(newVirtualAudioNode: VirtualAudioNode): boolean {
    return newVirtualAudioNode.node !== this.node;
  }
}
