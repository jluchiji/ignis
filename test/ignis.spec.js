/**
 * test/ignis.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
/* jshint -W030 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var ignis          = require('../lib/ignis').default;

describe('Ignis Class', function() {

  describe('wait(1)', function() {

    beforeEach(() => {
      ignis.startup = Bluebird.resolve();
    });

    it('should wait on a promised function', function() {
      var promise1 = Bluebird.delay(20);
      var promise2 = Bluebird.delay(30);

      var action1 = Sinon.spy(i => promise1);
      var action2 = Sinon.spy(i => {
        expect(promise1.isFulfilled()).to.equal(true);
        return promise2;
      });
      var action3 = Sinon.spy(i => {
        expect(promise2.isFulfilled()).to.equal(true);
        return true;
      });

      ignis.wait(action1).wait(action2).wait(action3);
      return expect(ignis.startup).to.be.fulfilled.then(i => {
        expect(action1).to.be.calledOnce;
        expect(action2).to.be.calledOnce;
        expect(action3).to.be.calledOnce;
        expect(action1).to.be.calledBefore(action2);
      });
    });

    it('should wait on a sync functon', function() {
      var action1 = Sinon.spy(i => 123);
      var action2 = Sinon.spy(i => 456);

      ignis.wait(action1).wait(action2);
      return expect(ignis.startup).to.be.fulfilled.then(i => {
        expect(action1).to.be.calledOnce;
        expect(action2).to.be.calledOnce;
        expect(action1).to.be.calledBefore(action2);
      });
    });

    it('should wait on a mix of sync and promised functions', function() {
      var promise = Bluebird.delay(30);

      var action1 = Sinon.spy(i => promise);
      var action2 = Sinon.spy(i => {
        expect(promise.isFulfilled()).to.equal(true);
        return true;
      });

      ignis.wait(action1).wait(action2);
      return expect(ignis.startup).to.be.fulfilled.then(i => {
        expect(action1).to.be.calledOnce;
        expect(action2).to.be.calledOnce;
        expect(action1).to.be.calledBefore(action2);
      });
    });

    it('should throw when waiting on a non-function', function() {
      expect(i => {
        ignis.wait(null);
      }).to.throw('Cannot wait on non-function objects.');
    });
  });

  describe('use(1)', function() {

    it('should push attach the extension', function() {

      var callback = Sinon.spy();
      ignis.use(callback);

      expect(callback.calledOnce).to.equal(true);
      expect(callback.calledWith(ignis)).to.equal(true);
    });

    it('should not attach an extension that is already attached', function() {

      var callback = Sinon.spy();
      ignis.use(callback);
      ignis.use(callback);

      expect(callback.calledOnce).to.equal(true);
    });

    it('should handle ES6 modules required from CommonJS', function() {

      var callback = { default: Sinon.spy() };
      ignis.use(callback);

      expect(callback.default.calledOnce).to.equal(true);
    });

  });

  describe('listen(1)', function() {

    before(function() { ignis._root = ignis.root; });
    after(function() { ignis.root = ignis._root; });

    beforeEach(function() {
      ignis.root = {
        listen: Sinon.spy(function(port, cb) {
          if (port === 1111) { cb(new Error('fail')); }
          process.nextTick(cb);
        })
      };
    });

    it('should start listening for connections', function() {
      process.env.PORT = 9999;
      return ignis.listen(123).then(function() {
        expect(ignis.root.listen).to.be.calledOnce;
        expect(ignis.root.listen).to.be.calledWith(123);
      });
    });

    it('should use PORT envar when no port is specified', function() {
      process.env.PORT = 9999;
      return ignis.listen().then(function() {
        expect(ignis.root.listen).to.be.calledOnce;
        expect(ignis.root.listen).to.be.calledWith(9999);
      });
    });

    it('should correctly capture errors', function() {
      process.env.PORT = 9999;
      var promise = ignis.listen(1111);
      expect(promise).to.be.rejectedWith('fail');
    });

  });

});
