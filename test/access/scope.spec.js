/**
 * test/access/scope.spec.js
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

var extension      = require('../../lib/access/scope');

describe('getScope(1)', function() {

  beforeEach(function() {
    this.ns = Object.create(null);
    this.ns.__scopes = new Map();

    this.test1 = {
      param:    'test_1',
      callback: Sinon.spy(function(i) { return i + '#1'; })
    }
    this.test2 = {
      param:    'test_2',
      callback: Sinon.spy(function(i) { return i + '#2'; })
    }
    this.test3 = {
      param:    'test_3',
      callback: Sinon.spy(function(i) { return null; })
    };
    this.test4 = {
      param:    'test_4',
      callback: Sinon.spy(function(i) { throw new Error('test'); })
    };
    this.test5 = {
      param:    'test_5',
      callback: Sinon.spy(function(i) { return 'hola, ' + i; })
    };
    this.ns.__scopes.set('test', [
      this.test1,
      this.test3,
      this.test2,
      this.test4
    ]);
    this.ns.__scopes.set('empty', [ ]);
  });

  it('should generate a scope getter', function() {
    var getter = extension.getScope(this.ns, 'test');

    return getter({ params: { 'test_1': 'test' } })
      .then(function(data) {
        expect(data).to.equal('test#1');
        expect(this.test1.callback.calledOnce).to.equal(true);
        expect(this.test2.callback.callCount).to.equal(0);
      }.bind(this));
  });

  it('should attempt getters in the order', function() {
    var getter = extension.getScope(this.ns, 'test');

    return getter({ params: { 'test_2': 'foo' } })
      .then(function(data) {
        expect(data).to.equal('foo#2');
        expect(this.test1.callback.calledOnce).to.equal(false);
        expect(this.test2.callback.calledOnce).to.equal(true);
      }.bind(this));
  });

  it('should resolve to null if there is no such scope', function() {
    var getter = extension.getScope(this.ns, 'no-such');

    var promise = getter({ params: { 'test_2': 'foo' } })
    expect(promise).to.eventually.equal(null);
  });

  it('should resolve to null if there are no getters', function() {
    var getter = extension.getScope(this.ns, 'empty');

    var promise = getter({ params: { 'test_2': 'foo' } })
    expect(promise).to.eventually.equal(null);
  });

  it('should resolve to null if the entity resolves to null', function() {
    var getter = extension.getScope(this.ns, 'test');

    var promise = getter({ params: { 'test_3': 'foo' } })
    expect(promise).to.eventually.equal(null);
  });

  it('should resolve to null if no getters matched', function() {
    var getter = extension.getScope(this.ns, 'test');

    var promise = getter({ params: { 'test_999': 'foo' } })
    expect(promise).to.eventually.equal(null);
  });

  it('should gracefully handle errors', function() {
    var getter = extension.getScope(this.ns, 'test');

    var promise = getter({ params: { 'test_4': 'foo' } });
    expect(promise).to.be.rejectedWith('test');
  });

  it('should handle changes after getter creation', function() {
    var getter = extension.getScope(this.ns, 'test');

    this.ns.__scopes.get('test').push(this.test5);
    var promise = getter({ params: { 'test_5': 'foo' } });
    expect(promise).to.eventually.equal('hola, foo');
  });

});

describe('scope(3)', function() {

  before(function() { Authorized._entity = Authorized.entity; });
  after(function() { Authorized.entity = Authorized._entity; });

  beforeEach(function() {
    this.ns = {
      __scopes: new Map(),
      scope:    extension.scope
    };
    this.callback = Sinon.spy(function() { return 123; });

    Authorized.entity = Sinon.spy(function(name, callback) {
      callback(Object.create(null));
    });
  });

  it('should create an entity and push getters', function() {

    this.ns.scope('test', 'foo', this.callback);

    expect(this.ns.__scopes.size).to.equal(1);
    expect(Authorized.entity.calledOnce).to.equal(true);
    expect(Authorized.entity.calledWith('test')).to.equal(true);
  });

  it('should reuse existing entity and push getters', function() {

    this.ns.scope('test', 'foo', this.callback);
    this.ns.scope('test', 'bar', this.callback);

    expect(this.ns.__scopes.get('test').length).to.equal(2);
    expect(Authorized.entity.calledOnce).to.equal(true);
    expect(Authorized.entity.calledWith('test')).to.equal(true);
  });

});

describe('extension', function() {

  it('should mount the extension', function() {
    var ns = { access: Object.create(null) };
    extension.default(ns);

    expect(ns.access.__scopes).to.be.an.instanceOf(Map);
    expect(ns.access.scope).to.be.a('function').and.equal(extension.scope);
  });

});
