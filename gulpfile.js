const babel = require('gulp-babel');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const minifyHTML = require('gulp-minify-html');
const plumber = require('gulp-plumber');
const R = require ('ramda');
const reactify = require('reactify');
const runSequence = require('run-sequence');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watchify = require('watchify');

const buildDestinationPath = 'dist';

gulp.task('clean', function () {
  return del([
    buildDestinationPath + '/**/*',
  ]);
});

gulp.task('jsSpec', function () {
  watchify(browserify('spec/index.js', R.assoc('debug', true, watchify.args)))
    .transform(babelify.configure({
        optional: ['runtime']
    }))
    .transform(reactify)
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('spec.js'))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(buildDestinationPath));
});

gulp.task('jsProd', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest(buildDestinationPath));
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['jsSpec']);
  gulp.watch('spec/**/*.js*', ['jsSpec']);
});

gulp.task('build', function () {
  return runSequence('clean', 'jsProd');
});

gulp.task('default', function () {
  return runSequence('clean', ['jsSpec', 'watch']);
});
