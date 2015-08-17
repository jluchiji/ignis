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
    DataSource.disconnect();
    DataSource(sourceCb).then(function() { done(); });
  });

  it('should create a model with the data connection', function() {
    var source = this.source;

    Model('test', function(data) {
      expect(data).to.equal(source);
      return { get: data.test };
    });

    var model = Model('test');
    expect(model).to.have.property('get');
    expect(model.get).to.be.a('function');

    model.get('foo');
    expect(source.test.calledWith('foo')).to.equal(true);

  });

  it('should attach the model to the model store', function() {
    var source = this.source;

    Model('test', function(data) { return { get: data.test }; });

    var model = Model('test');
    expect(model).to.have.property('get');
    expect(model.get).to.be.a('function');
  });

  it('should proxy calls to the data source', function() {
    var source = this.source;

    Model('test', function(data) {
      expect(data).to.equal(source);
      return { get: data.test };
    });

    var model = Model('test');
    model.get('foo');
    expect(source.test.calledWith('foo')).to.equal(true);
  });

});
