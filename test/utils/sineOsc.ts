import * as V from '../../src'

export default V.createNode(params => {
  const frequency = params.frequency
  const gain = params.gain
  const startTime = params.startTime
  const stopTime = params.stopTime

  return {
    0: V.gain(['output'], { gain }),
    1: V.oscillator(0, {
      frequency,
      startTime,
      stopTime,
      type: 'sine',
    }),
  }
})
