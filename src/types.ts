import { OUTPUT } from "./constants";
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
  _: P,
) => IVirtualAudioNodeGraph;

export interface IOutputObject {
  destination?: string;
  inputs?: Array<number | string>;
  key: number | string;
  outputs?: Array<number | string>;
}

export type Output =
  | Array<number | string | IOutputObject>
  | IOutputObject
  | number
  | string
  | typeof OUTPUT;

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
