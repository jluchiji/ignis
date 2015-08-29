/**
 * test/config/envar.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
/* jshint -W030 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var Ignis          = require('../../lib/core');
var envar          = require('../../lib/config');

describe('env(1)', function() {

  beforeEach(function() {
    this.ignis = new Ignis();
    this.ignis.use(envar);
    let env = this.ignis.config.env;
    this.ignis.config = Sinon.spy(this.ignis.config);
    this.ignis.config.env = env.bind(this.ignis);
    this.ignis.emit = Sinon.spy(this.ignis.emit);
  });

  it('should add specified environment variables to config', function() {
    process.env.FOO = 'bar';
    this.ignis.config.env({ 'FOO': 'Test variable 1.'});
    expect(this.ignis.config)
      .to.be.calledOnce.and
      .to.be.calledWith('env.FOO', 'bar');
  });

  it('should emit \'config.missing\' when a envar is undefiend', function() {
    this.ignis.config.env({ 'NO-SUCH-VAR': 'Test variable 2.'});
    expect(this.ignis.emit)
      .to.be.calledOnce.and
      .to.be.calledWith('config.missing');
    expect(this.ignis.emit.firstCall.args[1]).to.deep.equal({
      name: 'NO-SUCH-VAR',
      description: 'Test variable 2.'
    });
  });

});
