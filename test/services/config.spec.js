/**
 * test/config.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

process.env.CONFIG_PREFIX = 'test/.fixtures';

const ConfigService = dofile('lib/services/config');


describe('Ignis.ConfigService', function() {

  beforeEach(function() {
    this.config = new ConfigService(this.ignis);
  });

  describe('set(key, value)', function() {

    it('should set a config value with a simple key', function() {
      this.config.set('foo', 'bar');

      const actual = this.config[ConfigService.$$data];
      expect(actual)
        .to.have.property('foo', 'bar');
    });

    it('should set a config value with a nested key', function() {
      this.config.set('foo.bar.baz', 'hello_world');

      const actual = this.config[ConfigService.$$data];
      expect(actual)
        .to.have.deep.property('foo.bar.baz', 'hello_world');
    });

    it('should emit events', function() {
      this.config.set('foo', 'bar');
      expect(this.emit)
        .to.be.calledOnce
        .to.be.calledWith('config.set');

      this.config.set('foo', 'baz');
      expect(this.emit)
        .to.be.calledTwice
        .to.be.calledWith('config.modified');
    });

    it('should substitute envars', function() {
      this.config.set('foo', { bar: '$NODE_ENV' });

      const actual = this.config[ConfigService.$$data];
      expect(actual)
        .to.have.deep.property('foo.bar', process.env.NODE_ENV);

    });

    it('should fail when a referenced envar is missing', function() {
      expect(() =>
        this.config.set('foo', { bar: '$NO_SUCH_VAR' })
      ).to.throw('Missing envar: NO_SUCH_VAR');
    });

  });

  describe('get(key)', function() {

    it('should get a value with a simple key', function() {
      const config = this.config[ConfigService.$$data];
      config.foo = 'bar';

      const actual = this.config.get('foo');
      expect(actual)
        .to.equal('bar');
    });

    it('should get a value with a nested key', function() {
      const config = this.config[ConfigService.$$data];
      config.foo = { bar: { baz: 'hello_world' } };

      const actual = this.config.get('foo.bar.baz');
      expect(actual)
        .to.equal('hello_world');
    });

    it('should fail if value is missing but required', function() {
      expect(() => {
        this.config.get('hola');
      }).to.throw('Config option \'hola\' is not defined.');
    });

    it('should not fail if value is missing but optional', function() {
      const actual = this.config.get('hola', true);
      expect(actual)
        .not.to.exist;
    });

  });

  describe('file(path)', function() {

    it('should load the file', function() {
      const path = require('path').resolve(__dirname, '../.fixtures/test.json');

      this.config.file(path);

      const config = this.config[ConfigService.$$data];
      expect(config)
        .to.deep.equal({ test: { foo: 'bar' } });
    });

  });

  describe('init()', function() {

    it('should auto load config files in CONFIG_PREFIX', co(function*() {

      yield this.config.init();

      const config = this.config[ConfigService.$$data];
      expect(config)
        .to.have.deep.property('hello.world.test', true);
      expect(config)
        .to.have.deep.property('test.foo', 'bar');

    }));

  });

  describe('postinit()', function() {

    it('should attach shortcut methods to Ignis root', function() {
      this.config.postinit();

      expect(this.ignis)
        .to.have.property('config')
        .that.is.a('function');

    });

  });
});
