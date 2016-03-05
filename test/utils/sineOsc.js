module.exports = params => {
  const frequency = params.frequency
  const gain = params.gain
  const startTime = params.startTime
  const stopTime = params.stopTime

  return {
    0: ['gain', ['output'], {gain}],
    1: ['oscillator', 0, {frequency,
                          type: 'sine',
                          startTime,
                          stopTime}]
  }
}
