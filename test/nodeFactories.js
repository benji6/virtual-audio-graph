const test = require('tape')
const {
  analyser,
  biquadFilter,
  bufferSource,
  channelMerger,
  channelSplitter,
  convolver,
  delay,
  dynamicsCompressor,
  gain,
  mediaElementSource,
  mediaStreamDestination,
  mediaStreamSource,
  oscillator,
  panner,
  stereoPanner,
  waveShaper,
} = require('..')

test('analyser', t => {
  t.throws(() => analyser(), 'throws an error when no output is provided')
  t.end()
})

test('biquadFilter', t => {
  t.throws(() => biquadFilter(), 'throws an error when no output is provided')
  t.end()
})

test('bufferSource', t => {
  t.throws(() => bufferSource(), 'throws an error when no output is provided')
  t.end()
})

test('channelMerger', t => {
  t.throws(() => channelMerger(), 'throws an error when no output is provided')
  t.end()
})

test('channelSplitter', t => {
  t.throws(() => channelSplitter(), 'throws an error when no output is provided')
  t.end()
})

test('convolver', t => {
  t.throws(() => convolver(), 'throws an error when no output is provided')
  t.end()
})

test('delay', t => {
  t.throws(() => delay(), 'throws an error when no output is provided')
  t.end()
})

test('dynamicsCompressor', t => {
  t.throws(() => dynamicsCompressor(), 'throws an error when no output is provided')
  t.end()
})

test('gain', t => {
  t.throws(() => gain(), 'throws an error when no output is provided')
  t.end()
})

test('mediaElementSource', t => {
  t.throws(() => mediaElementSource(), 'throws an error when no output is provided')
  t.end()
})

test('mediaStreamDestination', t => {
  t.doesNotThrow(() => mediaStreamDestination(), 'does not throw an error when no output is provided')
  t.end()
})

test('mediaStreamSource', t => {
  t.throws(() => mediaStreamSource(), 'throws an error when no output is provided')
  t.end()
})

test('oscillator', t => {
  t.throws(() => oscillator(), 'throws an error when no output is provided')
  t.end()
})

test('panner', t => {
  t.throws(() => panner(), 'throws an error when no output is provided')
  t.end()
})

test('stereoPanner', t => {
  t.throws(() => stereoPanner(), 'throws an error when no output is provided')
  t.end()
})

test('waveShaper', t => {
  t.throws(() => waveShaper(), 'throws an error when no output is provided')
  t.end()
})
