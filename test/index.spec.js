/**
 * test/index.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Chai           = require('chai');
Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));
Chai.should();

var sourcemap = require.resolve('source-map-support');
if (sourcemap) { require(sourcemap).install(); }

describe('Ignis Core', function() {
  require('./core.spec.js');
  require('./error.spec.js');
});

describe('Authentication', function() {
  require('./auth/index.spec.js');
  require('./auth/strategy.spec.js');
});

describe('Access Control', function() {
  require('./access/index.spec.js');
  require('./access/role.spec.js');
  require('./access/action.spec.js');
  require('./access/scope.spec.js');
});

describe('Configuration', function() {
  require('./config/index.spec.js');
  require('./config/envar.spec.js');
});

describe('Data Handling', function() {
  require('./data/index.spec.js');
  require('./data/source.spec.js');
  require('./data/model.spec.js');
});

describe('Routing', function() {
  require('./routing/index.spec.js');
  require('./routing/error.spec.js');
  require('./routing/mount.spec.js');
});
