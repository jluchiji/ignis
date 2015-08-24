/**
 * test/auth/index.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');
var Passport       = require('passport');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var extension      = require('../../lib/auth');


describe('extension', function() {

  before(function() {
    Passport.__use = Passport.use;
    Passport.__authenticate = Passport.authenticate;
  });

  after(function() {
    Passport.use = Passport.__use;
    Passport.authenticate = Passport.__authenticate;
  });

  beforeEach(function() {
    Passport.use = Sinon.spy();
    Passport.authenticate = Sinon.spy();
  });

  it('should mount modules to the specified namespace', function() {
    var namespace = Object.create(null);
    namespace.middleware = [];
    namespace.factories  = [];

    extension.default(namespace);

    expect(namespace.auth).to.be.an('object');
    expect(namespace.auth.__alias).to.be.an('object');
    expect(namespace.auth.__options).to.be.an('object');

    expect(namespace.middleware.length).to.equal(1);
    expect(namespace.factories.length).to.equal(1);

    expect(namespace.auth.jwt).to.be.a('function');
    expect(namespace.auth.local).to.be.a('function');

  });

});

describe('instance(2)', function() {

  before(function() {
    Passport.__use = Passport.use;
    Passport.__authenticate = Passport.authenticate;
  });

  after(function() {
    Passport.use = Passport.__use;
    Passport.authenticate = Passport.__authenticate;
  });

  beforeEach(function() {
    this.ns = {
      middleware: [],
      factories:  [],
    };
    extension.default(this.ns);

    Passport.use = Sinon.spy();
    Passport.authenticate = Sinon.spy();
  });

  it('should instantiate the appropriate middleware', function() {
    var mw = extension.passportFactory(this.ns, 'local');

    expect(Passport.authenticate.calledOnce).to.equal(true);
    expect(Passport.authenticate.calledWith('local')).to.equal(true);
  });

  it('should resolve aliases', function() {
    var mw = extension.passportFactory(this.ns, 'token');

    expect(Passport.authenticate.calledOnce).to.equal(true);
    expect(Passport.authenticate.calledWith('jwt')).to.equal(true);
  });

  it('should handle options', function() {
    var mw = extension.passportFactory(this.ns, { strategy: 'token' });

    expect(Passport.authenticate.calledOnce).to.equal(true);
    expect(Passport.authenticate.calledWith('jwt')).to.equal(true);
  });

  it('should return null when no strategy is specified', function() {
    var mw = extension.passportFactory(this.ns);
    expect(mw).to.equal(null);
  });

  it('should return null when strategy is \'none\'', function() {
    var mw = extension.passportFactory(this.ns, 'noNe');
    expect(mw).to.equal(null);
  });

});
