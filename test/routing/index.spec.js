/**
 * test/routing/mount.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var target         = require('../../lib/routing/index');

describe('endpoint(2)', function() {

  beforeEach(function() {
    this.ns = { endpoint: target.endpoint };
  });

  it('should mount an endpoint', function() {

    var fn = Sinon.spy();
    this.ns.endpoint('/test', fn);

    expect(fn.calledOnce).to.equal(true);
    expect(fn.calledWith('/test', this.ns)).to.equal(true);
  });

  it('should not mount an endpoint that is already mounted', function() {

    var fn = Sinon.spy();
    this.ns.endpoint('/test', fn);
    this.ns.endpoint('/test2', fn);

    expect(fn.calledOnce).to.equal(true);
  });

});

describe('extension', function() {

  it('should mount the extension', function() {
    var ns = Object.create(null);
    target.default(ns);

    expect(ns.mount).to.be.a('function');
    expect(ns.endpoint).to.be.a('function');
  });

});
