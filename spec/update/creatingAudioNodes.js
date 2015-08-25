/* global beforeEach describe expect it */
const VirtualAudioGraph = require('../../dist/index.js');

describe('virtualAudioGraph.update - creating AudioNodes: ', function () {
  var audioContext;
  var virtualAudioGraph;

  beforeEach(function () {
    audioContext = new AudioContext();
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext: audioContext,
    });
  });

  it('creates AnalyserNode with all valid parameters', function () {
    const params = {
      fftSize: 2048,
      minDecibels: -90,
      maxDecibels: -10,
      smoothingTimeConstant: 1,
    };

    const virtualGraphParams = {
      0: {
        node: 'analyser',
        params: params,
        output: 'output',
      },
    };

    virtualAudioGraph.update(virtualGraphParams);
    const audioNode = virtualAudioGraph.getAudioNodeById(0);
    expect(audioNode.constructor).toBe(AnalyserNode);
    expect(audioNode.fftSize).toBe(params.fftSize);
    expect(audioNode.frequencyBinCount).toBe(params.fftSize / 2);
    expect(audioNode.minDecibels).toBe(params.minDecibels);
    expect(audioNode.maxDecibels).toBe(params.maxDecibels);
    expect(audioNode.smoothingTimeConstant).toBe(params.smoothingTimeConstant);
    expect(audioNode.getFloatFrequencyData(new Float32Array(audioNode.frequencyBinCount))).toBeUndefined();
    expect(audioNode.getByteFrequencyData(new Uint8Array(audioNode.frequencyBinCount))).toBeUndefined();
    expect(audioNode.getFloatTimeDomainData(new Float32Array(audioNode.fftSize))).toBeUndefined();
    expect(audioNode.getByteTimeDomainData(new Uint8Array(audioNode.fftSize))).toBeUndefined();
  });

  it('creates OscillatorNode with all valid parameters', function () {
    const params = {
      type: 'square',
      frequency: 440,
      detune: 4,
    };

    const virtualGraphParams = {
      0: {
        node: 'oscillator',
        params: params,
        output: 'output',
      },
    };

    virtualAudioGraph.update(virtualGraphParams);
    const audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.constructor).toBe(OscillatorNode);
    expect(audioNode.type).toBe(params.type);
    expect(audioNode.frequency.value).toBe(params.frequency);
    expect(audioNode.detune.value).toBe(params.detune);
  });

  it('creates GainNode with all valid parameters', function () {
    const gain = 0.5;

    const virtualGraphParams = {
      0: {
        node: 'gain',
        params: {
          gain: gain,
        },
        output: 'output',
      },
    };

    virtualAudioGraph.update(virtualGraphParams);
    const audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.constructor).toBe(GainNode);
    expect(audioNode.gain.value).toBe(gain);
  });

  it('creates BiquadFilterNode with all valid parameters', function () {
    const type = 'peaking';
    const frequency = 500;
    const detune = 6;
    const Q = 0.5;

    const virtualGraphParams = {
      0: {
        node: 'biquadFilter',
        params: {
          type: type,
          frequency: frequency,
          detune: detune,
          Q: Q,
        },
        output: 'output',
      },
    };

    virtualAudioGraph.update(virtualGraphParams);
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

    const virtualGraphParams = {
      0: {
        node: 'delay',
        params: {
          delayTime: delayTime,
          maxDelayTime: maxDelayTime,
        },
        output: 'output',
      },
    };

    virtualAudioGraph.update(virtualGraphParams);
    const audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.constructor).toBe(DelayNode);
    expect(audioNode.delayTime.value).toBe(delayTime);
  });

  it('creates StereoPannerNode with all valid parameters', function () {
    const pan = 1;

    const virtualGraphParams = {
      0: {
        node: 'stereoPanner',
        params: {
          pan: pan,
        },
        output: 'output',
      },
    };

    virtualAudioGraph.update(virtualGraphParams);
    const audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.constructor.name).toBe('StereoPannerNode');
    expect(audioNode.pan.value).toBe(pan);
  });

  it('creates PannerNode with all valid parameters', function () {
    const distanceModel = 'inverse';
    const panningModel = 'HRTF';
    const refDistance = 1;
    const maxDistance = 10000;
    const rolloffFactor = 1;
    const coneInnerAngle = 360;
    const coneOuterAngle = 0;
    const coneOuterGain = 0;
    const position = [0, 0, 0];
    const orientation = [1, 0, 0];

    const virtualGraphParams = {
      0: {
        node: 'panner',
        params: {
          coneInnerAngle: coneInnerAngle,
          coneOuterAngle: coneOuterAngle,
          coneOuterGain: coneOuterGain,
          distanceModel: distanceModel,
          orientation: orientation,
          panningModel: panningModel,
          position: position,
          maxDistance: maxDistance,
          refDistance: refDistance,
          rolloffFactor: rolloffFactor,
        },
        output: 'output',
      },
    };

    virtualAudioGraph.update(virtualGraphParams);
    const audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.constructor.name).toBe('PannerNode');
    expect(audioNode.coneInnerAngle).toBe(coneInnerAngle);
    expect(audioNode.coneOuterAngle).toBe(coneOuterAngle);
    expect(audioNode.coneOuterGain).toBe(coneOuterGain);
    expect(audioNode.distanceModel).toBe(distanceModel);
    expect(audioNode.panningModel).toBe(panningModel);
    expect(audioNode.refDistance).toBe(refDistance);
    expect(audioNode.rolloffFactor).toBe(rolloffFactor);
    expect(audioNode.maxDistance).toBe(maxDistance);
  });
});
