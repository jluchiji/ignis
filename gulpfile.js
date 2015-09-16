/**
 * gulpfile.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
/* eslint-disable no-var */

var fs             = require('fs');
var gulp           = require('gulp');
var babel          = require('gulp-babel');
var mocha          = require('gulp-mocha');
var eslint         = require('gulp-eslint');
var enforce        = require('gulp-istanbul-enforcer');
var istanbul       = require('gulp-istanbul');
var sourcemaps     = require('gulp-sourcemaps');

var config         = require('./package.json');

var eslintrc        = JSON.parse(fs.readFileSync('.eslintrc', 'utf8'));


require('mocha-babel');

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

  return gulp.src(['src/**/*.js'])
  .pipe(eslint(eslintrc))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());

});

/*!
 * Run the test suit.
 */
gulp.task('test', ['lint'], function() {

  return gulp.src(['test/index.spec.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      compilers: { js: 'babel' }
    }));

});

/*!
 * Generate test coverage report.
 */
gulp.task('coverage', ['build'], function(done) {

  gulp.src(['lib/**/*.js'])
  .pipe(istanbul())
  .pipe(istanbul.hookRequire())
  .on('finish', function() {
    gulp.src(['test/index.spec.js'])
      .pipe(mocha({
        compilers: { js: 'babel' }
      }))
      .pipe(istanbul.writeReports({
        dir: 'coverage',
        reportOpts: { dir: 'coverage' },
        reporters: ['text-summary', 'html', 'lcov']
      }))
      .on('end', done);
  });

});

gulp.task('coverage:enforce', ['coverage'], function() {
  var options = {
    thresholds : {
      statements : 100,
      branches : 100,
      lines : 100,
      functions : 100
    },
    coverageDirectory : 'coverage',
    rootDirectory : ''
  };
  return gulp
    .src('.')
    .pipe(enforce(options));
});

/*!
 * Watch
 */
gulp.task('watch', function() {
  gulp.watch('src/**/*.{js,es6}', ['build']);
});
