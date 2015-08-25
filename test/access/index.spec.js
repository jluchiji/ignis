/**
 * test/access/index.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
/* jshint -W030 */
var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');
var Authorized     = require('authorized');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var extension      = require('../../lib/access/index');

describe('accessFactory(2)', function() {

  before(function() { Authorized._can = Authorized.can; });
  after(function() { Authorized.can = Authorized._can; });
  beforeEach(function() {
    Authorized.can = Sinon.spy(function() {
      return function() { };
    });
});

  it('should create an authorization middleware', function() {
    var mware = extension.accessFactory(null, { access: 'test' });

    expect(mware).to.be.a('function');
    expect(Authorized.can).to.be.calledOnce;
    var args = Authorized.can.firstCall.args;
    expect(args).to.have.members(['test']);
  });

  it('should handle an array of actions', function() {
    var mware = extension.accessFactory(null, { action: ['test', 'foo'] });

    expect(mware).to.be.a('function');
    expect(Authorized.can).to.be.calledOnce;
    var args = Authorized.can.firstCall.args;
    expect(args).to.have.members(['test', 'foo']);
  });

  it('should generate null if no actions specified', function() {
    var mware = extension.accessFactory(null, { });

    expect(Authorized.can.callCount).to.equal(0);
    expect(mware).to.be.null;
  });
});

describe('extension', function() {

  it('should mount the extension', function() {
    var ns = Object.create(null);
    ns.factories = [];
    extension.default(ns);

    expect(ns).to.have.property('access');
    expect(ns.factories).to.have.length(1);
    expect(ns.factories[0]).to.equal(extension.accessFactory);
    expect(ns).to.have.deep.property('access.role');
    expect(ns).to.have.deep.property('access.action');
    expect(ns).to.have.deep.property('access.scope');
  });

});
