/**
 * test/endpoint.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Ignis = dofile('lib/core');
const Service = dofile('lib/service');
const EndpointService = dofile('lib/services/endpoint');


describe('Ignis.Http.EndpointService', function() {

  beforeEach(function() {
    this.ignis = new Ignis();

    this.derived = function TestService() { };
    this.derived.prototype = new EndpointService(this.ignis);
  });

  describe('async init()', function() {

    it('should fail if Ignis.Http is not ready', function() {
      this.ignis.use(this.derived);

      const promise = this.ignis.init();
      expect(promise)
        .to.be.rejectedWith('Service [http] is not ready.');
    });

  });

  describe('postinit()', function() {

    beforeEach(function() {
      this.cb = Sinon.spy();
      const HttpService = function HttpService() { };
      HttpService.prototype = new Service(this.ignis);
      HttpService.prototype.mount = this.cb;

      this.ignis.use(HttpService);
      Service.deps('http')(this.derived);
    });

    it('should fail if EndpointService has no mount path', function() {
      this.ignis.use(this.derived);
      const promise = this.ignis.init();

      expect(promise)
        .to.be.rejectedWith('EndpointService must have a mount path');
    });

    it('should fail if method has no mount path', function() {
      EndpointService.path('/')(this.derived);
      this.derived.prototype.foo = function() { };
      EndpointService.option('foo', 'bar')(this.derived.prototype, 'foo');
      this.ignis.use(this.derived);
      const promise = this.ignis.init();

      expect(promise)
        .to.be.rejectedWith('Endpoint method [foo] must have a mount path');
    });

    it('should mount methods with options', co(function*() {
      EndpointService.path('/test')(this.derived);
      EndpointService.option('foo', 'bar')(this.derived);
      EndpointService.option('greeting', 'hello')(this.derived);

      this.derived.prototype.foo = function() { };
      EndpointService.option('foo', 'baz')(this.derived.prototype, 'foo');
      EndpointService.path('POST /', 123)(this.derived.prototype, 'foo');
      this.ignis.use(this.derived);
      yield this.ignis.init();

      expect(this.cb)
        .to.be.calledOnce
        .to.be.calledWith('/test');
      const arg = this.cb.firstCall.args[1];
      expect(arg)
        .to.deep.equal({
          path: 'POST /',
          status: 123,
          foo: 'baz',
          greeting: 'hello',
          handler: this.derived.prototype.foo
        });
    }));

  });

  describe('@path', function() {

    it('should set path if called on class', function() {
      EndpointService.path('GET /')(this.derived);
      const actual = Service.meta(this.derived, 'endpoint_options');

      expect(actual)
        .to.deep.equal({ path: 'GET /', status: 200 });
    });

    it('should set path if called on property', function() {
      this.derived.test = { };
      EndpointService.path('GET /', 201)(this.derived.prototype, 'test', { });
      const actual = this.derived.prototype[EndpointService.$$options];

      expect(actual)
        .to.deep.equal({ test: { path: 'GET /', status: 201 } });
    });

  });

});
