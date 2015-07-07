const VirtualAudioGraph = require('../src/index.js');
const pingPongDelayParamsFactory = require('./tools/pingPongDelayParamsFactory');

describe("virtualAudioGraph.update", () => {
  let audioContext;
  let virtualAudioGraph;

  beforeEach(() => {
    audioContext = new AudioContext();
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext,
      output: audioContext.destination,
    });
  });

  it('returns itself', () => {
    const virtualNodeParams = [{
      id: 0,
      node: 'oscillator',
      params: {
        type: 'square',
      },
      output: 'output',
    }];
    expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
  });

  it('throws an error if no id is provided', () => {
    const virtualNodeParams = [{
      node: 'gain',
      output: 'output',
    }];
    expect(() => virtualAudioGraph.update(virtualNodeParams)).toThrow();
  });

  it('throws an error if no output is provided', () => {
    const virtualNodeParams = [{
      node: 'gain',
      id: 1,
    }];
    expect(() => virtualAudioGraph.update(virtualNodeParams)).toThrow();
  });

  it('throws an error when virtual node name property is not recognised', () => {
    const virtualNodeParams = [{
      id: 0,
      node: 'foobar',
      output: 'output',
    }];
    expect(() => virtualAudioGraph.update(virtualNodeParams)).toThrow();
  });

  it('changes the node if passed params with same id but different node property', () => {
    virtualAudioGraph.update([{
      id: 0,
      node: 'gain',
      output: 'output',
    }]);

    expect(audioContext.toJSON()).toEqual({
      name: "AudioDestinationNode",
      inputs: [
        {
          name: "GainNode",
          gain: {
            value: 1,
            inputs: []
          },
          inputs: []
        }
      ]
    });

    virtualAudioGraph.update([{
      id: 0,
      node: 'oscillator',
      output: 'output',
    }]);

    expect(audioContext.toJSON()).toEqual({
      "name":"AudioDestinationNode",
      "inputs":[
        {
          "name":"OscillatorNode",
          "type":"sine",
          "frequency":{
            "value":440,"inputs":[]
          },
          "detune":{
            "value":0,"inputs":[]
          },
          "inputs":[]
        }
      ]
    });

    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    virtualAudioGraph.update([{
      id: 0,
      node: 'pingPongDelay',
      output: 'output',
    }]);
    expect(audioContext.toJSON()).toEqual({"name":"AudioDestinationNode","inputs":[{"name":"StereoPannerNode","pan":{"value":-1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":["<circular:DelayNode>"]}]}]}]}]},{"name":"StereoPannerNode","pan":{"value":1,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"DelayNode","delayTime":{"value":0.3333333333333333,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.3333333333333333,"inputs":[]},"inputs":["<circular:DelayNode>"]}]}]}]}]}]});
  });

  it('creates specified virtual nodes and stores them in virtualAudioGraph property', () => {
    const virtualNodeParams = [{
      id: 1,
      node: 'gain',
      output: 'output',
    },
    {
      id: 2,
      node: 'oscillator',
      output: 1,
    }];
    virtualAudioGraph.update(virtualNodeParams);
    expect(Array.isArray(virtualAudioGraph.virtualNodes)).toBe(true);
    expect(virtualAudioGraph.virtualNodes.length).toBe(2);
  });

  it('creates OscillatorNode with all valid parameters', () => {
    const params = {
      type: 'square',
      frequency: 440,
      detune: 4,
    };

    const {type, frequency, detune} = params;

    const virtualNodeParams = [{
      id: 0,
      node: 'oscillator',
      params,
      output: 'output',
    }];

    virtualAudioGraph.update(virtualNodeParams);
    const audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.constructor).toBe(OscillatorNode);
    expect(audioNode.type).toBe(type);
    expect(audioNode.frequency.value).toBe(frequency);
    expect(audioNode.detune.value).toBe(detune);
  });

  it('creates GainNode with all valid parameters', () => {
    const gain = 0.5;

    const virtualNodeParams = [{
      id: 0,
      node: 'gain',
      params: {
        gain,
      },
      output: 'output',
    }];

    virtualAudioGraph.update(virtualNodeParams);
    const audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.constructor).toBe(GainNode);
    expect(audioNode.gain.value).toBe(gain);
  });

  it('creates BiquadFilterNode with all valid parameters', () => {
    const type = 'peaking';
    const frequency = 500;
    const detune = 6;
    const Q = 0.5;

    const virtualNodeParams = [{
      id: 0,
      node: 'biquadFilter',
      params: {
        type,
        frequency,
        detune,
        Q,
      },
      output: 'output',
    }];

    virtualAudioGraph.update(virtualNodeParams);
    const audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.constructor).toBe(BiquadFilterNode);
    expect(audioNode.type).toBe(type);
    expect(audioNode.frequency.value).toBe(frequency);
    expect(audioNode.detune.value).toBe(detune);
    expect(audioNode.Q.value).toBe(Q);
  });

  it('creates DelayNode with all valid parameters', () => {
    const delayTime = 2;
    const maxDelayTime = 5;

    const virtualNodeParams = [{
      id: 0,
      node: 'delay',
      params: {
        delayTime,
        maxDelayTime,
      },
      output: 'output',
    }];

    virtualAudioGraph.update(virtualNodeParams);
    const audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.constructor).toBe(DelayNode);
    expect(audioNode.delayTime.value).toBe(delayTime);
  });

  it('creates StereoPannerNode with all valid parameters', () => {
    const pan = 1;

    const virtualNodeParams = [{
      id: 0,
      node: 'stereoPanner',
      params: {
        pan,
      },
      output: 'output',
    }];

    virtualAudioGraph.update(virtualNodeParams);
    const audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.constructor.name).toBe('StereoPannerNode');
    expect(audioNode.pan.value).toBe(pan);
  });
});
