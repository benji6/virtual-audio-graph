import connectAudioNodes from "../connectAudioNodes";
import { OUTPUT } from "../constants";
import {
  CustomVirtualAudioNodeFactory,
  IVirtualAudioNodeGraph,
  Output,
  VirtualAudioNode,
} from "../types";
import { equals } from "../utils";
import VirtualAudioNodeBase from "./VirtualAudioNodeBase";

export default class CustomVirtualAudioNode<
  Params,
> extends VirtualAudioNodeBase<Params> {
  public readonly audioNode: undefined = undefined;
  public connected: boolean = false;
  public params: Params;
  public virtualNodes!: IVirtualAudioNodeGraph;

  constructor(
    public readonly node: CustomVirtualAudioNodeFactory<Params>,
    public output?: Output,
    params?: Params,
  ) {
    super();
    this.params = params || ({} as Params);
  }

  public connect(...connectArgs: any[]): void {
    for (const childVirtualNode of Object.values(this.virtualNodes)) {
      const { output } = childVirtualNode;
      if (
        output === OUTPUT ||
        (Array.isArray(output) && output.indexOf(OUTPUT) !== -1)
      ) {
        childVirtualNode.connect(...connectArgs.filter(Boolean));
      }
    }

    this.connected = true;
  }

  public disconnect(node?: VirtualAudioNode): void {
    for (const virtualNode of Object.values(this.virtualNodes)) {
      const { output } = virtualNode;
      if (
        output === OUTPUT ||
        (Array.isArray(output) && output.indexOf(OUTPUT) !== -1)
      ) {
        virtualNode.disconnect();
      }
    }
    this.connected = false;
  }

  public disconnectAndDestroy(): void {
    for (const virtualNode of Object.values(this.virtualNodes)) {
      virtualNode.disconnectAndDestroy();
    }
    this.connected = false;
  }

  public initialize(audioContext: AudioContext | OfflineAudioContext): this {
    this.virtualNodes = Object.fromEntries(
      Object.entries(this.node(this.params)).map(
        ([key, virtualAudioNodeParam]) => [
          key,
          virtualAudioNodeParam.initialize(audioContext),
        ],
      ),
    );

    connectAudioNodes(this.virtualNodes, () => {});

    return this;
  }

  public update(
    _params: Params | null | undefined,
    audioContext: AudioContext | OfflineAudioContext,
  ): this {
    const params = _params ?? ({} as Params);
    const audioGraphParamsFactoryValues = Object.values(this.node(params));
    const keys = Object.keys(this.virtualNodes);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const virtualAudioNode = this.virtualNodes[key];
      const newVirtualAudioNode = audioGraphParamsFactoryValues[i];

      if (virtualAudioNode.cannotUpdateInPlace(newVirtualAudioNode)) {
        virtualAudioNode.disconnectAndDestroy();
        this.virtualNodes[key] = newVirtualAudioNode.initialize(audioContext);
        continue;
      }

      virtualAudioNode.update(newVirtualAudioNode.params, audioContext);

      if (!equals(newVirtualAudioNode.output, virtualAudioNode.output)) {
        virtualAudioNode.disconnect();
        virtualAudioNode.output = newVirtualAudioNode.output;
      }
    }

    connectAudioNodes(this.virtualNodes, () => {});
    this.params = params;
    return this;
  }
}
