import createVirtualAudioGraph, {
  bufferSource,
  createNode,
  createWorkletNode,
  delay,
  gain,
  INPUT,
  oscillator,
  OUTPUT,
  stereoPanner,
} from "../src/index";

const audioContext = new AudioContext();
const virtualAudioGraph = createVirtualAudioGraph({ audioContext });

const kittenBuffer = (async () => {
  const response = await fetch("kitten.wav");
  const data = await response.arrayBuffer();
  return audioContext.decodeAudioData(data);
})();

const examples = [
  () => {
    const { currentTime } = virtualAudioGraph;

    virtualAudioGraph.update({
      0: gain(OUTPUT, { gain: 0.5 }),
      1: oscillator(0, { stopTime: currentTime + 1 }),
    });
  },
  () => {
    const { currentTime } = virtualAudioGraph;

    virtualAudioGraph.update({
      0: gain(OUTPUT, { gain: 0.2 }),
      1: oscillator(0, {
        frequency: 440,
        stopTime: currentTime + 2.5,
        type: "sawtooth",
      }),
      2: oscillator(0, {
        detune: 4,
        frequency: 554.365,
        startTime: currentTime + 0.5,
        stopTime: currentTime + 2.5,
        type: "square",
      }),
      3: oscillator(0, {
        detune: -2,
        frequency: 660,
        startTime: currentTime + 1,
        stopTime: currentTime + 2.5,
        type: "triangle",
      }),
    });
  },
  () => {
    const { currentTime } = virtualAudioGraph;

    virtualAudioGraph.update({
      0: gain(OUTPUT, { gain: 0.2 }),
      1: oscillator(0, { stopTime: currentTime + 3 }),
      2: gain({ destination: "frequency", key: 1 }, { gain: 350 }),
      3: oscillator([2, OUTPUT], { frequency: 1, type: "triangle" }),
    });
  },
  () => {
    const { currentTime } = virtualAudioGraph;

    virtualAudioGraph.update({
      0: gain(OUTPUT, { gain: 0.5 }),
      1: oscillator(0, {
        frequency: ["setValueAtTime", 660, currentTime + 1],
        stopTime: currentTime + 2,
      }),
    });
  },
  () => {
    const { currentTime } = virtualAudioGraph;

    virtualAudioGraph.update({
      0: gain(OUTPUT, { gain: 0.5 }),
      1: oscillator(0, {
        frequency: [
          ["setValueAtTime", 110, currentTime],
          ["linearRampToValueAtTime", 880, currentTime + 1],
        ],
        stopTime: currentTime + 2,
      }),
    });
  },
  () => {
    const { currentTime } = virtualAudioGraph;

    virtualAudioGraph.update({
      0: gain(OUTPUT, { gain: 0.5 }),
      1: oscillator(0, {
        frequency: [
          ["setValueAtTime", 110, currentTime],
          ["exponentialRampToValueAtTime", 880, currentTime + 1],
        ],
        stopTime: currentTime + 2,
      }),
    });
  },
  () => {
    const { currentTime } = virtualAudioGraph;

    virtualAudioGraph.update({
      0: gain(OUTPUT, { gain: 0.5 }),
      1: oscillator(0, {
        frequency: [
          ["setValueAtTime", 110, currentTime],
          ["setTargetAtTime", 880, currentTime, 1],
        ],
        stopTime: currentTime + 2,
      }),
    });
  },
  () => {
    const { currentTime } = virtualAudioGraph;

    virtualAudioGraph.update({
      0: gain(OUTPUT, { gain: 0.5 }),
      1: oscillator(0, {
        frequency: [
          [
            "setValueCurveAtTime",
            Float32Array.of(440, 880, 110, 1760),
            currentTime,
            2,
          ],
        ],
        stopTime: currentTime + 3,
      }),
    });
  },
  () => {
    const osc = createNode(
      ({ gain: gainValue, startTime, stopTime, ...rest }) => {
        const duration = stopTime - startTime;
        return {
          0: gain(OUTPUT, {
            gain: [
              ["setValueAtTime", 0, startTime],
              [
                "linearRampToValueAtTime",
                gainValue,
                startTime + duration * 0.15,
              ],
              ["setValueAtTime", gainValue, stopTime - duration * 0.25],
              ["linearRampToValueAtTime", 0, stopTime],
            ],
          }),
          1: oscillator(0, { startTime, stopTime, ...rest }),
        };
      },
    );

    const { currentTime } = virtualAudioGraph;

    virtualAudioGraph.update({
      0: osc(OUTPUT, {
        frequency: 110,
        gain: 0.2,
        startTime: currentTime,
        stopTime: currentTime + 1,
        type: "square",
      }),
    });
  },
  () => {
    const osc = createNode(
      ({ gain: gainValue, startTime, stopTime, ...rest }) => {
        const duration = stopTime - startTime;
        return {
          0: gain(OUTPUT, {
            gain: [
              ["setValueAtTime", 0, startTime],
              [
                "linearRampToValueAtTime",
                gainValue,
                startTime + duration * 0.15,
              ],
              ["setValueAtTime", gainValue, stopTime - duration * 0.25],
              ["linearRampToValueAtTime", 0, stopTime],
            ],
          }),
          1: oscillator(0, { startTime, stopTime, ...rest }),
        };
      },
    );

    const oscBank = createNode(({ frequency, ...rest }) => ({
      0: osc(OUTPUT, {
        frequency,
        gain: 0.2,
        type: "square",
        ...rest,
      }),
      1: osc(OUTPUT, {
        detune: 7,
        frequency: frequency / 4,
        gain: 0.4,
        type: "sawtooth",
        ...rest,
      }),
      2: osc(OUTPUT, {
        gain: 0.1,
        detune: -4,
        frequency: frequency * 1.5,
        type: "triangle",
        ...rest,
      }),
    }));

    const { currentTime } = virtualAudioGraph;

    virtualAudioGraph.update({
      0: oscBank(OUTPUT, {
        frequency: 440,
        startTime: currentTime,
        stopTime: currentTime + 1,
      }),
    });
  },
  () => {
    const pingPongDelay = createNode(({ decay, delayTime }) => ({
      0: stereoPanner(OUTPUT, { pan: -1 }),
      1: stereoPanner(OUTPUT, { pan: 1 }),
      2: delay([1, 5], { delayTime, maxDelayTime: delayTime }),
      3: gain(2, { gain: decay }),
      4: delay([0, 3], { delayTime, maxDelayTime: delayTime }),
      5: gain(4, { gain: decay }, INPUT), // connections will be made here
    }));

    const { currentTime } = virtualAudioGraph;

    virtualAudioGraph.update({
      0: pingPongDelay(OUTPUT, {
        decay: 0.8,
        delayTime: 0.25,
      }),
      1: oscillator([0, OUTPUT], { stopTime: currentTime + 0.2 }),
    });
  },
  async () => {
    const buffer = await kittenBuffer;

    const { currentTime } = virtualAudioGraph;

    virtualAudioGraph.update({
      0: gain(OUTPUT, { gain: 0.75 }),
      1: bufferSource(0, {
        buffer,
        playbackRate: 1.5,
        startTime: currentTime,
        stopTime: currentTime + 1,
      }),
      2: bufferSource(0, {
        buffer,
        playbackRate: 1,
        startTime: currentTime + 0.5,
        stopTime: currentTime + 1.5,
      }),
      3: bufferSource(0, {
        buffer,
        playbackRate: 0.5,
        startTime: currentTime + 1,
        stopTime: currentTime + 2,
      }),
    });
  },
  () =>
    audioContext.audioWorklet.addModule("audioWorklets/noise.js").then(() => {
      const noise = createWorkletNode("noise");

      virtualAudioGraph.update({
        0: noise(OUTPUT, { amplitude: 0.25 }),
      });
    }),
  () =>
    audioContext.audioWorklet
      .addModule("audioWorklets/bitCrusher.js")
      .then(() => {
        const bitCrusher = createWorkletNode("bitCrusher");

        const { currentTime } = virtualAudioGraph;

        virtualAudioGraph.update({
          0: bitCrusher(OUTPUT, {
            bitDepth: 1,
            frequencyReduction: [
              ["setValueAtTime", 0.01, currentTime],
              ["linearRampToValueAtTime", 0.05, currentTime + 2],
              ["exponentialRampToValueAtTime", 0.01, currentTime + 4],
            ],
          }),
          1: oscillator(0, {
            frequency: 5000,
            stopTime: currentTime + 4,
            type: "sawtooth",
          }),
        });
      }),
  () => {
    const osc = createNode(
      ({ gain: gainValue, startTime, stopTime, ...rest }) => {
        const duration = stopTime - startTime;
        return {
          0: gain(OUTPUT, {
            gain: [
              ["setValueAtTime", 0, startTime],
              [
                "linearRampToValueAtTime",
                gainValue,
                startTime + duration * 0.15,
              ],
              ["setValueAtTime", gainValue, stopTime - duration * 0.25],
              ["linearRampToValueAtTime", 0, stopTime],
            ],
          }),
          1: oscillator(0, { startTime, stopTime, ...rest }),
        };
      },
    );

    const oscBank = createNode(({ frequency, ...rest }) => ({
      0: osc(OUTPUT, {
        frequency,
        gain: 0.2,
        type: "square",
        ...rest,
      }),
      1: osc(OUTPUT, {
        detune: 7,
        frequency: frequency / 4,
        gain: 0.4,
        type: "sawtooth",
        ...rest,
      }),
      2: osc(OUTPUT, {
        gain: 0.1,
        detune: -4,
        frequency: frequency * 1.5,
        type: "triangle",
        ...rest,
      }),
    }));

    const pingPongDelay = createNode(({ decay, delayTime }) => ({
      0: stereoPanner(OUTPUT, { pan: -1 }),
      1: stereoPanner(OUTPUT, { pan: 1 }),
      2: delay([1, 5], { delayTime, maxDelayTime: delayTime }),
      3: gain(2, { gain: decay }),
      4: delay([0, 3], { delayTime, maxDelayTime: delayTime }),
      5: gain(4, { gain: decay }, INPUT),
    }));

    const oscillators = createNode(
      ({ currentTime = virtualAudioGraph.currentTime, notes, noteLength }) =>
        notes.reduce((acc, frequency, i) => {
          const startTime = currentTime + noteLength * 2 * i;
          acc[i] = oscBank(OUTPUT, {
            frequency,
            startTime,
            stopTime: startTime + noteLength,
          });
          return acc;
        }, {}),
    );

    const chromaticScale = (n) => 440 * Math.pow(2, n / 12);
    const noteLength = 0.075;
    const up = Array.apply(null, { length: 16 }).map((_, i) =>
      chromaticScale(i),
    );
    const down = [...up].reverse();

    virtualAudioGraph.update({
      1: pingPongDelay(OUTPUT, {
        decay: 0.8,
        delayTime: noteLength * 1.55,
      }),
      2: gain([OUTPUT, 1], { gain: 0.25 }),
      3: oscillators([OUTPUT, 1], {
        noteLength,
        notes: [...up, ...down],
      }),
    });
  },
  async () => {
    const offlineAudioContext = new OfflineAudioContext(1, 44100, 44100);
    const offlineVirtualAudioGraph = createVirtualAudioGraph({
      audioContext: offlineAudioContext,
    });
    offlineVirtualAudioGraph.update({
      0: gain(OUTPUT, { gain: 0.5 }),
      1: oscillator(0),
    });
    const buffer = await offlineAudioContext.startRendering();
    const bufferSourceNode = audioContext.createBufferSource();
    bufferSourceNode.buffer = buffer;
    bufferSourceNode.connect(audioContext.destination);
    bufferSourceNode.start();
  },
];

const playButtons: NodeListOf<HTMLButtonElement> =
  document.querySelectorAll(".button-play");
const stopButtons: NodeListOf<HTMLButtonElement> =
  document.querySelectorAll(".button-stop");

for (let i = 0; i < playButtons.length; i++) {
  playButtons[i].onclick = examples[i];
}

for (let i = 0; i < stopButtons.length; i++) {
  stopButtons[i].onclick = () => virtualAudioGraph.update({});
}
