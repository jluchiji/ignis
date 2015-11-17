/**
 * test/index.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Chai         = require('chai');
Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));

/*!
 * Setup global stuff here.
 */
global.co          = require('bluebird').coroutine;
global.expect      = Chai.expect;
global.dofile      = require('app-root-path').require;
global.Sinon       = require('sinon');

/*!
 * Start tests.
 */
beforeEach(function() {
  this.emit = Sinon.spy();
  this.ignis = { emit: this.emit };
});

require('./service.spec.js');
require('./core.spec.js');
require('./error.spec.js');

require('./services/http.spec.js');
require('./services/config.spec.js');

describe('Utilities', function() {

  require('./util/service-name.spec.js');

});
