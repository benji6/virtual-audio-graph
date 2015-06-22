const VirtualAudioGraph = require('../src/index.js');

const audioContext = new AudioContext();

const automatedTestFinish = () => audioContext.close();

describe("VirtualAudioGraph", () => {
  it("optionally takes audioContext property", () => {
    expect(new VirtualAudioGraph({audioContext}).audioContext).toBe(audioContext);
    expect(new VirtualAudioGraph().audioContext instanceof AudioContext).toBe(true);
  });

  it("optionally takes output parameter", () => {
    expect(new VirtualAudioGraph({
      output: audioContext.destination,
    }).output).toBe(audioContext.destination);
    expect(new VirtualAudioGraph({audioContext}).output).toBe(audioContext.destination);
  });
});

describe("virtualAudioGraph.update", () => {
  var virtualAudioGraph;

  beforeEach(() => {
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext,
      output: audioContext.destination,
    });
  });

  it('throws an error if no id is provided', () => {
    const virtualNodeParams = [{
      node: 'gain',
      output: 'output',
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
    expect(Array.isArray(virtualAudioGraph.virtualAudioGraph)).toBe(true);
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
    const audioNode = virtualAudioGraph.virtualAudioGraph[0].audioNode;
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
    const audioNode = virtualAudioGraph.virtualAudioGraph[0].audioNode;
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
    const audioNode = virtualAudioGraph.virtualAudioGraph[0].audioNode;
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
    const audioNode = virtualAudioGraph.virtualAudioGraph[0].audioNode;
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
    const audioNode = virtualAudioGraph.virtualAudioGraph[0].audioNode;
    expect(audioNode.constructor.name).toBe('StereoPannerNode');
    expect(audioNode.pan.value).toBe(pan);
    automatedTestFinish();
  });
});
