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

var Ignis          = require('../../lib/ignis').Ignis;
var target         = require('../../lib/routing/index');

describe('endpoint(2)', function() {

  beforeEach(function() {
    this.ns = new Ignis();
    target.default(this.ns);
  });

  it('should mount an endpoint', function() {

    var fn = Sinon.spy();
    this.ns.endpoint('/test', fn);

    return expect(this.ns.startup).to.be.fulfilled.then(i => {
      expect(fn).to.be.calledOnce.and.to.be.calledWith('/test', this.ns);
    })
  });

  it('should not mount an endpoint that is already mounted', function() {

    var fn = Sinon.spy();
    this.ns.endpoint('/test', fn);
    this.ns.endpoint('/test2', fn);

    return expect(this.ns.startup).to.be.fulfilled.then(i => {
      expect(fn).to.be.calledOnce.and.to.be.calledWith('/test');
    });

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
