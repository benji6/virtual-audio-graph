import {
  CustomVirtualAudioNodeFactory,
  IVirtualAudioNodeParams,
  Output,
} from "./types";
import CustomVirtualAudioNode from "./VirtualAudioNodes/CustomVirtualAudioNode";

export default <P = IVirtualAudioNodeParams>(
  node: CustomVirtualAudioNodeFactory<P>
) => (output: Output, params?: P) =>
  new CustomVirtualAudioNode(node, output, params);
