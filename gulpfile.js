/**
 * gulpfile.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var gulp           = require('gulp');
var jscs           = require('gulp-jscs');
var babel          = require('gulp-babel');
var mocha          = require('gulp-mocha');
var jshint         = require('gulp-jshint');
var stylish        = require('gulp-jscs-stylish');
var sourcemaps     = require('gulp-sourcemaps');

var config         = require('./package.json');

/*!
 * Transpile ES6 source files into ES5.
 */
gulp.task('build', ['lint'], function() {

  return gulp.src(['src/**/*.{js,es6}'], { base: 'src' })
    .pipe(sourcemaps.init())
    .pipe(babel(config.babel))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('lib'));

});

/*!
 * Lint all source files.
 */
gulp.task('lint', function() {

  return gulp.src(['src/**/*.{js,es6}'])
    .pipe(jshint(config.jshintConfig))
    .pipe(jscs(config.jscsConfig))
    .on('error', function() { })
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));

});

/*!
 * Run the test suit.
 */
gulp.task('test', function() {

  return gulp.src(['test/index.spec.js'], { read: false })
    .pipe(mocha({ reporter: 'spec' }));

});

/*!
 * Watch
 */
gulp.task('watch', function() {
  gulp.watch('src/**/*.{js,es6}', ['build']);
});
