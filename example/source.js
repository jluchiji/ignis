/**
 * example/source.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Ignis          = require('ignis');


/*!
 * Here we define a mock database
 */
Ignis.source('sample', function() {
  return require('./data.json');
});
