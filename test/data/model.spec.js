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

var Ignis          = require('../../lib/core');
var Data           = require('../../lib/data');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;



describe('model(2)', function() {

  beforeEach(function() {
    this.source = { test: Sinon.spy() };
    this.ignis = new Ignis();
    this.ignis.use(Data);

    this.ignis.source('test-data', i => this.source);
    return this.ignis.startup;
  });

  it('should create a model with the data connection', function() {
    this.ignis.model('test', 'test-data', (ignis, data) => {
      expect(ignis).to.equal(this.ignis);
      expect(data).to.equal(this.source);
    });

    expect(this.ignis.startup).to.be.fulfilled;
  });

  it('should attach the model to the model store', function() {
    this.ignis.model('test', 'test-data', function(ignis, data) {
      this.get = data.test;
    });

    return expect(this.ignis.startup).to.be.fulfilled.then(i => {
      var model = this.ignis.model('test');
      expect(model).to.have.property('get');
      expect(model.get).to.be.a('function').and.equal(this.source.test);
    });
  });

  it('should proxy calls to the data source', function() {
    this.ignis.model('test', 'test-data', (ignis, data) => {
      expect(data).to.equal(this.source);
      return { get: data.test };
    });

    return expect(this.ignis.startup).to.be.fulfilled.then(i => {
      var model = this.ignis.model('test');
      model.get('foo');
      expect(this.source.test).to.be.calledOnce.and.to.be.calledWith('foo');
    });
  });

  it('should throw if requested model is not found', function() {
    expect(i => this.ignis.model('no-such-model'))
      .to.throw('Model not found: no-such-model');
  });

  it('should throw when attempting to create a duplicate model', function() {
    this.ignis.model('test', 'test-data', i => Object.create(null));
    this.ignis.model('test', 'test-data', i => Object.create(null));
    expect(this.ignis.startup).to.be.rejectedWith('Model already exists: test');
  });

  it('should emit events via Ignis object', function() {

    this.ignis.model('test', 'test-data', function(ignis, data) {
      return { foo: function() { this.emit('foo'); } };
    });

    this.ignis.emit = Sinon.spy();
    return expect(this.ignis.startup).to.be.fulfilled.then(i => {
      var model = this.ignis.model('test');
      model.foo();
      expect(this.ignis.emit)
        .to.be.calledOnce.and
        .to.be.calledWith('model.test.foo');
    });
  });

  it('should allow construction of models in \'constructor style\'', function() {
    this.ignis.model('test', 'test-data', function() { this.foo = 'bar'; });
    return expect(this.ignis.startup).to.be.fulfilled.then(i => {
      expect(this.ignis.model('test')).to.have.property('foo', 'bar');
    });
  });

});
