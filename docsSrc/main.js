import createVirtualAudioGraph from '../src/index'

const audioContext = new AudioContext()

const virtualAudioGraph = createVirtualAudioGraph({
  audioContext,
  output: audioContext.destination,
})

const example1 = () => {
  const {currentTime} = virtualAudioGraph

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: 0.2}],
    1: ['oscillator', 0, {
      frequency: 440,
      stopTime: currentTime + 1,
      type: 'square',
    }],
    2: ['oscillator', 0, {
      detune: 4,
      frequency: 660,
      startTime: currentTime + 0.5,
      stopTime: currentTime + 1.5,
      type: 'sawtooth',
    }],
  })
}

const example2 = () => {
  const {currentTime} = virtualAudioGraph

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: 0.2}],
    1: ['oscillator', 0, {stopTime: currentTime + 3}],
    2: ['gain', {destination: 'frequency', key: 1}, {gain: 10}],
    3: ['oscillator', [2, 'output'], {frequency: 1, type: 'triangle'}],
  })
}

const example3 = () => {
  const chromaticScale = n => 440 * Math.pow(2, n / 12)

  const pingPongDelay = ({
    decay,
    delayTime,
  }) => ({
    0: ['stereoPanner', 'output', {pan: -1}],
    1: ['stereoPanner', 'output', {pan: 1}],
    2: ['delay', [1, 'five'], {delayTime, maxDelayTime: delayTime}],
    3: ['gain', 2, {gain: decay}],
    4: ['delay', [0, 3], {delayTime, maxDelayTime: delayTime}],
    five: ['gain', 4, {gain: decay}, 'input'],
  })

  const oscillators = ({
    currentTime = virtualAudioGraph.currentTime,
    notes,
    noteLength,
  }) => notes.reduce((acc, frequency, i) => {
    const startTime = currentTime + noteLength * 2 * i
    acc[i] = ['oscillator', 'output', {
      frequency,
      startTime,
      stopTime: startTime + noteLength,
    }]
    return acc
  }, {})

  const noteLength = 0.075

  const up = Array.from({length: 16}, (_, i) => chromaticScale(i))
  const down = [...up].reverse()

  virtualAudioGraph.update({
    0: ['gain', 'output', {gain: 0.2}],
    1: [pingPongDelay, 0, {
      decay: 1 / 2,
      delayTime: noteLength * 3 / 2,
    }],
    2: ['gain', [0, 1], {gain: 1 / 4}],
    3: [oscillators, [0, 1], {
      noteLength,
      notes: [...up, ...down],
    }],
  })
}

document.getElementById('example1').onclick = example1
document.getElementById('example2').onclick = example2
document.getElementById('example3').onclick = example3
