/**
 * test/auth/index.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
/* jshint -W030 */
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
    namespace.root = { use: Sinon.spy() };
    namespace.factories  = [];

    extension.default(namespace);

    expect(namespace.auth).to.be.an('object');
    expect(namespace.auth.__alias).to.be.an('object');
    expect(namespace.auth.__options).to.be.an('object');

    expect(namespace.root.use).to.be.calledOnce;
    expect(namespace.factories.length).to.equal(1);

    expect(namespace.auth.jwt).to.be.a('function');
    expect(namespace.auth.local).to.be.a('function');

  });

});

describe('factory(2)', function() {

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
      root: { use: Sinon.spy() },
      factories:  [],
    };
    extension.default(this.ns);

    Passport.use = Sinon.spy();
    Passport.authenticate = Sinon.spy(function() {
      return function() { };
    });
  });

  it('should instantiate the appropriate middleware', function() {
    var mw = extension.passportFactory(this.ns, { auth: 'local' });
    mw();

    expect(Passport.authenticate.calledOnce).to.equal(true);
    expect(Passport.authenticate.calledWith('local')).to.equal(true);
  });

  it('should resolve aliases', function() {
    var mw = extension.passportFactory(this.ns, { auth: 'token' });
    mw();

    expect(Passport.authenticate.calledOnce).to.equal(true);
    expect(Passport.authenticate.calledWith('jwt')).to.equal(true);
  });

  it('should handle options', function() {
    var mw = extension.passportFactory(this.ns, { auth: { strategy: 'token' } });
    mw();

    expect(Passport.authenticate.calledOnce).to.equal(true);
    expect(Passport.authenticate.calledWith('jwt')).to.equal(true);
  });

  it('should return null when no strategy is specified', function() {
    var mw = extension.passportFactory(this.ns, { });
    expect(mw).to.equal(null);
  });

  it('should return null when strategy is \'none\'', function() {
    var mw = extension.passportFactory(this.ns, { auth: 'noNe' });
    expect(mw).to.equal(null);
  });

});

describe('callback(3)', function() {

  beforeEach(function() { this.callback = Sinon.spy(); });

  it('should return a callback function', function() {
    var cb = extension.passportCallback(null, null, this.callback);
    expect(cb).to.be.a('function');
  });

  it('should not generate errors when successful', function() {
    var cb = extension.passportCallback(null, null, this.callback);

    cb(null, Object.create(null), null);
    expect(this.callback.calledOnce).to.equal(true);
    expect(this.callback.calledWithExactly()).to.equal(true);
  });

  it('should correctly pass on errors', function() {
    var cb = extension.passportCallback(null, null, this.callback);

    cb('foobar', Object.create(null), null);
    expect(this.callback.calledOnce).to.equal(true);
    expect(this.callback.calledWith('foobar')).to.equal(true);
  });

  it('should correctly generate Authentication Failed errors', function() {
    var cb = extension.passportCallback(null, null, this.callback);

    cb(null, null, 'foobar');
    expect(this.callback.calledOnce).to.equal(true);
    expect(this.callback.args[0][0])
      .to.be.an.instanceOf(Error).and
      .have.deep.property('details.reason', 'foobar');
  });

});
