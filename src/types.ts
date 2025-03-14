import { NO_OUTPUT, OUTPUT } from "./constants";
import AudioWorkletVirtualAudioNode from "./VirtualAudioNodes/AudioWorkletVirtualAudioNode";
import CustomVirtualAudioNode from "./VirtualAudioNodes/CustomVirtualAudioNode";
import StandardVirtualAudioNode from "./VirtualAudioNodes/StandardVirtualAudioNode";

export type IAudioNodeFactoryParam = Record<string, any>;
export type IAudioNodePropertyLookup = Record<string, any>;
export type IVirtualAudioNodeGraph = Record<string, VirtualAudioNode>;
export type IVirtualAudioNodeParams = Record<string, any>;

export type CustomVirtualAudioNodeFactory<Params> = (
  _: Params,
) => IVirtualAudioNodeGraph;

type OutputKey = number | string | typeof NO_OUTPUT | typeof OUTPUT;
export interface IOutputObject {
  destination?: string;
  inputs?: Array<number | string>;
  key: OutputKey;
  outputs?: Array<number | string>;
}
type OutputItem = OutputKey | IOutputObject;
export type Output = OutputItem | Array<OutputItem>;

export type VirtualAudioNode =
  | AudioWorkletVirtualAudioNode
  | CustomVirtualAudioNode<any>
  | StandardVirtualAudioNode;
