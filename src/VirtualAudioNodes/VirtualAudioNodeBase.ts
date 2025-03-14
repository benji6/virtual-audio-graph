import {
  CustomVirtualAudioNodeFactory,
  IVirtualAudioNodeParams,
  VirtualAudioNode,
} from "../types";

export default abstract class VirtualAudioNodeBase<
  Params = IVirtualAudioNodeParams,
> {
  public readonly node!: string | CustomVirtualAudioNodeFactory<Params>;

  public cannotUpdateInPlace(newVirtualAudioNode: VirtualAudioNode): boolean {
    return newVirtualAudioNode.node !== this.node;
  }
}
