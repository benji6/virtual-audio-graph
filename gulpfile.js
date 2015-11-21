import del from 'del';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import jasmine from 'gulp-jasmine';
import runSequence from 'run-sequence';

const buildDestinationPath = 'dist';

gulp.task('clean', () => del(`${buildDestinationPath}/**/*`));

gulp.task('lint', () => gulp
  .src(['spec/**/*', 'src/**/*'])
  .pipe(eslint())
  .pipe(eslint.formatEach()));

gulp.task('spec', () => gulp
  .src('spec/index.js')
  .pipe(jasmine()));

gulp.task('watch', () => {
  gulp.watch('src/**/*.js', () => runSequence(['lint'], 'spec'));
  gulp.watch('spec/**/*.js*', ['spec']);
});

gulp.task('default', () => runSequence(['lint', 'watch'], 'spec'));
