const VirtualAudioGraph = require('../../dist/index.js');

describe('virtualAudioGraph.update - creating AudioNodes', function () {
  var audioContext;
  var virtualAudioGraph;

  beforeEach(function () {
    audioContext = new AudioContext();
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext: audioContext,
      output: audioContext.destination,
    });
  });

  it('creates OscillatorNode with all valid parameters', function () {
    const params = {
      type: 'square',
      frequency: 440,
      detune: 4,
    };

    const virtualNodeParams = [{
      id: 0,
      node: 'oscillator',
      params: params,
      output: 'output',
    }];

    virtualAudioGraph.update(virtualNodeParams);
    const audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.constructor).toBe(OscillatorNode);
    expect(audioNode.type).toBe(params.type);
    expect(audioNode.frequency.value).toBe(params.frequency);
    expect(audioNode.detune.value).toBe(params.detune);
  });

  it('creates GainNode with all valid parameters', function () {
    const gain = 0.5;

    const virtualNodeParams = [{
      id: 0,
      node: 'gain',
      params: {
        gain: gain,
      },
      output: 'output',
    }];

    virtualAudioGraph.update(virtualNodeParams);
    const audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.constructor).toBe(GainNode);
    expect(audioNode.gain.value).toBe(gain);
  });

  it('creates BiquadFilterNode with all valid parameters', function () {
    const type = 'peaking';
    const frequency = 500;
    const detune = 6;
    const Q = 0.5;

    const virtualNodeParams = [{
      id: 0,
      node: 'biquadFilter',
      params: {
        type: type,
        frequency: frequency,
        detune: detune,
        Q: Q,
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

  it('creates DelayNode with all valid parameters', function () {
    const delayTime = 2;
    const maxDelayTime = 5;

    const virtualNodeParams = [{
      id: 0,
      node: 'delay',
      params: {
        delayTime: delayTime,
        maxDelayTime: maxDelayTime,
      },
      output: 'output',
    }];

    virtualAudioGraph.update(virtualNodeParams);
    const audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.constructor).toBe(DelayNode);
    expect(audioNode.delayTime.value).toBe(delayTime);
  });

  it('creates StereoPannerNode with all valid parameters', function () {
    const pan = 1;

    const virtualNodeParams = [{
      id: 0,
      node: 'stereoPanner',
      params: {
        pan: pan,
      },
      output: 'output',
    }];

    virtualAudioGraph.update(virtualNodeParams);
    const audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.constructor.name).toBe('StereoPannerNode');
    expect(audioNode.pan.value).toBe(pan);
  });
});
