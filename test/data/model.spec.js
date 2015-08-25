/**
 * test/data/model.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
/* jshint -W030 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');

var Model          = require('../../lib/data/model');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;



describe('model(2)', function() {

  beforeEach(function() {
    this.source = { test: Sinon.spy() };
    this.ns = {
      __models: new Map(),
      emit:     Sinon.spy(),
      model:    Model.model,
      source:   Sinon.spy(function() { return this.source; }.bind(this))
    };
  });

  it('should create a model with the data connection', function() {
    this.ns.model('test', 'test-data', function(data) {
      expect(data).to.equal(this.source);
      return { get: data.test };
    }.bind(this));
  });

  it('should attach the model to the model store', function() {
    this.ns.model('test', 'test-data', function(data) {
      return { get: data.test };
    });

    var model = this.ns.model('test');
    expect(model).to.have.property('get');
    expect(model.get).to.be.a('function');
  });

  it('should proxy calls to the data source', function() {
    this.ns.model('test', 'test-data', function(data) {
      expect(data).to.equal(this.source);
      return { get: data.test };
    }.bind(this));

    var model = this.ns.model('test');
    model.get('foo');
    expect(this.source.test).to.be.calledOnce.and.to.be.calledWith('foo');
  });

  it('should throw if requested model is not found', function() {
    expect(function() {
      this.ns.model('no-such-model');
    }.bind(this)).to.throw('Model not found: no-such-model');
  });

  it('should throw when attempting to create a duplicate model', function() {
    var model1 = Object.create(null);
    var model2 = Object.create(null);

    this.ns.model('test', 'test-data', function() { return model1; });
    expect(this.ns.model('test')).to.equal(model1);

    expect(function() {
      this.ns.model('test', 'test-data', function() { return model2; });
    }.bind(this)).to.throw('Model already exists: test');

  });

  it('should emit events via Ignis object', function() {

    this.ns.model('test', 'test-data', function(data) {
      return { foo: function() { this.emit('foo'); } };
    });

    var model = this.ns.model('test');
    model.foo();
    expect(this.ns.emit)
      .to.be.calledOnce.and
      .to.be.calledWith('model.test.foo');
  });

  it('should allow construction of models in \'constructor style\'', function() {
    this.ns.model('test', 'test-data', function() {
      this.foo = 'bar';
    });
    expect(this.ns.model('test')).to.have.property('foo', 'bar');
  });

});

describe('extension', function() {

  it('should mount the extension', function() {
    var ns = Object.create(null);
    Model.default(ns);

    expect(ns.__models).to.be.an.instanceOf(Map);
    expect(ns.model).to.be.a('function').and.to.equal(Model.model);
  });

});
