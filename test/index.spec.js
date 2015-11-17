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
require('./service.spec.js');
require('./core.spec.js');
