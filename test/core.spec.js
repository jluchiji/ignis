/**
 * test/core.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Ignis = dofile('lib/core');
const Service = dofile('lib/service');
const DataSource = dofile('lib/data-source');
const Bluebird = require('bluebird');


describe('Ignis.Core', function() {

  it('should create an Ignis instance', function() {

    const actual = new Ignis();

    expect(actual)
      .to.be.an.instanceOf(Ignis);
    expect(actual)
      .to.have.property('startup', null);

  });

  beforeEach(function() {
    this.ignis = new Ignis();

    this.derived = function TestService() { };
    this.derived.prototype = new Service(this.ignis);

    this.ignis.use(() => { });
  });

  describe('use(service)', function() {

    it('should register a Service instance', function() {

      this.ignis.use(this.derived);

      const services = Ignis[Ignis.$$services];
      expect(services.has(this.derived))
        .to.be.true;

    });

    it('should invoke a callback', function() {

      const callback = Sinon.spy();

      this.ignis.use(callback);

      expect(callback)
        .to.be.calledOnce
        .to.be.calledWith(this.ignis);

    });

    it('should unwrap ES6 modules', function() {
      const service = { __esModule: true, default: Sinon.spy() };
      this.ignis.use(service);

      expect(service.default)
        .to.be.calledOnce
        .to.be.calledWith(this.ignis);
    });

    it('should fail if argument is not a Service or a function', function() {
      expect(() => this.ignis.use({ }))
        .to.throw('Unexpected service type.');
    });

  });

  describe('service(name)', function() {

    it('should find a service', function() {
      this.ignis[Ignis.$$services].set('foo', { name: 'bar', ready: true });

      const actual = this.ignis.service('foo');

      expect(actual)
        .to.deep.equal({ name: 'bar', ready: true });
    });

    it('should fail if service is not found', function() {
      expect(() => this.ignis.service('test'))
        .to.throw('Service [test] is not defined.');
    });

    it('should fail if service is not ready', function() {
      this.ignis[Ignis.$$services].set('foo', { name: 'bar', ready: false });

      expect(() => this.ignis.service('foo'))
        .to.throw('Service [foo] is not ready.');
    });

  });

  describe('model(name)', function() {

    it('should find a data model', co(function*() {
      const source = function FooBarDataSource() { };
      source.prototype = new DataSource(this.ignis);

      this.ignis.use(source);

      yield this.ignis.init();

      const actual = this.ignis.model('foo-bar');
      expect(actual)
        .to.exist
        .to.be.an.instanceOf(source);
    }));

  });

  describe('init()', function() {

    beforeEach(function() {
      this.ignis = new Ignis();

      this.oneService = function oneService() { };
      this.oneService.prototype = new Service(this.ignis);
      this.oneService.prototype.init = Sinon.spy(() => Bluebird.resolve());

      this.twoService = function twoService() { };
      this.twoService.prototype = new Service(this.ignis);
      this.twoService.prototype.init = Sinon.spy(() => Bluebird.resolve());

      Service.deps('one')(this.twoService);

      this.ignis.use(this.twoService);
      this.ignis.use(this.oneService);
    });

    it('should call Service.init() once per service', co(function*() {

      yield this.ignis.init();

      expect(this.oneService.prototype.init)
        .to.be.calledOnce;
      expect(this.twoService.prototype.init)
        .to.be.calledOnce;
    }));

    it('should call Service.init() in dependency order', co(function*() {
      yield this.ignis.init();

      expect(this.oneService.prototype.init)
        .to.be.calledBefore(this.twoService.prototype.init)
        .to.be.calledOnce;
    }));

  });

});
