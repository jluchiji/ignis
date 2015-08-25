/**
 * test/data/source.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
/* jshint -W030 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');
var Source         = require('../../lib/data/source');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;



describe('source(1)', function() {

  beforeEach(function() {
    this.ns = {
      __sources: new Map(),
      source:    Source.source,
      wait:      Sinon.spy()
    };
  });

  it('should connect if sync callback succeeds', function() {

    var fake = { test: 0 };
    var promise = this.ns.source('test', function() { return fake; });

    expect(promise).be.fulfilled.and.eventually.equal(fake).then(function() {
      expect(this.ns.source('test')).to.equal(fake);
    }.bind(this));

  });

  it('should connect if async callback succeeds', function() {

    var fake = { test: 1 };
    var promise = this.ns.source('test', function() {
      return Bluebird.resolve(fake);
    });

    expect(promise).be.fulfilled.and.eventually.equal(fake).then(function() {
      expect(this.ns.source('test')).to.equal(fake);
    }.bind(this));

  });

  it('should reject if sync callback fails', function() {
    var fake = { test: 2 };
    var promise = this.ns.source('test', function() {
      throw new Error('Test Error');
    });

    expect(promise).to.be.rejectedWith('Test Error');
  });

  it('should reject if async callback fails', function() {
    var fake = { test: 2 };
    var promise = this.ns.source('test', function() {
      return Bluebird.reject(new Error('Test Error'));
    });

    expect(promise).to.be.rejectedWith('Test Error');
  });

  it('should reject on attempt to overwrite the connection', function() {
    var fake = { test: 4 };
    var promise = this.ns.source('test', function() { return fake; });
    expect(promise).be.fulfilled.and.eventually.equal(fake).then(function() {
      var promise2 = this.ns.source('test', function() {
        return { test: 5 };
      });
      expect(promise2).to.be.rejectedWith('Data source exists: test');
    }.bind(this));
  });

  it('should correctly pass parameters to the callback', function() {

    var fake = { foo: 'bar' };
    var promise = this.ns.source('test', function(a, b) {
      expect(a).to.equal(0);
      expect(b).to.equal(1);
      return fake;
    }, 0, 1);

    expect(promise).to.be.fulfilled.and.eventually.equal(fake);

  });

  it('should correctly add promise to a namespace', function() {
    var promise = this.ns.source('test', function() { return { a: 'b' }; });
    expect(this.ns.wait).to.be.calledOnce.and.to.be.calledWith(promise);
  });

  it('should reject if callback returns a falsy value', function() {

    var promise = this.ns.source('test', function() { return null; });
    expect(promise).to.be.rejectedWith('Data source callback returned falsy value.');

  });

  it('should throw if data source is not found', function() {
    expect(function() {
      this.ns.source('no-such-source');
    }.bind(this)).to.throw('Data source not found: no-such-source');
  });

});

describe('extension', function() {

  it('should mount the extension', function() {
    var ns = Object.create(null);
    Source.default(ns);

    expect(ns.__sources).to.be.an.instanceOf(Map);
    expect(ns.source).to.be.a('function').and.equal(Source.source);
  });

});
