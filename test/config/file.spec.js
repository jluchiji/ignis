/**
 * test/config/file.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Ignis          = dofile('lib/core');
const config         = dofile('lib/config');

describe('file(1)', function() {

  beforeEach(function() {
    Ignis.use(config);
    this.ignis = new Ignis();

    const file = this.ignis.config.file;
    this.ignis.config = Sinon.spy(this.ignis.config);
    this.ignis.config.file = file.bind(this.ignis);
    this.ignis.emit = Sinon.spy(this.ignis.emit);

    return this.ignis.startup;
  });

  it('should load the JSON config file', function() {
    this.ignis.config.file('test/fixtures/config.json');

    expect(this.ignis.config)
      .to.be.calledOnce.and
      .to.be.calledWith('config');

    const value = this.ignis.config('config.foo');

    expect(value).to.equal('bar');
  });

  it('should load the YAML config file', function() {
    this.ignis.config.file('test/fixtures/config.yaml');

    expect(this.ignis.config)
      .to.be.calledOnce.and
      .to.be.calledWith('config');

    const value = this.ignis.config('config.foo');

    expect(value).to.equal('bar');
  });

  it('should fail if the specified file does not exist', function() {
    expect(() => this.ignis.config.file('test/fixtures/enoent.json')).to.throw();
  });

  it('should fail if config file is not JSON or YAML', function() {
    expect(() => this.ignis.config.file('test/fixtures/enoent.txt')).to.throw();
  });

});
