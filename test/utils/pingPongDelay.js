module.exports = x => {
  const params = x || {}
  const decay = params.decay || 1 / 3
  const delayTime = params.delayTime || 1 / 3
  const maxDelayTime = params.maxDelayTime || 1 / 3

  return {
    zero: ['stereoPanner', 'output', {pan: -1}],
    1: ['stereoPanner', 'output', {pan: 1}],
    2: ['delay', [1, 'five'], {maxDelayTime, delayTime}],
    3: ['gain', 2, {gain: decay}],
    4: ['delay', ['zero', 3], {maxDelayTime, delayTime}],
    five: ['gain', 4, {gain: decay}, 'input']
  }
}
