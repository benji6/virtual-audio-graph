const V = require('../..')

module.exports = V.createNode(() => ({
  0: V.gain('output'),
  1: V.gain(0, {}, 'input'),
}))
