import {
  CustomVirtualAudioNodeFactory,
  IVirtualAudioNodeParams,
  Output,
} from "./types";
import CustomVirtualAudioNode from "./VirtualAudioNodes/CustomVirtualAudioNode";

export default (node: CustomVirtualAudioNodeFactory<IVirtualAudioNodeParams>) =>
  (output: Output, params?: IVirtualAudioNodeParams) =>
    new CustomVirtualAudioNode(node, output, params);
