/**
 * gulpfile.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var fs             = require('fs');
var gulp           = require('gulp');
var jscs           = require('gulp-jscs');
var babel          = require('gulp-babel');
var mocha          = require('gulp-mocha');
var jshint         = require('gulp-jshint');
var stylish        = require('gulp-jscs-stylish');
var istanbul       = require('gulp-istanbul');
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

  var jshintConfig = JSON.parse(fs.readFileSync('.jshintrc', 'utf8'));
  var jscsConfig   = JSON.parse(fs.readFileSync('.jscsrc',   'utf8'));

  return gulp.src(['src/**/*.{js,es6}'])
    .pipe(jshint(jshintConfig))
    .pipe(jscs(jscsConfig))
    .on('error', function() { })
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));

});

/*!
 * Run the test suit.
 */
gulp.task('test', ['lint'], function() {

  return gulp.src(['test/index.spec.js'], { read: false })
    .pipe(mocha({ reporter: 'spec' }));

});

/*!
 * Generate test coverage report.
 */
gulp.task('coverage', function(done) {

  gulp.src(['lib/**/*.js'])
  .pipe(istanbul())
  .pipe(istanbul.hookRequire())
  .on('finish', function() {
    gulp.src(['test/index.spec.js'])
      .pipe(mocha())
      .pipe(istanbul.writeReports({
        dir: 'coverage',
        reportOpts: { dir: 'coverage' },
        reporters: ['text-summary', 'html', 'lcov']
      }))
      .on('end', done);
  });

});

/*!
 * Watch
 */
gulp.task('watch', function() {
  gulp.watch('src/**/*.{js,es6}', ['build']);
});
