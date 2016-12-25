module.exports = x => {
  const params = x || {}
  const decay = params.decay || 1 / 3
  const delayTime = params.delayTime || 1 / 3
  const maxDelayTime = params.maxDelayTime || 1 / 3

  return {
    1: ['stereoPanner', 'output', {pan: 1}],
    2: ['delay', [1, 'five'], {delayTime, maxDelayTime}],
    3: ['gain', 2, {gain: decay}],
    4: ['delay', ['zero', 3], {delayTime, maxDelayTime}],
    five: ['gain', 4, {gain: decay}, 'input'],
    zero: ['stereoPanner', 'output', {pan: -1}],
  }
}
