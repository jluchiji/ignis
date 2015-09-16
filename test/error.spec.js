/**
 * test/error.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
var Sinon          = require('sinon');
var Chai           = require('chai');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var Ignis          = require('../lib/core');
var extension      = require('../lib/error');


describe('IgnisError', function() {

  describe('#constructor', function() {

    it('should create an IgnisError object', function() {
      var err = new extension.IgnisError(123, 'test', { foo: 'bar' });

      expect(err).to.be.an.instanceOf(Error);
      expect(err).to.have.property('name', 'IgnisError');
      expect(err).to.have.property('status', 123);
      expect(err).to.have.property('message', 'test');
      expect(err.details).to.deep.equal({ foo: 'bar' });
    });

    it('should add sensitive flag if one is given in details', function() {
      var err = new extension.IgnisError(123, 'test', { sensitive: true });
      expect(err).to.have.property('sensitive', true);
    });

  });

  describe('panic(3)', function() {
    expect(function() {
      extension.IgnisError.panic(400, 'test');
    }).to.throw('test');
  });

  describe('deny(2)', function() {
    expect(function() {
      extension.IgnisError.deny('test');
    }).to.throw('test');
  });

  describe('notFound(2)', function() {
    expect(function() {
      extension.IgnisError.notFound('test');
    }).to.throw('test');
  });

  describe('extension', function() {

    it('should mount the extension', function() {
      let instance = new Ignis();
      instance.use(extension);

      return expect(instance.startup).to.be.fulfilled.then(function() {
        expect(instance).to.have.property('deny', extension.IgnisError.deny);
        expect(instance).to.have.property('panic', extension.IgnisError.panic);
        expect(instance).to.have.property('notFound', extension.IgnisError.notFound);
        expect(Ignis).to.have.property('Error', extension.IgnisError);
      });
    });

  });

});
