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
    this.meta = {
      path: 'POST /test/',
      auth: 'token',
      handler: function() { }
    };

    this.ns = {
      factories: [ function(ignis, options) { return options.auth; } ],
      mount:     Mount.mount,
      root: { post: Sinon.spy() }
    };

  });


  it('should create and mount a middleware stack', function() {
    this.ns.mount('/foo/:bar', this.meta);

    var router = this.ns.root.post;
    expect(router).to.be.calledOnce;
    expect(router).to.be.calledWith('/foo/:bar/test', 'token');
    expect(router.firstCall.args[2]).to.be.a('function');
  });

  it('should handle endpoint with multiple paths', function() {
    this.meta.path = [ 'POST /test/', 'POST /foo', 'POST /bar' ];
    this.ns.mount('/foo/:bar', this.meta);

    const router = this.ns.root.post;
    expect(router).to.be.calledThrice;
    expect(router).to.be.calledWith('/foo/:bar/test', 'token');
    expect(router).to.be.calledWith('/foo/:bar/foo', 'token');
    expect(router).to.be.calledWith('/foo/:bar/bar', 'token');
    expect(router.firstCall.args[2]).to.be.a('function');
  });

  it('should throw on invalid mount path', function() {
    this.meta.path = 'POST/test';

    expect(function() {
      this.ns.mount('/', this.meta);
    }.bind(this)).to.throw('Invalid mount path: ');
  });

  it('should throw on missing mount path', function() {
    this.meta.path = undefined;

    expect(function() {
      this.ns.mount('/', this.meta);
    }.bind(this)).to.throw('Mount path is missing or empty.');
  });

  it('should throw on empty mount path', function() {
    this.meta.path = [ ];

    expect(function() {
      this.ns.mount('/', this.meta);
    }.bind(this)).to.throw('Mount path is missing or empty.');
  });

  it('should throw on invalid method', function() {
    this.meta.path = 'DOSOMETHING /test';

    expect(function() {
      this.ns.mount('/', this.meta);
    }.bind(this)).to.throw('HTTP verb not supported: ');
  });

  it('should throw on bad handler', function() {
    this.meta.handler = null;

    expect(function() {
      this.ns.mount('/foo/:bar', this.meta);
    }.bind(this)).to.throw('Expected handler to be a function but got');
  });

  it('should handle ES6 module required from CommonJS', function() {
    this.meta = { __esModule: true, default: this.meta };

    this.ns.mount('/foo/:bar', this.meta);

    var router = this.ns.root.post;
    expect(router).to.be.calledOnce;
    expect(router).to.be.calledWith('/foo/:bar/test', 'token');
    expect(router.firstCall.args[2]).to.be.a('function');
  });

});
