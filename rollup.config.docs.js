import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup'

export default {
  dest: 'docs/main.js',
  entry: 'docsSrc/main.js',
  format: 'cjs',
  plugins: [
    babel(babelrc()),
  ],
}
