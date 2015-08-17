/**
 * test/data/model.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');

var DataSource     = require('../../lib/data/source');
var Model          = require('../../lib/data/model');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;



describe('model(2)', function() {

  beforeEach(function(done) {
    var source = this.source = { test: Sinon.spy() };
    var sourceCb = function() { return source; };

    Model.clear();
    DataSource.clear();
    DataSource('test-data', sourceCb).then(function() { done(); });
  });

  it('should create a model with the data connection', function() {
    var source = this.source;

    Model('test', 'test-data', function(data) {
      expect(data).to.equal(source);
      return { get: data.test };
    });

  });

  it('should attach the model to the model store', function() {
    var source = this.source;

    Model('test', 'test-data', function(data) { return { get: data.test }; });

    var model = Model('test');
    expect(model).to.have.property('get');
    expect(model.get).to.be.a('function');
  });

  it('should proxy calls to the data source', function() {
    var source = this.source;

    Model('test', 'test-data', function(data) {
      expect(data).to.equal(source);
      return { get: data.test };
    });

    var model = Model('test');
    model.get('foo');
    expect(source.test.calledWith('foo')).to.equal(true);
  });

  it('should throw if requested model is not found', function() {
    expect(function() {
      Model('no-such-model');
    }).to.throw('Model not found: no-such-model');
  });

  it('should throw if requested data source is not found', function() {
    expect(function() {
      Model('test', 'no-such-source', function(data) { return null; });
    }).to.throw('Data source not found: no-such-source');
  });

  it('should throw when attempting to create a duplicate model', function() {
    var source = this.source;

    Model('test', 'test-data', function() { return source; });
    expect(Model('test')).to.equal(source);

    expect(function() {
      Model('test', 'test-data', function() { return source; });
    }).to.throw('Model already exists: test');

  });
});
