const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const gulp = require('gulp');
const gutil = require('gulp-util');
const minifyHTML = require('gulp-minify-html');
const plumber = require('gulp-plumber');
const R = require ('ramda');
const reactify = require('reactify');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watchify = require('watchify');

const buildDestinationPath = 'dist';
const jsEntryPoint = 'src/index.js';
const bundleName = 'virtual-audio-graph.js';

gulp.task('jsDev', function () {
  watchify(browserify(jsEntryPoint, R.assoc('debug', true, watchify.args)))
    .transform(babelify.configure({
        optional: ['runtime']
    }))
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(bundleName))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(buildDestinationPath));
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
  browserify(jsEntryPoint)
    .transform(babelify.configure({
        optional: ['runtime']
    }))
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(bundleName))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(buildDestinationPath));
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['jsDev', 'jsSpec']);
  gulp.watch('spec/**/*.js*', ['jsSpec']);
});

gulp.task('build', ['jsProd']);

gulp.task('default', ['jsDev', 'jsSpec', 'watch']);
