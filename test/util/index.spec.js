/**
 * test/util/index.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var extension      = require('../../lib/util');


describe('extension', function() {

  it('should mount the extension', function() {
    var ns = Object.create(null);
    extension(ns);

    expect(ns).to.have.property('util');
    expect(ns.util.symbols).to.be.an('object');
    expect(ns.util.expressify).to.be.a('function');
    expect(ns.util.unpromisify).to.be.a('function');
  });

});
