var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var envar          = require('../../lib/config/envar');

describe('envar', function() {

  it('should add environment variables to config', function() {
    process.env.FOO = 'bar';

    var namespace = {
      emit:   function() { },
      config: Sinon.spy()
    };
    envar(namespace);

    expect(namespace.config.calledWith('FOO', 'bar')).to.equal(true);
  });

});
