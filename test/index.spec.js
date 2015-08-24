/**
 * test/index.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var sourcemap = require.resolve('source-map-support');
if (sourcemap) { require(sourcemap).install(); }

describe('Ignis Core', function() {
  require('./ignis.spec.js');
});

describe('Authentication', function() {
  require('./auth/index.spec.js');
  require('./auth/strategy.spec.js');
});

describe('Configuration', function() {
  require('./config/index.spec.js');
  require('./config/envar.spec.js');
});

describe('Data Source Handling', function() {
  require('./data/source.spec.js');
  require('./data/model.spec.js');
});

describe('Utility Functions', function() {
  require('./util/expressify.spec.js');
  require('./util/unpromisify.spec.js');
});
