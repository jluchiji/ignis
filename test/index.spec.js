/**
 * test/index.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

describe('Authentication', function() {
  require('./auth/index.spec.js');
  require('./auth/strategy.spec.js');
});

describe('Data Source Handling', function() {
  require('./data/source.spec.js');
  require('./data/model.spec.js');
});

describe('Utility Functions', function() {
  require('./util/unpromisify.spec.js');
});
