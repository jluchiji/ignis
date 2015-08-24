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

var Mount          = require('../../lib/routing/mount');

describe('mount(2)', function() {

  beforeEach(function() {
    this.handler = {
      path:  'POST /test/',
      auth:  'token',
      status: 201
    };

    this.ns = {
      factories: [ Sinon.spy(function(ignis, options) { return options; }) ],
      mount:  Mount.mount,
      root: { post: Sinon.spy() }
    };

  });


  it('should create and mount a middleware stack', function() {
    this.ns.mount('/foo/:bar', this.handler);

    var router = this.ns.root.post;
    expect(router.calledOnce).to.equal(true);
    expect(router.calledWith('/foo/:bar/test', this.handler)).to.equal(true);
    expect(router.firstCall.args[2]).to.be.a('function');
  });

  it('should throw on invalid mount path', function() {
    this.handler.path = 'POST/test';

    expect(function() {
      this.ns.mount('/', this.handler);
    }.bind(this)).to.throw('Invalid mount path: ');
  });

  it('should throw on invalid method', function() {
    this.handler.path = 'DOSOMETHING /test';

    expect(function() {
      this.ns.mount('/', this.handler);
    }.bind(this)).to.throw('HTTP verb not supported: ');
  });

});
