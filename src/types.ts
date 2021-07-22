import AudioWorkletVirtualAudioNode from "./VirtualAudioNodes/AudioWorkletVirtualAudioNode";
import CustomVirtualAudioNode from "./VirtualAudioNodes/CustomVirtualAudioNode";
import StandardVirtualAudioNode from "./VirtualAudioNodes/StandardVirtualAudioNode";

export interface IAudioNodePropertyLookup {
  [_: string]: any;
}

export interface IAudioNodeFactoryParam {
  [_: string]: any;
}

export type CustomVirtualAudioNodeFactory<P = IVirtualAudioNodeParams> = (
  _: P
) => IVirtualAudioNodeGraph;

export interface IOutputObject {
  destination?: string;
  inputs?: Array<number | string>;
  key: number | string;
  outputs?: Array<number | string>;
}

export type Output =
  | string
  | number
  | IOutputObject
  | Array<number | string | IOutputObject>;

export type VirtualAudioNode =
  | AudioWorkletVirtualAudioNode
  | CustomVirtualAudioNode
  | StandardVirtualAudioNode;

export interface IVirtualAudioNodeGraph {
  [_: string]: VirtualAudioNode;
}

export interface IVirtualAudioNodeParams {
  [_: string]: any;
}
