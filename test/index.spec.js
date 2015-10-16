/**
 * test/index.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Chai           = require('chai');
Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));

/*!
 * Setup various global test-related stuff
 */
global.expect      = Chai.expect;
global.dofile      = require('app-root-path').require;
global.Sinon       = require('sinon');
global.Bluebird    = require('bluebird');

/*!
 * Test suit starts here
 */

describe('Ignis Core', function() {
  require('./core.spec.js');
  require('./error.spec.js');
});


describe('Configuration', function() {
  require('./config/index.spec.js');
  require('./config/envar.spec.js');
  require('./config/file.spec.js');
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
