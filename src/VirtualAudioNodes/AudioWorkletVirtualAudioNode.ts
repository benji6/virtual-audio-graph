import { IVirtualAudioNodeParams, Output, VirtualAudioNode } from "../types";
import updateAudioParam from "../updateAudioParam";
import { equals } from "../utils";
import CustomVirtualAudioNode from "./CustomVirtualAudioNode";
import VirtualAudioNodeBase from "./VirtualAudioNodeBase";

export default class AudioWorkletVirtualAudioNode extends VirtualAudioNodeBase {
  public audioNode!: AudioWorkletNode;
  public connected: boolean = false;
  private connections: AudioNode[] = [];

  constructor(
    public readonly node: string,
    public output?: Output,
    public params?: IVirtualAudioNodeParams,
    public readonly input?: string,
  ) {
    super();
  }

  public connect(...connectArgs: any[]): void {
    const { audioNode } = this;
    const [firstArg, ...rest] = connectArgs;
    if (audioNode.connect) {
      audioNode.connect(firstArg, ...rest);
    }
    this.connections = this.connections.concat(connectArgs);
    this.connected = true;
  }

  public disconnect(node?: VirtualAudioNode): void {
    const { audioNode } = this;
    if (node) {
      if (node instanceof CustomVirtualAudioNode) {
        for (const childNode of Object.values(node.virtualNodes)) {
          if (!this.connections.some((x) => x === childNode.audioNode))
            continue;
          this.connections = this.connections.filter(
            (x) => x !== childNode.audioNode,
          );
        }
      } else {
        if (!this.connections.some((x) => x === node.audioNode)) return;
        this.connections = this.connections.filter((x) => x !== node.audioNode);
      }
    }
    if (audioNode.disconnect) audioNode.disconnect();
    this.connected = false;
  }

  public disconnectAndDestroy(): void {
    const { audioNode } = this;
    if (audioNode.disconnect) audioNode.disconnect();
    this.connected = false;
  }

  public initialize(audioContext: AudioContext | OfflineAudioContext): this {
    const params = this.params || {};
    this.audioNode = new window.AudioWorkletNode(audioContext, this.node);

    this.params = undefined;

    return this.update(params);
  }

  public update(params: IVirtualAudioNodeParams = {}): this {
    const audioNode = this.audioNode;
    for (const key of Object.keys(params)) {
      const param = params[key];

      if (this.params && equals(this.params[key], param)) continue;

      const paramInstance = audioNode.parameters.get(key);
      if (!paramInstance)
        throw new Error(
          `Unknown AudioParam "${key}" for AudioWorkletNode "${this.node}"`,
        );
      updateAudioParam(paramInstance, param, this.params != null);
    }
    this.params = params;
    return this;
  }
}
