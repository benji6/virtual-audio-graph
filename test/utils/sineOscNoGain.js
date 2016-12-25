module.exports = params => {
  const frequency = params.frequency || 440
  const startTime = params.startTime
  const stopTime = params.stopTime

  return {
    0: ['oscillator', 'output', {
      frequency,
      startTime,
      stopTime,
      type: 'sine',
    }],
  }
}
