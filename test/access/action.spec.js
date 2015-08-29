/**
 * test/access/action.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');
var Authorized     = require('authorized');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var Ignis          = require('../../lib/core');
var extension      = require('../../lib/access');

describe('action(2)', function() {

  before(function() { Authorized._action = Authorized.action; });
  after(function() { Authorized.action = Authorized._action; });

  beforeEach(function() {
    Authorized.action = Sinon.spy();

    this.ignis = new Ignis();
    this.ignis.use(extension);
  });

  it('should proxy the call to Authorized.action', function() {
    this.ignis.access.action('test', ['role']);

    expect(Authorized.action).to.be.calledOnce;
  });

});
