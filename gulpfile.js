import del from 'del'
import gulp from 'gulp'
import istanbul from 'gulp-istanbul'
import jasmine from 'gulp-jasmine'

const buildDestinationPath = 'dist'

gulp.task('pre-test', () => gulp
  .src(['src/**/*.js', 'dist/**/*.js'])
  .pipe(istanbul())
  .pipe(istanbul.hookRequire()))

gulp.task('clean', () => del(`${buildDestinationPath}/**/*`))

gulp.task('spec', () => gulp
  .src('spec/index.js')
  .pipe(jasmine())
  .pipe(istanbul.writeReports())
  .pipe(istanbul.enforceThresholds({thresholds: {global: 100}})))

gulp.task('watch', () => {
  gulp.watch('src/**/*.js', 'spec')
  gulp.watch('spec/**/*.js*', ['spec'])
})

gulp.task('default', ['watch', 'spec'])
