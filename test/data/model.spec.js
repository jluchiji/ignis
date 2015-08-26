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

var Ignis          = require('../../lib/ignis').Ignis;
var Model          = require('../../lib/data/model');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;



describe('model(2)', function() {

  beforeEach(function() {
    this.source = { test: Sinon.spy() };
    this.ns = new Ignis();
    Model.default(this.ns);

    /* Mock the data source management */
    this.ns.source = function(name) { return this.__sources.get(name); };
    this.ns.__sources = new Map();
    this.ns.__sources.set('test-data', this.source);
  });

  it('should create a model with the data connection', function() {
    this.ns.model('test', 'test-data', data => {
      expect(data).to.equal(this.source);
    });

    expect(this.ns.startup).to.be.fulfilled;
  });

  it('should attach the model to the model store', function() {
    this.ns.model('test', 'test-data', function(data) { this.get = data.test; });

    return expect(this.ns.startup).to.be.fulfilled.then(i => {
      var model = this.ns.model('test');
      expect(model).to.have.property('get');
      expect(model.get).to.be.a('function').and.equal(this.source.test);
    });
  });

  it('should proxy calls to the data source', function() {
    this.ns.model('test', 'test-data', data => {
      expect(data).to.equal(this.source);
      return { get: data.test };
    });

    return expect(this.ns.startup).to.be.fulfilled.then(i => {
      var model = this.ns.model('test');
      model.get('foo');
      expect(this.source.test).to.be.calledOnce.and.to.be.calledWith('foo');
    });
  });

  it('should throw if requested model is not found', function() {
    expect(i => this.ns.model('no-such-model'))
      .to.throw('Model not found: no-such-model');
  });

  it('should throw when attempting to create a duplicate model', function() {
    this.ns.model('test', 'test-data', i => Object.create(null));
    this.ns.model('test', 'test-data', i => modObject.create(null));
    expect(this.ns.startup).to.be.rejectedWith('Model already exists: test');
  });

  it('should emit events via Ignis object', function() {

    this.ns.model('test', 'test-data', function(data) {
      return { foo: function() { this.emit('foo'); } };
    });

    this.ns.emit = Sinon.spy();
    return expect(this.ns.startup).to.be.fulfilled.then(i => {
      var model = this.ns.model('test');
      model.foo();
      expect(this.ns.emit)
        .to.be.calledOnce.and
        .to.be.calledWith('model.test.foo');
    });
  });

  it('should allow construction of models in \'constructor style\'', function() {
    this.ns.model('test', 'test-data', function() { this.foo = 'bar'; });
    return expect(this.ns.startup).to.be.fulfilled.then(i => {
      expect(this.ns.model('test')).to.have.property('foo', 'bar');
    });
  });

});
