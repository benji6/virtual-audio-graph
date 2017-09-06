import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup'

export default {
  input: 'docsSrc/main.js',
  output: {
    file: 'docs/main.js',
    format: 'cjs',
  },
  plugins: [
    babel(babelrc()),
  ],
}
