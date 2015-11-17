/**
 * test/util/expressify.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Bluebird       = require('bluebird');
const expressify     = dofile('lib/util/expressify');


describe('expressify(fn, ignis, status)', function() {

  it('should produce an express middleware', co(function*() {
    const fn = Sinon.spy(function() { return Bluebird.resolve('foo'); });
    const next = Sinon.spy();
    const res = { };
    res.status = Sinon.spy(function() { return res; });
    res.send   = Sinon.spy(function() { return res; });

    const wrapped = expressify(fn);

    expect(wrapped)
      .to.be.a('function');

    yield wrapped(null, res, next);

    expect(fn)
      .to.be.calledOnce;
    expect(res.status)
      .to.be.calledOnce
      .to.be.calledWith(200);
    expect(res.send)
      .to.be.calledOnce
      .to.be.calledWith('foo');
    expect(next)
      .to.be.calledOnce;

  }));

  it('should correctly propagate errors', co(function*() {
    const err = new Error();
    const fn = Sinon.spy(function() { return Bluebird.reject(err); });
    const next = Sinon.spy();
    const res = { };
    res.status = Sinon.spy(function() { return res; });
    res.send   = Sinon.spy(function() { return res; });

    const wrapped = expressify(fn);

    expect(wrapped)
      .to.be.a('function');

    yield wrapped(null, res, next);

    expect(res.status)
      .to.have.callCount(0);
    expect(res.send)
      .to.have.callCount(0);
    expect(next)
      .to.be.calledOnce
      .to.be.calledWith(err);

  }));

  it('should support custom status codes', co(function*() {
    const fn = Sinon.spy(function() { return Bluebird.resolve('foo'); });
    const next = Sinon.spy();
    const res = { };
    res.status = Sinon.spy(function() { return res; });
    res.send   = Sinon.spy(function() { return res; });

    const wrapped = expressify(fn, null, 999);

    expect(wrapped)
      .to.be.a('function');

    yield wrapped(null, res, next);

    expect(res.status)
      .to.be.calledOnce
      .to.be.calledWith(999);
  }));

});
