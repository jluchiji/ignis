var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var target         = require('../../lib/config/index');

describe('config(2)', function() {

  beforeEach(function() {
    this.namespace = {
      emit:   Sinon.spy(),
      config: target.config
    };
    target.config.clear();
  });

  it('should get/set the config value', function() {

    this.namespace.config('foo', 'bar');
    var result = this.namespace.config('foo');

    expect(result).to.equal('bar');

  });

  it('should throw when getting an undefined config', function() {
    var ns = this.namespace;

    expect(function() {
      ns.config('foo');
    }).to.throw('Config option \'foo\' is not defined.');

  });

  it('should emit events when config values change', function() {

    this.namespace.config('foo', 'bar');
    expect(this.namespace.emit.calledOnce).to.equal(true);
    expect(this.namespace.emit.calledWith('config.set')).to.equal(true);

    this.namespace.config('foo', 'test');
    expect(this.namespace.emit.calledTwice).to.equal(true);
    expect(this.namespace.emit.calledWith('config.modified')).to.equal(true);

  });

  it('should mount to a namespace', function() {

    var namespace = Object.create(null);
    target.default(namespace);

    expect(namespace.config).to.be.a('function').and.equal(target.config);
  });

});
