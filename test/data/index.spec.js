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
var Ignis          = require('../../lib/core');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

describe('extension', function() {

  it('should mount the extension', function() {
    var ignis = new Ignis();
    ignis.use(Data);

    return ignis.startup.then(() => {
      expect(ignis.source).to.be.a('function');
      expect(ignis.model).to.be.a('function');
    });

  });

});
