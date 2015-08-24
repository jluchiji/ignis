/**
 * test/util/expressify.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var expressify     = require('../../lib/util/expressify');


describe('expressify(2)', function() {

  it('should produce an express middleware', function() {
    var fn = Sinon.spy(function() { return Bluebird.resolve('foo'); });
    var next = Sinon.spy();
    var res = { };
    res.status = Sinon.spy(function() { return res; });
    res.send   = Sinon.spy(function() { return res; });

    var wrapped = expressify(fn);

    expect(wrapped).to.be.a('function');
    return wrapped(null, res, next).finally(function() {
      expect(fn.calledOnce).to.equal(true);
      expect(res.status.calledOnce).to.equal(true);
      expect(res.status.calledWith(200)).to.equal(true);
      expect(res.send.calledOnce).to.equal(true);
      expect(res.send.calledWith('foo')).to.equal(true);
      expect(next.callCount).to.equal(0);
    });

  });

  it('should correctly propagate errors', function() {
    var err = new Error();
    var fn = Sinon.spy(function() { return Bluebird.reject(err); });
    var next = Sinon.spy();
    var res = { };
    res.status = Sinon.spy(function() { return res; });
    res.send   = Sinon.spy(function() { return res; });

    var wrapped = expressify(fn);

    expect(wrapped).to.be.a('function');
    return wrapped(null, res, next).finally(function() {
      expect(res.status.callCount).to.equal(0);
      expect(res.send.callCount).to.equal(0);
      expect(next.calledOnce).to.equal(true);
      expect(next.calledWith(err)).to.equal(true);
    });

  });

  it('should support custom status codes', function() {
    var fn = Sinon.spy(function() { return Bluebird.resolve('foo'); });
    var next = Sinon.spy();
    var res = { };
    res.status = Sinon.spy(function() { return res; });
    res.send   = Sinon.spy(function() { return res; });

    var wrapped = expressify(fn, 999);

    expect(wrapped).to.be.a('function');
    return wrapped(null, res, next).finally(function() {
      expect(res.status.calledOnce).to.equal(true);
      expect(res.status.calledWith(999)).to.equal(true);
    });
  });

});
