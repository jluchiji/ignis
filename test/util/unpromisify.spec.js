/**
 * test/util/unpromisify.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Bluebird = require('bluebird');
const unpromisify = dofile('lib/util/unpromisify');


describe('unpromisify(1)', function() {

  it('should correctly wrap a function', function() {
    const callback = Sinon.spy();
    const source   = Sinon.spy(function(arg) { return arg; });

    const wrapped = unpromisify(source);
    expect(wrapped)
      .to.be.a('function');

    wrapped('test', callback);
    expect(source)
      .to.be.calledOnce;
    expect(source)
      .to.be.calledWith('test');
  });

  it('should produce a promise-returning function', co(function*() {
    const callback = Sinon.spy();
    const source   = Sinon.spy(function(arg) { return arg; });

    const wrapped = unpromisify(source);

    const result = yield wrapped('test', callback);

    expect(result)
      .to.equal('test');
  }));

  it('should produce a function accepting node-style callbacks', co(function*() {
    const callback = Sinon.spy();
    const source   = Sinon.spy(function(arg) { return arg; });

    const wrapped = unpromisify(source);

    yield wrapped('test', callback);
    expect(callback)
      .to.be.calledOnce;
  }));

  it('should correctly handle calls without callback', co(function*() {
    const source   = Sinon.spy(function(arg) { return arg; });

    const wrapped = unpromisify(source);

    const result = yield wrapped('test');
    expect(result)
      .to.equal('test');
  }));

  it('should correctly handle a promise-returning function', co(function*() {
    const source   = Sinon.spy(function(arg) { return Bluebird.resolve(arg); });

    const wrapped = unpromisify(source);

    const result = yield wrapped('test');
    expect(result)
      .to.equal('test');
  }));

});
