/**
 * test/data/index.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
/* jshint -W030 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');

var Data           = require('../../lib/data');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

describe('extension', function() {

  it('should mount the extension', function() {
    var ns = Object.create(null);
    Data(ns);

    expect(ns.__sources).to.be.an.instanceOf(Map);
    expect(ns.__models).to.be.an.instanceOf(Map);
    expect(ns.source).to.be.a('function');
    expect(ns.model).to.be.a('function');
  });

});
