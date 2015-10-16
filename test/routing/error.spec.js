/**
 * test/routing/error.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const target         = dofile('lib/routing/error');

describe('handler(1)', function() {

  it('should create a handler function', function() {
    const mw = target.handler('Error');
    expect(mw).to.be.a.function;
  });

  it('should generate handler specific to the error type', function() {
    const cb = Sinon.spy();
    const mw = target.handler('TypeError', cb);

    const req = Object.create(null);
    const res = Object.create(null);
    const err = new TypeError();
    mw(err, req, res, function() { });

    expect(cb).to.be.calledOnce.and.calledWith(err, req, res);
  });

  it('should generate handler that is no-op for wrong error type', function() {
    const cb = Sinon.spy();
    const mw = target.handler('TypeError', cb);

    const req  = Object.create(null);
    const res  = Object.create(null);
    const err  = new Error();
    const next = Sinon.spy();
    mw(err, req, res, next);

    expect(cb).not.to.be.called;
    expect(next).to.be.calledOnce.and.calledWith(err);
  });

});

describe('error(2)', function() {

  beforeEach(function() {
    this.ns = {
      wait: function(cb) { cb.call(this, this.root); },
      root: { use: Sinon.spy() },
      error: target.error
    };
  });

  it('should mount an error handler to root router', function() {
    this.ns.error('Error', function() { });
    expect(this.ns.root.use).to.be.calledOnce;
  });

});
