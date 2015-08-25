/**
 * test/access/action.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');
var Authorized     = require('authorized');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var extension      = require('../../lib/access/action');

describe('action(2)', function() {

  before(function() { Authorized._action = Authorized.action; });
  after(function() { Authorized.action = Authorized._action; });

  beforeEach(function() {
    Authorized.action = Sinon.spy();
  });

  it('should proxy the call to Authorized.action', function() {
    extension.action('test', ['role']);

    expect(Authorized.action.calledOnce).to.equal(true);
  });

});

describe('extension', function() {

  it('should mount the extension', function() {
    var ns = { access: Object.create(null) };
    extension.default(ns);

    expect(ns.access.action).to.equal(extension.action);
  });

});
