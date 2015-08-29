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

var Ignis          = require('../../lib/core');
var extension      = require('../../lib/access');
var scope          = require('../../lib/access/scope');

describe('getScope(1)', function() {

  beforeEach(function() {
    this.ignis = new Ignis();
    this.ignis.use(extension);

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
    this.ignis[scope.__scopes].set('test', [
      this.test1,
      this.test3,
      this.test2,
      this.test4
    ]);
    this.ignis[scope.__scopes].set('empty', [ ]);
  });

  it('should generate a scope getter', function() {
    var getter = scope.getScope(this.ignis, 'test');

    return getter({ params: { 'test_1': 'test' } })
      .then(data => {
        expect(data).to.equal('test#1');
        expect(this.test1.callback).to.be.calledOnce;
        expect(this.test2.callback.callCount).to.equal(0);
      });
  });

  it('should attempt getters in the order', function() {
    var getter = scope.getScope(this.ignis, 'test');

    return getter({ params: { 'test_2': 'foo' } })
      .then(data => {
        expect(data).to.equal('foo#2');
        expect(this.test1.callback).not.to.be.called;
        expect(this.test2.callback).to.be.calledOnce;
      });
  });

  it('should resolve to null if there is no such scope', function() {
    var getter = scope.getScope(this.ignis, 'no-such');

    var promise = getter({ params: { 'test_2': 'foo' } })
    expect(promise).to.eventually.equal(null);
  });

  it('should resolve to null if there are no getters', function() {
    var getter = scope.getScope(this.ignis, 'empty');

    var promise = getter({ params: { 'test_2': 'foo' } })
    expect(promise).to.eventually.equal(null);
  });

  it('should resolve to null if the entity resolves to null', function() {
    var getter = scope.getScope(this.ignis, 'test');

    var promise = getter({ params: { 'test_3': 'foo' } })
    expect(promise).to.eventually.equal(null);
  });

  it('should resolve to null if no getters matched', function() {
    var getter = scope.getScope(this.ignis, 'test');

    var promise = getter({ params: { 'test_999': 'foo' } })
    expect(promise).to.eventually.equal(null);
  });

  it('should gracefully handle errors', function() {
    var getter = scope.getScope(this.ignis, 'test');

    var promise = getter({ params: { 'test_4': 'foo' } });
    expect(promise).to.be.rejectedWith('test');
  });

  it('should handle changes after getter creation', function() {
    var getter = scope.getScope(this.ignis, 'test');

    this.ignis[scope.__scopes].get('test').push(this.test5);
    var promise = getter({ params: { 'test_5': 'foo' } });
    expect(promise).to.eventually.equal('hola, foo');
  });

});

describe('scope(3)', function() {

  before(function() { Authorized._entity = Authorized.entity; });
  after(function() { Authorized.entity = Authorized._entity; });

  beforeEach(function() {
    this.ignis = new Ignis();
    this.ignis.use(extension);

    this.callback = Sinon.spy(function() { return 123; });

    Authorized.entity = Sinon.spy(function(name, callback) {
      callback(Object.create(null));
    });
  });

  it('should create an entity and push getters', function() {

    this.ignis.access.scope('test', 'foo', this.callback);

    expect(this.ignis[scope.__scopes].size).to.equal(1);
    expect(Authorized.entity).to.be.calledOnce;
    expect(Authorized.entity).to.be.calledWith('test');
  });

  it('should reuse existing entity and push getters', function() {

    this.ignis.access.scope('test', 'foo', this.callback);
    this.ignis.access.scope('test', 'bar', this.callback);

    expect(this.ignis[scope.__scopes].get('test')).to.have.length(2);
    expect(Authorized.entity).to.be.calledOnce;
    expect(Authorized.entity).to.be.calledWith('test');
  });

});
