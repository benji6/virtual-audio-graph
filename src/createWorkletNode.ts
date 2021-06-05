import { IVirtualAudioNodeParams, Output } from "./types";
import AudioWorkletVirtualAudioNode from "./VirtualAudioNodes/AudioWorkletVirtualAudioNode";

export default (nodeName: string) =>
  (output: Output, params?: IVirtualAudioNodeParams) =>
    new AudioWorkletVirtualAudioNode(nodeName, output, params);
