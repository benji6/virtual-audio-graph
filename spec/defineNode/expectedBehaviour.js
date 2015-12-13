/* global beforeEach describe expect it */
import gainWithNoParams from '../tools/gainWithNoParams';
import pingPongDelay from '../tools/pingPongDelay';
import sineOsc from '../tools/sineOsc';
import squareOsc from '../tools/squareOsc';
import sineOscNoGain from '../tools/sineOscNoGain';
import twoGains from '../tools/twoGains';

export default createVirtualAudioGraph => {
  describe('virtualAudioGraph.defineNode - expected behaviour:', () => {
    let audioContext;
    let virtualAudioGraph;

    beforeEach(() => {
      audioContext = new AudioContext();
      virtualAudioGraph = createVirtualAudioGraph({
        audioContext,
        output: audioContext.destination,
      });
    });

    it('returns itself', () => {
      expect(virtualAudioGraph.defineNodes({pingPongDelay})).toBe(virtualAudioGraph);
    });

    it('creates a custom node which can be reused in virtualAudioGraph.update', () => {
      virtualAudioGraph.defineNodes({pingPongDelay});

      const virtualGraphParams = {
        0: ['gain', 'output', {gain: 0.5}],
        1: ['pingPongDelay', 0, {decay: 0.5, delayTime: 0.5, maxDelayTime: 0.5}],
        2: ['oscillator', 1],
      };

      expect(virtualAudioGraph.update(virtualGraphParams)).toBe(virtualAudioGraph);
      /* eslint-disable */
      expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>', Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }), Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] });
      /* eslint-enable */
    });

    it('can define a custom node built of other custom nodes', () => {
      virtualAudioGraph.defineNodes({pingPongDelay});

      const quietPingPongDelay = () => ({
        0: ['gain', 'output'],
        1: ['pingPongDelay', 0],
        2: ['oscillator', 1],
      });

      virtualAudioGraph.defineNodes({quietPingPongDelay});

      const virtualGraphParams = {
        0: ['gain', 'output', {gain: 0.5}],
        1: ['quietPingPongDelay', 0],
        2: ['pingPongDelay', 1],
        3: ['oscillator', 2],
      };

      expect(virtualAudioGraph.update(virtualGraphParams)).toBe(virtualAudioGraph);
      /* eslint-disable */
      expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ '<circular:DelayNode>', Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.3333333333333333, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }), Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }) ] });
      /* eslint-enable */
    });

    it('can define a custom node which can be updated', () => {
      virtualAudioGraph.defineNodes({pingPongDelay});

      const virtualGraphParams = {
        0: ['gain', 'output', {gain: 0.5}],
        1: ['pingPongDelay', 0, {decay: 0.5, delayTime: 0.5, maxDelayTime: 0.5}],
        2: ['oscillator', 1],
      };

      virtualAudioGraph.update(virtualGraphParams);

      /* eslint-disable */
      expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>', Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }), Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] });
      /* eslint-enable */
      virtualGraphParams[1][2].decay = 0.6;

      virtualAudioGraph.update(virtualGraphParams);
      /* eslint-disable */
      expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.6, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.6, inputs: [  ] }), inputs: [ '<circular:DelayNode>', Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.6, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.6, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }), Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] });
      /* eslint-enable */
    });

    it('can define a custom node which can be removed', () => {
      virtualAudioGraph.defineNodes({pingPongDelay});

      const virtualGraphParams = {
        0: ['gain', 'output', {gain: 0.5}],
        1: ['pingPongDelay', 0, {decay: 0.5, delayTime: 0.5, maxDelayTime: 0.5}],
        2: ['oscillator', 1],
      };

      virtualAudioGraph.update(virtualGraphParams);

      /* eslint-disable */
      expect(audioContext.toJSON()).toEqual({ name: 'AudioDestinationNode', inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'StereoPannerNode', pan: Object({ value: 1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>', Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] }), Object({ name: 'StereoPannerNode', pan: Object({ value: -1, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'DelayNode', delayTime: Object({ value: 0.5, inputs: [  ] }), inputs: [ Object({ name: 'GainNode', gain: Object({ value: 0.5, inputs: [  ] }), inputs: [ '<circular:DelayNode>' ] }) ] }), Object({ name: 'OscillatorNode', type: 'sine', frequency: Object({ value: 440, inputs: [  ] }), detune: Object({ value: 0, inputs: [  ] }), inputs: [  ] }) ] }) ] }) ] }) ] }) ] });
      /* eslint-enable */
      virtualGraphParams[1][2].decay = 0.6;

      virtualAudioGraph.update({
        0: ['gain', 'output', {gain: 0.5}],
      });

      expect(audioContext.toJSON()).toEqual({
        name: 'AudioDestinationNode',
        inputs: [
          {
            name: 'GainNode',
            gain: {
              value: 0.5,
              inputs: [],
            },
            inputs: [],
          },
        ],
      });
    });
    it('can define a custom node which can be replaced with another on update', () => {
      virtualAudioGraph.defineNodes({sineOsc, squareOsc});

      virtualAudioGraph.update({
        0: ['gain', 'output', {gain: 0.5}],
        1: ['squareOsc', 0, {gain: 0.5,
                             frequency: 220,
                             startTime: 1,
                             stopTime: 2}],
      });

      /* eslint-disable */
      expect(audioContext.toJSON()).toEqual({"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"OscillatorNode","type":"square","frequency":{"value":220,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]},{"name":"OscillatorNode","type":"square","frequency":{"value":220,"inputs":[]},"detune":{"value":3,"inputs":[]},"inputs":[]}]}]}]});
      /* eslint-enable */

      virtualAudioGraph.update({
        0: ['gain', 'output', {gain: 0.5}],
        1: ['sineOsc', 0, {gain: 0.5,
                           frequency: 220,
                           startTime: 1,
                           stopTime: 2}],
      });
      /* eslint-disable */
      expect(audioContext.toJSON()).toEqual({"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"OscillatorNode","type":"sine","frequency":{"value":220,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]});
      /* eslint-enable */
    });
    it('can define a custom node which has an input node with no params', () => {
      virtualAudioGraph.defineNodes({gainWithNoParams, sineOsc});
      virtualAudioGraph.update({
        0: ['gainWithNoParams', 'output'],
        1: ['sineOsc', 0, {gain: 0.5,
                           frequency: 220,
                           startTime: 1,
                           stopTime: 2}],
      });
      /* eslint-disable */
      expect(audioContext.toJSON()).toEqual({"name":"AudioDestinationNode","inputs":[{"name":"GainNode","gain":{"value":1,"inputs":[]},"inputs":[{"name":"GainNode","gain":{"value":0.5,"inputs":[]},"inputs":[{"name":"OscillatorNode","type":"sine","frequency":{"value":220,"inputs":[]},"detune":{"value":0,"inputs":[]},"inputs":[]}]}]}]});
      /* eslint-enable */
    });
    it('can define custom nodes which can be reordered', () => {
      virtualAudioGraph.defineNodes({twoGains, sineOsc});
      const expectedData = {
        name:'AudioDestinationNode',
        inputs:[
          {
            name:'GainNode',
            gain:{value:1, inputs:[]},
            inputs:[
              {
                name:'GainNode',
                gain:{
                  value:1,
                  inputs:[],
                },
                inputs:[
                  {
                    name:'GainNode',
                    gain:{value:1, inputs:[]},
                    inputs:[
                      {
                        name:'GainNode', gain:{
                          value:0.3,
                          inputs:[],
                        },
                        inputs:[
                          {
                            name:'OscillatorNode',
                            type:'sine',
                            frequency:{value: 500, inputs:[]},
                            detune:{value:0, inputs:[]},
                            inputs:[],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      virtualAudioGraph.update({
        'channel:0-type:effect-id:0':['gain', 'output'],
        'channel:0-type:effect-id:1':['twoGains', 'channel:0-type:effect-id:0'],
        'channel:[0]-type:source-id:keyboard: 7':[
          'sineOsc',
          ['channel:0-type:effect-id:1'],
          {gain: 0.3, frequency: 500},
        ],
      });
      expect(audioContext.toJSON()).toEqual(expectedData);

      virtualAudioGraph.update({
        'channel:0-type:effect-id:0':['gain', 'channel:0-type:effect-id:1'],
        'channel:0-type:effect-id:1':['twoGains', 'output'],
        'channel:[0]-type:source-id:keyboard: 5':[
          'sineOsc',
          ['channel:0-type:effect-id:0'],
          {gain: 0.3, frequency: 500},
        ],
      });
      expect(audioContext.toJSON()).toEqual(expectedData);

      virtualAudioGraph.update({
        'channel:0-type:effect-id:0':['gain', 'output'],
        'channel:0-type:effect-id:1':['twoGains', 'channel:0-type:effect-id:0'],
        'channel:[0]-type:source-id:keyboard: 7':[
          'sineOsc',
          ['channel:0-type:effect-id:1'],
          {gain: 0.3, frequency: 500},
        ],
      });
      expect(audioContext.toJSON()).toEqual(expectedData);
    });
    it('custom nodes can override native nodes', () => {
      virtualAudioGraph.defineNodes({gain: sineOscNoGain});
      virtualAudioGraph.update({
        0: ['gain', 'output'],
      });
      expect(audioContext.toJSON()).toEqual({
        name: 'AudioDestinationNode',
        inputs: [{
          name: 'OscillatorNode',
          type: 'sine',
          frequency: {value: 440, inputs: []},
          detune: {value: 0, inputs: []},
          inputs: [],
        }],
      });
    });
  });
};
