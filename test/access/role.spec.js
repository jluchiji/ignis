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

var Ignis          = require('../../lib/core');
var extension      = require('../../lib/access');


describe('role(2)', function() {

  before(function() { Authorized._role = Authorized.role; });
  after(function() { Authorized.role = Authorized._role; });

  beforeEach(function() {
    Authorized.role = Sinon.spy(Authorized.role);

    this.ignis = new Ignis();
    this.ignis.use(extension);
  });

  it('should handle a simple role', function() {
    var callback = Sinon.spy();


    this.ignis.access.role('test', callback);
    expect(Authorized.role).to.be.calledOnce;
    expect(Authorized.role).to.be.calledWith('test');

    Authorized.role.firstCall.args[1]();
    expect(callback).to.be.calledOnce;
  });

  it('should handle a complex role', function() {
    var callback = Sinon.spy();

    this.ignis.access.role('test.role', callback);
    expect(Authorized.role.calledOnce).to.equal(true);
    expect(Authorized.role.calledWith('test.role')).to.equal(true);

    Authorized.role.firstCall.args[1]();
    expect(callback.calledOnce).to.equal(true);
  });

});
