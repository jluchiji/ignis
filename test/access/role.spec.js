/**
 * test/access/role.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');
var Authorized     = require('authorized');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var extension      = require('../../lib/access/role');


describe('role(2)', function() {

  before(function() { Authorized._role = Authorized.role; });
  after(function() { Authorized.role = Authorized._role; });

  beforeEach(function() {
    Authorized.role = Sinon.spy(Authorized.role);
  });

  it('should handle a simple role', function() {
    var callback = Sinon.spy();

    extension.role('test', callback);
    expect(Authorized.role.calledOnce).to.equal(true);
    expect(Authorized.role.calledWith('test')).to.equal(true);

    Authorized.role.firstCall.args[1]();
    expect(callback.calledOnce).to.equal(true);
  });

  it('should handle a complex role', function() {
    var callback = Sinon.spy();

    extension.role('test.role', callback);
    expect(Authorized.role.calledOnce).to.equal(true);
    expect(Authorized.role.calledWith('test.role')).to.equal(true);

    Authorized.role.firstCall.args[1]();
    expect(callback.calledOnce).to.equal(true);
  });

});

describe('extension', function() {

  it('should mount the extension', function() {
    var ns = { access: Object.create(null) };
    extension.default(ns);

    expect(ns).to.have.deep.property('access.role', extension.role);
  });

});
