import { NO_OUTPUT, OUTPUT } from "./constants";
import AudioWorkletVirtualAudioNode from "./VirtualAudioNodes/AudioWorkletVirtualAudioNode";
import CustomVirtualAudioNode from "./VirtualAudioNodes/CustomVirtualAudioNode";
import StandardVirtualAudioNode from "./VirtualAudioNodes/StandardVirtualAudioNode";

export interface IAudioNodePropertyLookup {
  [_: string]: any;
}

export interface IAudioNodeFactoryParam {
  [_: string]: any;
}

export type CustomVirtualAudioNodeFactory<
  Params extends IVirtualAudioNodeParams,
> = (_: Params) => IVirtualAudioNodeGraph;

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
  | CustomVirtualAudioNode<IVirtualAudioNodeParams>
  | StandardVirtualAudioNode;

export type IVirtualAudioNodeGraph = Record<string, VirtualAudioNode>;

export interface IVirtualAudioNodeParams {
  [_: string]: any;
}
