/**
 * test/data/source.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');
var DataSource     = require('../../lib/data/source').source;

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;



describe('source(1)', function() {

  beforeEach(function() { DataSource.clear(); });

  it('should connect if sync callback succeeds', function() {

    var fake = { test: 0 };
    var promise = DataSource('test', function() { return fake; });

    expect(promise).be.fulfilled.and.eventually.equal(fake).then(function() {
      expect(DataSource('test')).to.equal(fake);
    });

  });

  it('should connect if async callback succeeds', function() {

    var fake = { test: 1 };
    var promise = DataSource('test', function() {
      return Bluebird.resolve(fake);
    });

    expect(promise).be.fulfilled.and.eventually.equal(fake).then(function() {
      expect(DataSource('test')).to.equal(fake);
    });

  });

  it('should reject if sync callback fails', function() {
    var fake = { test: 2 };
    var promise = DataSource('test', function() {
      throw new Error('Test Error');
    });

    expect(promise).to.be.rejectedWith('Test Error');
  });

  it('should reject if async callback fails', function() {
    var fake = { test: 2 };
    var promise = DataSource('test', function() {
      return Bluebird.reject(new Error('Test Error'));
    });

    expect(promise).to.be.rejectedWith('Test Error');
  });

  it('should reject on attempt to overwrite the connection', function() {
    var fake = { test: 4 };
    var promise = DataSource('test', function() { return fake; });
    expect(promise).be.fulfilled.and.eventually.equal(fake).then(function() {
      var promise2 = DataSource('test', function() { return { test: 5 }; });
      expect(promise2).to.be.rejectedWith('Data source exists: test');
    });
  });

  it('should correctly pass parameters to the callback', function() {

    var fake = { foo: 'bar' };
    var promise = DataSource('test', function(a, b) {
      expect(a).to.equal(0);
      expect(b).to.equal(1);
      return fake;
    }, 0, 1);

    expect(promise).to.be.fulfilled.and.eventually.equal(fake);

  });

  it('should mount the source function to the specified namespace', function() {
    var extension = require('../../lib/data/source').default;
    var namespace = Object.create(null);

    extension(namespace);
    expect(namespace.source).to.be.a('function').and.equal(DataSource);
  });

  it('should correctly add promise to a namespace', function() {
    var namespace = { wait: Sinon.spy(), source: DataSource };

    var promise = namespace.source('test', function() { return { a: 'b' }; });
    expect(namespace.wait.calledOnce).to.equal(true);
    expect(namespace.wait.calledWith(promise)).to.equal(true);
  });

  it('should reject if callback returns a falsy value', function() {

    var promise = DataSource('test', function() { return null; });
    expect(promise).to.be.rejectedWith('Data source callback returned falsy value.');

  });

});
