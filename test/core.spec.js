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

var Ignis          = require('../lib/core');

describe('Ignis Class', function() {

  describe('use(1)', function() {

    var callback = Sinon.spy();

    it('should attach the extension', function() {
      Ignis.use(callback);
      expect(callback).to.be.calledOnce.and.calledWith(Ignis);
    });

    it('should not attach an extension that is already attached', function() {
      Ignis.use(callback);
      expect(callback).to.be.calledOnce;
    });

    it('should handle ES6 modules required from CommonJS', function() {
      var extension = { default: Sinon.spy() };
      Ignis.use(extension);
      expect(extension.default).to.be.calledOnce;
    });

    it('should proxy instance use() to static use()', function() {
      let extension = Sinon.spy(function(Ignis) {
        expect(this).not.to.be.null;
        expect(Ignis).to.equal(Ignis);
      });

      let ignis = new Ignis();
      ignis.use(extension);
    });

  });

  describe('init(0)', function() {

    it('should run every initializer exactly once', function() {
      let fn0 = Sinon.spy();
      let fn1 = Sinon.spy();

      Ignis.init(fn0);
      Ignis.init(fn1);

      let instance = new Ignis();
      expect(fn0).to.be.calledOnce;
      expect(fn1).to.be.calledOnce;

      instance.init();
      expect(fn0).to.be.calledOnce;
      expect(fn1).to.be.calledOnce;
    });

  });

  describe('wait(1)', function() {

    beforeEach(function() {
      this.ignis = new Ignis();
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

      this.ignis.wait(action1).wait(action2).wait(action3);
      return expect(this.ignis.startup).to.be.fulfilled.then(i => {
        expect(action1).to.be.calledOnce;
        expect(action2).to.be.calledOnce;
        expect(action3).to.be.calledOnce;
        expect(action1).to.be.calledBefore(action2);
      });
    });

    it('should wait on a sync functon', function() {
      var action1 = Sinon.spy(i => 123);
      var action2 = Sinon.spy(i => 456);

      this.ignis.wait(action1).wait(action2);
      return expect(this.ignis.startup).to.be.fulfilled.then(i => {
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

      this.ignis.wait(action1).wait(action2);
      return expect(this.ignis.startup).to.be.fulfilled.then(i => {
        expect(action1).to.be.calledOnce;
        expect(action2).to.be.calledOnce;
        expect(action1).to.be.calledBefore(action2);
      });
    });

    it('should throw when waiting on a non-function', function() {
      expect(i => {
        this.ignis.wait(null);
      }).to.throw('Cannot wait on non-function objects.');
    });
  });

  describe('listen(1)', function() {

    beforeEach(function() {
      this.ignis = new Ignis();
      this.ignis.root = {
        listen: Sinon.spy(function(port, cb) {
          if (port === 1111) { cb(new Error('fail')); }
          process.nextTick(cb);
        })
      };
    });

    it('should start listening for connections', function() {
      process.env.PORT = 9999;
      return this.ignis.listen(123).then(() => {
        expect(this.ignis.root.listen).to.be.calledOnce;
        expect(this.ignis.root.listen).to.be.calledWith(123);
      });
    });

    it('should use PORT envar when no port is specified', function() {
      process.env.PORT = 9999;
      return this.ignis.listen().then(() => {
        expect(this.ignis.root.listen).to.be.calledOnce;
        expect(this.ignis.root.listen).to.be.calledWith(9999);
      });
    });

    it('should correctly capture errors', function() {
      process.env.PORT = 9999;
      var promise = this.ignis.listen(1111);
      expect(promise).to.be.rejectedWith('fail');
    });

  });

});
