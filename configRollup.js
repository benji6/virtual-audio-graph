import babel from 'rollup-plugin-babel'

export default {
  dest: 'dist/index.js',
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: ['es2015-rollup']
    })
  ]
}
