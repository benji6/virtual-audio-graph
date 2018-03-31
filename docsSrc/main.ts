import createVirtualAudioGraph, {
  createNode,
  delay,
  gain,
  oscillator,
  stereoPanner,
} from '../src/index'

const virtualAudioGraph = createVirtualAudioGraph()

const examples = [
  () => {
    const { currentTime } = virtualAudioGraph

    virtualAudioGraph.update({
      0: gain('output', { gain: 0.5 }),
      1: oscillator(0, { stopTime: currentTime + 1 }),
    })
  },
  () => {
    const { currentTime } = virtualAudioGraph

    virtualAudioGraph.update({
      0: gain('output', { gain: 0.2 }),
      1: oscillator(0, {
        frequency: 440,
        stopTime: currentTime + 2.5,
        type: 'sawtooth',
      }),
      2: oscillator(0, {
        detune: 4,
        frequency: 554.365,
        startTime: currentTime + 0.5,
        stopTime: currentTime + 2.5,
        type: 'square',
      }),
      3: oscillator(0, {
        detune: -2,
        frequency: 660,
        startTime: currentTime + 1,
        stopTime: currentTime + 2.5,
        type: 'triangle',
      }),
    })
  },
  () => {
    const { currentTime } = virtualAudioGraph

    virtualAudioGraph.update({
      0: gain('output', { gain: 0.2 }),
      1: oscillator(0, { stopTime: currentTime + 3 }),
      2: gain({ destination: 'frequency', key: '1' }, { gain: 350 }),
      3: oscillator([2, 'output'], { frequency: 1, type: 'triangle' }),
    })
  },
  () => {
    const { currentTime } = virtualAudioGraph

    virtualAudioGraph.update({
      0: gain('output', { gain: 0.5 }),
      1: oscillator(0, {
        frequency: ['setValueAtTime', 660, currentTime + 1],
        stopTime: currentTime + 2,
      }),
    })
  },
  () => {
    const { currentTime } = virtualAudioGraph

    virtualAudioGraph.update({
      0: gain('output', { gain: 0.5 }),
      1: oscillator(0, {
        frequency: [
          ['setValueAtTime', 110, currentTime],
          ['linearRampToValueAtTime', 880, currentTime + 1],
        ],
        stopTime: currentTime + 2,
      }),
    })
  },
  () => {
    const { currentTime } = virtualAudioGraph

    virtualAudioGraph.update({
      0: gain('output', { gain: 0.5 }),
      1: oscillator(0, {
        frequency: [
          ['setValueAtTime', 110, currentTime],
          ['exponentialRampToValueAtTime', 880, currentTime + 1],
        ],
        stopTime: currentTime + 2,
      }),
    })
  },
  () => {
    const { currentTime } = virtualAudioGraph

    virtualAudioGraph.update({
      0: gain('output', { gain: 0.5 }),
      1: oscillator(0, {
        frequency: [
          ['setValueAtTime', 110, currentTime],
          ['setTargetAtTime', 880, currentTime, 1],
        ],
        stopTime: currentTime + 2,
      }),
    })
  },
  () => {
    const { currentTime } = virtualAudioGraph

    virtualAudioGraph.update({
      0: gain('output', { gain: 0.5 }),
      1: oscillator(0, {
        frequency: [
          ['setValueCurveAtTime', Float32Array.of(440, 880, 110, 1760), currentTime, 2],
        ],
        stopTime: currentTime + 3,
      }),
    })
  },
  () => {
    const osc = createNode(({
      gain: gainValue,
      startTime,
      stopTime,
      ...rest,
    }) => {
      const duration = stopTime - startTime
      return {
        0: gain('output', {
          gain: [
            ['setValueAtTime', 0, startTime],
            ['linearRampToValueAtTime', gainValue, startTime + duration * 0.15],
            ['setValueAtTime', gainValue, stopTime - duration * 0.25],
            ['linearRampToValueAtTime', 0, stopTime],
          ],
        }),
        1: oscillator(0, { startTime, stopTime, ...rest }),
      }
    })

    const { currentTime } = virtualAudioGraph

    virtualAudioGraph.update({
      0: osc('output', {
        frequency: 110,
        gain: 0.2,
        startTime: currentTime,
        stopTime: currentTime + 1,
        type: 'square',
      }),
    })
  },
  () => {
    const osc = createNode(({
      gain: gainValue,
      startTime,
      stopTime,
      ...rest,
    }) => {
      const duration = stopTime - startTime
      return {
        0: gain('output', {
          gain: [
            ['setValueAtTime', 0, startTime],
            ['linearRampToValueAtTime', gainValue, startTime + duration * 0.15],
            ['setValueAtTime', gainValue, stopTime - duration * 0.25],
            ['linearRampToValueAtTime', 0, stopTime],
          ],
        }),
        1: oscillator(0, { startTime, stopTime, ...rest }),
      }
    })

    const oscBank = createNode(({
      frequency,
      ...rest,
    }) => ({
      0: osc('output', {
        frequency,
        gain: 0.2,
        type: 'square',
        ...rest,
      }),
      1: osc('output', {
        detune: 7,
        frequency: frequency / 4,
        gain: 0.4,
        type: 'sawtooth',
        ...rest,
      }),
      2: osc('output', {
        gain: 0.1,
        detune: -4,
        frequency: frequency * 1.5,
        type: 'triangle',
        ...rest,
      }),
    }))

    const { currentTime } = virtualAudioGraph

    virtualAudioGraph.update({
      0: oscBank('output', {
        frequency: 440,
        startTime: currentTime,
        stopTime: currentTime + 1,
      }),
    })
  },
  () => {
    const pingPongDelay = createNode(({
      decay,
      delayTime,
    }) => ({
      0: stereoPanner('output', { pan: -1 }),
      1: stereoPanner('output', { pan: 1 }),
      2: delay([1, 5], { delayTime, maxDelayTime: delayTime }),
      3: gain(2, { gain: decay }),
      4: delay([0, 3], { delayTime, maxDelayTime: delayTime }),
      5: gain(4, { gain: decay }, 'input'), // connections will be made here
    }))

    const { currentTime } = virtualAudioGraph

    virtualAudioGraph.update({
      0: pingPongDelay('output', {
        decay: 0.8,
        delayTime: 0.25,
      }),
      1: oscillator([0, 'output'], { stopTime: currentTime + .2 }),
    })
  },
  () => {
    const osc = createNode(({
      gain: gainValue,
      startTime,
      stopTime,
      ...rest,
    }) => {
      const duration = stopTime - startTime
      return {
        0: gain('output', {
          gain: [
            ['setValueAtTime', 0, startTime],
            ['linearRampToValueAtTime', gainValue, startTime + duration * 0.15],
            ['setValueAtTime', gainValue, stopTime - duration * 0.25],
            ['linearRampToValueAtTime', 0, stopTime],
          ],
        }),
        1: oscillator(0, { startTime, stopTime, ...rest }),
      }
    })

    const oscBank = createNode(({
      frequency,
      ...rest,
    }) => ({
      0: osc('output', {
        frequency,
        gain: 0.2,
        type: 'square',
        ...rest,
      }),
      1: osc('output', {
        detune: 7,
        frequency: frequency / 4,
        gain: 0.4,
        type: 'sawtooth',
        ...rest,
      }),
      2: osc('output', {
        gain: 0.1,
        detune: -4,
        frequency: frequency * 1.5,
        type: 'triangle',
        ...rest,
      }),
    }))

    const pingPongDelay = createNode(({
      decay,
      delayTime,
    }) => ({
      0: stereoPanner('output', { pan: -1 }),
      1: stereoPanner('output', { pan: 1 }),
      2: delay([1, 5], { delayTime, maxDelayTime: delayTime }),
      3: gain(2, { gain: decay }),
      4: delay([0, 3], { delayTime, maxDelayTime: delayTime }),
      5: gain(4, { gain: decay }, 'input'),
    }))

    const oscillators = createNode(({
      currentTime = virtualAudioGraph.currentTime,
      notes,
      noteLength,
    }) => notes.reduce(
      (acc, frequency, i) => {
        const startTime = currentTime + noteLength * 2 * i
        acc[i] = oscBank('output', {
          frequency,
          startTime,
          stopTime: startTime + noteLength,
        })
        return acc
      },
      {}),
    )

    const chromaticScale = n => 440 * Math.pow(2, n / 12)
    const noteLength = 0.075
    const up = Array.apply(null, { length: 16 }).map((_, i) => chromaticScale(i))
    const down = [...up].reverse()

    virtualAudioGraph.update({
      1: pingPongDelay('output', {
        decay: 0.8,
        delayTime: noteLength * 1.55,
      }),
      2: gain(['output', 1], { gain: 0.25 }),
      3: oscillators(['output', 1], {
        noteLength,
        notes: [...up, ...down],
      }),
    })
  },
]

const playButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.button-play')
const stopButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.button-stop')

for (let i = 0; i < playButtons.length; i++) {
  playButtons[i].onclick = examples[i]
}

for (let i = 0; i < stopButtons.length; i++) {
  stopButtons[i].onclick = () => virtualAudioGraph.update({})
}
