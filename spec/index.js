const VirtualAudioGraph = require('../src/index.js');

const audioContext = new AudioContext();

const automatedTestFinish = () => audioContext.close();

describe("VirtualAudioGraph", () => {
  it("takes audioContext property", () => {
    const virtualAudioGraph = new VirtualAudioGraph({audioContext});
    expect(virtualAudioGraph.audioContext).toBe(audioContext);
  });

  it("takes audio node destination parameter", () => {
    const virtualAudioGraph = new VirtualAudioGraph({
      destination: audioContext.destination,
    });
    expect(virtualAudioGraph.destination).toBe(audioContext.destination);
  });
});

describe("virtualAudioGraph.update", () => {
  var virtualAudioGraph;

  beforeEach(() => {
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext,
      destination: audioContext.destination,
    });
  });

  it('throws an error when virtual node name property is not recognised', () => {
    const virtualNodeParams = [{
      name: 'qwerty',
      connections: [0],
    }];
    expect(() => virtualAudioGraph.update(virtualNodeParams)).toThrow();
  });

  it('creates specified virtual nodes and stores them in virtualAudioGraph property', () => {
    const virtualNodeParams = [{
      id: 1,
      name: 'gain',
      connections: 0,
    },
    {
      id: 2,
      name: 'oscillator',
      connections: 1,
    }];
    virtualAudioGraph.update(virtualNodeParams);
    expect(Array.isArray(virtualAudioGraph.virtualAudioGraph)).toBe(true);
  });

  it('returns itself', () => {
    const virtualNodeParams = [{
      name: 'oscillator',
      params: {
        type: 'square',
      },
      connections: [0],
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
      name: 'oscillator',
      params,
      connections: [0],
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
      name: 'gain',
      params: {
        gain,
      },
      connections: [0],
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
      name: 'biquadFilter',
      params: {
        type,
        frequency,
        detune,
        Q,
      },
      connections: [0],
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
      name: 'delay',
      params: {
        delayTime,
        maxDelayTime,
      },
      connections: [0],
    }];

    virtualAudioGraph.update(virtualNodeParams);
    const audioNode = virtualAudioGraph.virtualAudioGraph[0].audioNode;
    expect(audioNode.constructor).toBe(DelayNode);
    expect(audioNode.delayTime.value).toBe(delayTime);
  });

  it('creates StereoPannerNode with all valid parameters', () => {
    const pan = 1;

    const virtualNodeParams = [{
      name: 'stereoPanner',
      params: {
        pan,
      },
      connections: 0,
    }];

    virtualAudioGraph.update(virtualNodeParams);
    const audioNode = virtualAudioGraph.virtualAudioGraph[0].audioNode;
    expect(audioNode.constructor.name).toBe('StereoPannerNode');
    expect(audioNode.pan.value).toBe(pan);
    automatedTestFinish();
  });
});
