import del from 'del';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import istanbul from 'gulp-istanbul';
import jasmine from 'gulp-jasmine';
import runSequence from 'run-sequence';

const buildDestinationPath = 'dist';

gulp.task('pre-test', () => gulp
  .src(['src/**/*.js', 'dist/**/*.js'])
  .pipe(istanbul())
  .pipe(istanbul.hookRequire()));

gulp.task('clean', () => del(`${buildDestinationPath}/**/*`));

gulp.task('lint', () => gulp
  .src(['spec/**/*', 'src/**/*'])
  .pipe(eslint())
  .pipe(eslint.formatEach()));

gulp.task('spec', () => gulp
  .src('spec/index.js')
  .pipe(jasmine())
  .pipe(istanbul.writeReports())
  .pipe(istanbul.enforceThresholds({thresholds: {global: 100}})));

gulp.task('watch', () => {
  gulp.watch('src/**/*.js', () => runSequence(['lint'], 'spec'));
  gulp.watch('spec/**/*.js*', ['spec']);
});

gulp.task('default', () => runSequence(['lint', 'watch'], 'spec'));
