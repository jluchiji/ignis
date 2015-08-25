var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var envar          = require('../../lib/config/envar');

describe('env(1)', function() {

  beforeEach(function() {
    process.env.FOO = 'bar';
    this.ns = {
      emit:   Sinon.spy(),
      config: Sinon.spy()
    };
    this.ns.config.env = envar.env.bind(this.ns);
  });

  it('should add specified environment variables to config', function() {
    this.ns.config.env({ 'FOO': 'Test variable 1.'});
    expect(this.ns.config)
      .to.be.calledOnce.and
      .to.be.calledWith('env.FOO', 'bar');
  });

  it('should emit \'config.missing\' when a envar is undefiend', function() {
    this.ns.config.env({ 'NO-SUCH-VAR': 'Test variable 2.'});
    expect(this.ns.emit)
      .to.be.calledOnce.and
      .to.be.calledWith('config.missing');
    expect(this.ns.emit.firstCall.args[1]).to.deep.equal({
      name: 'NO-SUCH-VAR',
      description: 'Test variable 2.'
    });
  });

});

describe('extension', function() {

  it('should mount the extension', function() {
    var ns = { config: Object.create(null) };
    envar.default(ns);
    expect(ns.config.env).to.be.a('function');
  });

});
