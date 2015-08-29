import babel from 'gulp-babel';
import del from 'del';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import jasmine from 'gulp-jasmine';
import plumber from 'gulp-plumber';
import runSequence from 'run-sequence';

const buildDestinationPath = 'dist';

gulp.task('clean', () => del(`${buildDestinationPath}/**/*`));

gulp.task('js', () => gulp
  .src('src/**/*')
  .pipe(plumber())
  .pipe(babel())
  .pipe(gulp.dest(buildDestinationPath)));

gulp.task('lint', () => gulp
  .src(['spec/**/*', 'src/**/*'])
  .pipe(eslint())
  .pipe(eslint.formatEach()));

gulp.task('spec', function () {
  return gulp.src('spec/index.js')
    .pipe(jasmine());
});

gulp.task('watch', () => {
  gulp.watch('src/**/*.js', () => runSequence(['js', 'lint'], 'spec'));
  gulp.watch('spec/**/*.js*', ['lint', 'spec']);
});

gulp.task('build', () => runSequence('clean', ['js', 'lint'], 'spec'));

gulp.task('default', () => runSequence('clean', ['js', 'lint', 'watch'], 'spec'));
