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

var Ignis          = require('../../lib/core');
var target         = require('../../lib/routing/index');

describe('endpoint(2)', function() {

  beforeEach(function() {
    this.ignis = new Ignis();
  });

  it('should mount the extension', function() {
    this.ignis.use(target);

    expect(this.ignis.mount).to.be.a('function');
    expect(this.ignis.endpoint).to.be.a('function');
  });

  it('should mount an endpoint', function() {
    var fn = Sinon.spy();
    this.ignis.endpoint('/test', fn);

    return expect(this.ignis.startup).to.be.fulfilled.then(i => {
      expect(fn).to.be.calledOnce.and.to.be.calledWith('/test', this.ignis);
    })
  });

  it('should not mount an endpoint that is already mounted', function() {

    var fn = Sinon.spy();
    this.ignis.endpoint('/test', fn);
    this.ignis.endpoint('/test2', fn);

    return expect(this.ignis.startup).to.be.fulfilled.then(i => {
      expect(fn).to.be.calledOnce.and.to.be.calledWith('/test');
    });

  });

});
