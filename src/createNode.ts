import {
  CustomVirtualAudioNodeFactory,
  IVirtualAudioNodeParams,
  Output,
} from "./types";
import CustomVirtualAudioNode from "./VirtualAudioNodes/CustomVirtualAudioNode";

export default function createNode<Params extends IVirtualAudioNodeParams>(
  node: CustomVirtualAudioNodeFactory<Params>,
) {
  return (output: Output, params?: Params) =>
    new CustomVirtualAudioNode<Params>(node, output, params);
}
