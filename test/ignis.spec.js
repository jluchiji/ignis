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

    beforeEach(function() { ignis.startup = [ ]; });

    it('should push a promise into the startup sequence', function() {
      var promise = Bluebird.resolve();
      ignis.wait(promise);

      ignis.startup.length.should.equal(1);
      ignis.startup[0].should.equal(promise);
    });

  });

  describe('ready(1)', function() {

    beforeEach(function() { ignis.startup = [ ]; });

    it('should wait for all startup promises to resolve', function(done) {
      var promise = Bluebird.resolve();
      ignis.ready(function() { done(); });
    });

    it('should throw rejected promises as errors', function(done) {
      var callback = Sinon.spy();
      var promise  = Bluebird.reject(new Error('test'));

      ignis.wait(promise);
      var result   = ignis.ready(callback);

      result
        .then(function() {
          done(new Error('Callback should not be called!'));
        })
        .catch(function() {
          try {
            expect(callback.callCount).to.equal(0);
          } catch (x) {
            done(x);
          }

          done();
        });


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
