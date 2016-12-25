const V = require('../..')

module.exports = V.createNode(() => ({
  0: V.gain('output', null, 'input'),
}))
