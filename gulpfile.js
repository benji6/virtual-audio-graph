const babel = require('gulp-babel');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const plumber = require('gulp-plumber');
const runSequence = require('run-sequence');

const buildDestinationPath = 'dist';

gulp.task('clean', function () {
  return del([
    buildDestinationPath + '/**/*',
  ]);
});

gulp.task('js', function () {
  return gulp.src('src/**/*')
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest(buildDestinationPath));
});

gulp.task('lint', function () {
  return gulp.src(['spec/**/*', 'src/**/*'])
    .pipe(eslint())
    .pipe(eslint.formatEach());
});

gulp.task('spec', function () {
  return gulp.src('spec/index.js')
    .pipe(jasmine());
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', function () {
    return runSequence(['js', 'lint'], 'spec');
  });
  gulp.watch('spec/**/*.js*', ['lint', 'spec']);
});

gulp.task('build', function () {
  return runSequence('clean', ['js', 'lint'], 'spec');
});

gulp.task('default', function () {
  return runSequence('clean', ['js', 'lint', 'watch'], 'spec');
});
