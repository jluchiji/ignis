/**
 * test/ignis.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

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

      expect(ignis.startup.length).to.equal(1);
      expect(ignis.startup[0]).to.equal(promise);
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

});
