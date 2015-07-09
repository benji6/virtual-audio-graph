const babel = require('gulp-babel');
const del = require('del');
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
  return gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest(buildDestinationPath));
});

gulp.task('spec', function () {
  return gulp.src('spec/index.js')
    .pipe(jasmine());
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['js']);
  gulp.watch('spec/**/*.js*', ['spec']);
});

gulp.task('build', function () {
  return runSequence('clean', 'js', 'spec');
});

gulp.task('default', function () {
  return runSequence('clean', ['js', 'watch'], 'spec');
});
