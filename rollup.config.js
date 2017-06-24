import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup'

export default {
  dest: 'dist/index.js',
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    babel(babelrc()),
  ],
}
