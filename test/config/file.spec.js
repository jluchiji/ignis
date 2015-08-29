/**
 * test/config/file.spec.js
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
var config         = require('../../lib/config');

describe('file(1)', function() {

  beforeEach(function() {
    this.ignis = new Ignis();
    this.ignis.use(config);

    let file = this.ignis.config.file;
    this.ignis.config = Sinon.spy(this.ignis.config);
    this.ignis.config.file = file.bind(this.ignis);
    this.ignis.emit = Sinon.spy(this.ignis.emit);
  });

  it('should load the JSON config file', function() {
    this.ignis.config.file('test/fixtures/config.json');

    expect(this.ignis.config)
      .to.be.calledOnce.and
      .to.be.calledWith('config');

    let value = this.ignis.config('config.foo');

    expect(value).to.equal('bar');
  });

  it('should load the YAML config file', function() {
    this.ignis.config.file('test/fixtures/config.yaml');

    expect(this.ignis.config)
      .to.be.calledOnce.and
      .to.be.calledWith('config');

    let value = this.ignis.config('config.foo');

    expect(value).to.equal('bar');
  });

  it('should fail if the specified file does not exist', function() {
    expect(i => this.ignis.config.file('test/fixtures/enoent.json')).to.throw();
  });

  it('should fail if config file is not JSON or YAML', function() {
    expect(i => this.ignis.config.file('test/fixtures/enoent.txt')).to.throw();
  });

});
