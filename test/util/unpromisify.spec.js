/**
 * test/data/model.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var unpromisify    = require('../../lib/util/unpromisify');


describe('unpromisify(1)', function() {

  it('should correctly wrap a function', function() {
    var callback = Sinon.spy();
    var source   = Sinon.spy(function(arg) { return arg; });

    var wrapped = unpromisify(source);
    expect(wrapped).to.be.a('function');

    wrapped('test', callback);
    expect(source.calledOnce).to.equal(true, '{fn} was never called');
    expect(source.calledWith('test')).to.equal(true, '{fn} was called with wrong args');
  });

  it('should produce a promise-returning function', function() {
    var callback = Sinon.spy();
    var source   = Sinon.spy(function(arg) { return arg; });

    var wrapped = unpromisify(source);

    var promise = wrapped('test', callback);
    expect(promise).to.be.an.instanceOf(Bluebird);
    return promise.then(function(result) { expect(result).to.equal('test'); });
  });

  it('should produce a function accepting node-style callbacks', function() {
    var callback = Sinon.spy();
    var source   = Sinon.spy(function(arg) { return arg; });

    var wrapped = unpromisify(source);

    return wrapped('test', callback).then(function() {
      expect(callback.calledOnce).to.equal(true);
    });
  });

  it('should correctly handle calls without callback', function() {
    var callback = Sinon.spy();
    var source   = Sinon.spy(function(arg) { return arg; });

    var wrapped = unpromisify(source);

    var promise = wrapped('test');
    expect(promise).to.be.an.instanceOf(Bluebird);
    return promise.then(function(result) { expect(result).to.equal('test'); });
  });

  it('should correctly handle a promise-returning function', function() {
    var callback = Sinon.spy();
    var source   = Sinon.spy(function(arg) { return Bluebird.resolve(arg); });

    var wrapped = unpromisify(source);

    var promise = wrapped('test');
    expect(promise).to.be.an.instanceOf(Bluebird);
    return promise.then(function(result) { expect(result).to.equal('test'); });
  });

});
