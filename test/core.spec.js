/**
 * test/core.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Ignis = dofile('lib/core');
const Service = dofile('lib/service');
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
    this.derived.hello = Sinon.spy();
    this.derived.world = Sinon.spy();

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

    it('should attach service exports to Ignis.prototype', function() {

      Service.export()(this.derived, 'hello');
      this.ignis.use(this.derived);

      expect(Ignis.prototype)
        .to.have.property('hello')
        .that.is.a('function');

      Ignis.prototype.hello();

      expect(this.derived.hello)
        .to.be.calledOnce;

    });

    it('should allow static exports to Ignis class', function() {
      Ignis.exports = { };

      Service.export({ static: true })(this.derived, 'hello');
      Service.export({ static: true, path: 'foo.bar' })(this.derived, 'world');
      this.ignis.use(this.derived);

      expect(Ignis.exports)
        .to.have.property('hello')
        .that.is.a('function');
      expect(Ignis.exports)
        .to.have.deep.property('foo.bar')
        .that.is.a('function');

      Ignis.exports.hello();
      Ignis.exports.foo.bar();

      expect(this.derived.hello)
        .to.be.calledOnce;
      expect(this.derived.world)
        .to.be.calledOnce;
    });

    it('should pass on assigments to actual exports if not readonly', function() {

      Service.export()(this.derived, 'world');
      this.ignis.use(this.derived);

      this.ignis.world = 'test';

      expect(this.derived.world)
        .to.equal('test');

    });

    it('should refuse to register abstract services', function() {

      Service.abstract(this.derived);

      expect(() => {
        this.ignis.use(this.derived);
      }).to.throw('TestService is abstract, you need to extend it first.');

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

  describe('env(expr)', function() {

    before(function() { this._env = process.env.NODE_ENV; });
    after(function() { process.env.NODE_ENV = this._env; });

    it('should match NODE_ENV', function() {
      process.env.NODE_ENV = 'DeVelopment';
      expect(this.ignis.env('staging|dev'))
        .to.be.true;
      expect(this.ignis.env('staging|prod'))
        .to.be.false;
    });

    it('should use regex if one is provided', function() {
      process.env.NODE_ENV = 'DeVelopment';
      expect(this.ignis.env(/^DeVelopment$/))
        .to.be.true;
      expect(this.ignis.env(/^development$/))
        .to.be.false;
    });

  });

});
